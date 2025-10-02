import pandas as pd
import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np

# --- 1. SET UP THE FASTAPI APP ---
app = FastAPI(
    title="Exoplanet Classifier API",
    description="An API to predict exoplanet classifications based on transit data.",
    version="1.0.0"
)

# Allow CORS for frontend communication (useful for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- 2. LOAD THE TRAINED MODEL AND SCALER ---
# Load the artifacts at startup to avoid reloading them on every request.
try:
    model = joblib.load('exoplanet_rf_model.joblib')
    scaler = joblib.load('scaler.joblib')
    print("✓ Model and scaler loaded successfully.")
except FileNotFoundError:
    print("✗ Error: Model or scaler files not found. Make sure they are in the 'backend' directory.")
    model = None
    scaler = None

# --- 3. DEFINE THE INPUT DATA MODEL USING PYDANTIC ---
# This ensures the input data has the correct format and types.
class ExoplanetData(BaseModel):
    fp_flag_nt: float
    fp_flag_ss: float
    fp_flag_co: float
    fp_flag_ec: float
    orbital_period_days: float
    transit_epoch_bjd: float
    transit_duration_hr: float
    transit_depth_ppm: float
    planet_radius_earth: float
    equilibrium_temp_k: float
    insolation_flux_earth: float
    impact_parameter: float
    stellar_eff_temp_k: float
    stellar_logg_cm_s2: float
    stellar_radius_solar: float

# --- 4. CREATE THE PREDICTION ENDPOINT ---
@app.post("/predict")
def predict_exoplanet(data: ExoplanetData):
    """
    Takes exoplanet data as input, preprocesses it, and returns a
    classification prediction, confidence score, and feature influence data.
    """
    if not model or not scaler:
        return {"error": "Model not loaded. Please check server logs."}

    input_df = pd.DataFrame([data.dict()])

    # --- Feature Engineering (Identical to before) ---
    G = 6.67430e-11
    R_sun_m = 6.957e8
    M_sun_kg = 1.989e30
    R_star_m = input_df['stellar_radius_solar'] * R_sun_m
    g_star_ms2 = (10**input_df['stellar_logg_cm_s2']) / 100
    M_star_kg = (g_star_ms2 * R_star_m**2) / G
    M_star_solar = M_star_kg / M_sun_kg
    input_df['stellar_density'] = M_star_solar / (input_df['stellar_radius_solar']**3 + 1e-9)
    R_sun_to_R_earth = 109.076
    stellar_radius_earth = input_df['stellar_radius_solar'] * R_sun_to_R_earth
    input_df['radius_ratio'] = input_df['planet_radius_earth'] / (stellar_radius_earth + 1e-9)

    # --- NEW: Get Feature Importances for Justification ---
    importances = model.feature_importances_
    feature_names = model.feature_names_in_
    
    # Create a dataframe of features and their importance
    importance_df = pd.DataFrame({'feature': feature_names, 'importance': importances})
    importance_df = importance_df.sort_values(by='importance', ascending=False).head(5)

    # Get the user's values for these top features
    justification_data = []
    for index, row in importance_df.iterrows():
        feature = row['feature']
        justification_data.append({
            'feature': feature,
            'value': input_df[feature].iloc[0],
            'importance': row['importance']
        })

    # Ensure the columns are in the same order as during training for scaling
    input_df = input_df[feature_names]

    # --- Scaling and Prediction (Identical to before) ---
    input_scaled = scaler.transform(input_df)
    prediction_encoded = model.predict(input_scaled)[0]
    probabilities = model.predict_proba(input_scaled)[0]

    # --- Format the Response (Now includes justification) ---
    class_mapping = {0: 'CANDIDATE', 1: 'CONFIRMED', 2: 'FALSE POSITIVE'}
    prediction_label = class_mapping.get(prediction_encoded, "Unknown")
    confidence = probabilities[prediction_encoded]

    return {
        "prediction": prediction_label,
        "confidence": float(confidence),
        "justification": justification_data
    }

@app.get("/")
def read_root():
    return {"message": "Exoplanet Classifier API is running."}
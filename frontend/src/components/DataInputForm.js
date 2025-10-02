import React, { useState } from 'react';

const initialData = {
  fp_flag_nt: 0, fp_flag_ss: 0, fp_flag_co: 0, fp_flag_ec: 0,
  orbital_period_days: 9.488, transit_epoch_bjd: 170.538, transit_duration_hr: 2.957,
  transit_depth_ppm: 615.8, impact_parameter: 0.146,
  planet_radius_earth: 2.26, equilibrium_temp_k: 793.0, insolation_flux_earth: 93.59,
  stellar_eff_temp_k: 5455.0, stellar_logg_cm_s2: 4.467, stellar_radius_solar: 0.927
};

const DataInputForm = ({ onAnalyze, isLoading }) => {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: parseFloat(value) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAnalyze(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <details open>
                <summary>False Positive Flags</summary>
                <div className="form-grid">
                    {Object.keys(formData).filter(k => k.startsWith('fp_')).map(key => (
                        <div className="form-group" key={key}><label htmlFor={key}>{key.replace(/_/g, ' ')}</label><input type="number" step="any" id={key} name={key} value={formData[key]} onChange={handleChange} required /></div>
                    ))}
                </div>
            </details>
            <details open>
                <summary>Transit & Orbital Parameters</summary>
                <div className="form-grid">
                    {['orbital_period_days', 'transit_epoch_bjd', 'transit_duration_hr', 'transit_depth_ppm', 'impact_parameter'].map(key => (
                         <div className="form-group" key={key}><label htmlFor={key}>{key.replace(/_/g, ' ')}</label><input type="number" step="any" id={key} name={key} value={formData[key]} onChange={handleChange} required /></div>
                    ))}
                </div>
            </details>
            <details>
                <summary>Planet Candidate Parameters</summary>
                <div className="form-grid">
                    {['planet_radius_earth', 'equilibrium_temp_k', 'insolation_flux_earth'].map(key => (
                         <div className="form-group" key={key}><label htmlFor={key}>{key.replace(/_/g, ' ')}</label><input type="number" step="any" id={key} name={key} value={formData[key]} onChange={handleChange} required /></div>
                    ))}
                </div>
            </details>
            <details>
                <summary>Stellar Parameters</summary>
                <div className="form-g rid">
                    {['stellar_eff_temp_k', 'stellar_logg_cm_s2', 'stellar_radius_solar'].map(key => (
                         <div className="form-group" key={key}><label htmlFor={key}>{key.replace(/_/g, ' ')}</label><input type="number" step="any" id={key} name={key} value={formData[key]} onChange={handleChange} required /></div>
                    ))}
                </div>
            </details>
            <div className="form-actions">
                <button type="button" onClick={() => setFormData(initialData)} className="secondary-button">Load Example</button>
                <button type="submit" disabled={isLoading}>{isLoading ? 'Analyzing...' : 'Analyze'}</button>
            </div>
        </form>
    );
};

export default DataInputForm;
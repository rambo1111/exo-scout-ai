import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataInputForm from '../components/DataInputForm';
import ResultsDisplay from '../components/ResultsDisplay';

function ClassifierPage() {
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState(null); // To hold the submitted form data
    const [trainingData, setTrainingData] = useState([]); // To hold the sample data

    // Fetch the training data sample when the component mounts
    useEffect(() => {
        const fetchTrainingData = async () => {
            try {
                const response = await axios.get('/training_data_sample.json');
                setTrainingData(response.data);
            } catch (err) {
                console.error("Failed to load training data sample for plot.", err);
            }
        };
        fetchTrainingData();
    }, []);


    const handleAnalyze = async (data) => {
        setIsLoading(true);
        setError('');
        setPrediction(null);
        setFormData(data); // Store the submitted data

        try {
            const response = await axios.post('https://exo-scout-ai-backend.onrender.com/predict', data);
            setPrediction(response.data);
        } catch (err) {
            setError('Failed to get a prediction. Please ensure the backend server is running and accessible.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>Input Parameters</h2>
                <DataInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
            </div>
            <div className="results-container">
                <h2>Classification Results</h2>
                <ResultsDisplay 
                    prediction={prediction} 
                    isLoading={isLoading} 
                    error={error}
                    trainingData={trainingData}
                    userInput={formData} 
                />
            </div>
        </div>
    );
}


export default ClassifierPage;

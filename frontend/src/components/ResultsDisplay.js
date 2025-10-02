import React from 'react';
import Plot from 'react-plotly.js';

// Helper function to calculate average feature values for the bar chart
const getAverageValues = (trainingData, justification) => {
    if (!trainingData || trainingData.length === 0) return {};

    const averages = { 'CONFIRMED': {}, 'CANDIDATE': {}, 'FALSE POSITIVE': {} };
    const features = justification.map(j => j.feature);

    for (const disposition in averages) {
        const filteredData = trainingData.filter(d => d.target_disposition === disposition);
        if (filteredData.length > 0) {
            for (const feature of features) {
                const sum = filteredData.reduce((acc, curr) => acc + (curr[feature] || 0), 0);
                averages[disposition][feature] = sum / filteredData.length;
            }
        }
    }
    return averages;
};

const ResultsDisplay = ({ prediction, isLoading, error, trainingData, userInput }) => {
    if (isLoading) {
        return <div className="loader">Analyzing...</div>;
    }
    if (error) {
        return <div className="error-message">{error}</div>;
    }
    if (!prediction) {
        return <p>Results will be displayed here.</p>;
    }

    // --- Data for Plots ---
    const scatterColors = {
        'CONFIRMED': '#3fb950',
        'CANDIDATE': '#d29922',
        'FALSE POSITIVE': '#f85149'
    };

    // --- Scatter Plot Data ---
    const scatterTraces = Object.keys(scatterColors).map(disposition => {
        const filteredData = trainingData.filter(d => d.target_disposition === disposition);
        return {
            x: filteredData.map(d => d.orbital_period_days),
            y: filteredData.map(d => d.planet_radius_earth),
            mode: 'markers', type: 'scatter', name: disposition,
            marker: { color: scatterColors[disposition], opacity: 0.5, size: 5 },
            hoverinfo: 'none'
        };
    });

    if (userInput) {
        scatterTraces.push({
            x: [userInput.orbital_period_days],
            y: [userInput.planet_radius_earth],
            mode: 'markers', type: 'scatter', name: 'Your Candidate',
            marker: {
                color: scatterColors[prediction.prediction], size: 14, symbol: 'star',
                line: { color: 'white', width: 2 }
            },
            hovertemplate: `<b>Your Candidate</b><br>Period: %{x:.2f} days<br>Radius: %{y:.2f} Earths<extra></extra>`
        });
    }

    // --- Bar Chart Data ---
    const averageValues = getAverageValues(trainingData, prediction.justification);
    const topFeatures = prediction.justification.map(j => j.feature);
    
    const barTraces = [
        {
            x: topFeatures.map(f => f.replace(/_/g, ' ')),
            y: topFeatures.map(f => userInput[f]),
            name: 'Your Value',
            type: 'bar',
            marker: { color: scatterColors[prediction.prediction] }
        },
        {
            x: topFeatures.map(f => f.replace(/_/g, ' ')),
            y: topFeatures.map(f => averageValues['CONFIRMED'] ? averageValues['CONFIRMED'][f] : 0),
            name: 'Avg. Confirmed',
            type: 'bar',
            marker: { color: 'rgba(63, 185, 80, 0.6)' }
        },
        {
            x: topFeatures.map(f => f.replace(/_/g, ' ')),
            y: topFeatures.map(f => averageValues['FALSE POSITIVE'] ? averageValues['FALSE POSITIVE'][f] : 0),
            name: 'Avg. False Positive',
            type: 'bar',
            marker: { color: 'rgba(248, 81, 73, 0.6)' }
        }
    ];

    const plotLayout = (title, xTitle, yTitle, yType = 'log') => ({
        title,
        xaxis: { title: xTitle, gridcolor: '#30363d', automargin: true },
        yaxis: { title: yTitle, type: yType, gridcolor: '#30363d' },
        paper_bgcolor: '#161b22',
        plot_bgcolor: '#0d1117',
        font: { color: '#c9d1d9' },
        legend: { orientation: 'h', y: -0.3 },
        margin: { t: 40, b: 40, l: 60, r: 20 },
        hovermode: 'closest'
    });

    return (
        <div>
            <div className="prediction-card">
                <h3>Prediction: <span className={`prediction-${prediction.prediction.replace(/\s+/g, '-')}`}>{prediction.prediction}</span></h3>
                <p>Confidence: <strong>{(prediction.confidence * 100).toFixed(2)}%</strong></p>
            </div>
            
            <div className="justification-card">
                <h4>Prediction Justification</h4>
                <p>This classification was primarily influenced by the following features (ranked by importance):</p>
                <ol>
                    {prediction.justification.map(item => (
                        <li key={item.feature}>
                            <strong>{item.feature.replace(/_/g, ' ')}:</strong> 
                            <span> Your Value: {item.value.toFixed(3)}</span>
                        </li>
                    ))}
                </ol>
            </div>

            <div className="plot-card">
                <Plot
                    data={scatterTraces}
                    layout={plotLayout('Your Candidate in Context', 'Orbital Period (days)', 'Planet Radius (Earth Radii)')}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    config={{ displayModeBar: false }}
                />
            </div>

            <div className="plot-card">
                <h4>Feature Comparison (Log Scale)</h4>
                <Plot
                    data={barTraces}
                    layout={plotLayout('Comparison to Class Averages', '', 'Value (Log Scale)', 'log')}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    config={{ displayModeBar: false }}
                />
            </div>
        </div>
    );
};

export default ResultsDisplay;
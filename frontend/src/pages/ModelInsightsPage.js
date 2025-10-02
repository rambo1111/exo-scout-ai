import React from 'react';

const ModelInsightsPage = () => {
    return (
        <div className="insights-container">
            <h2>Model Performance & Insights</h2>
            <p>
                The model is a <strong>Random Forest Classifier</strong> trained on a balanced dataset from Kepler, K2, and TESS.
                Here's a summary of its performance on the held-out test set.
            </p>
            
            <div className="insight-card">
                <h3>Classification Report</h3>
                <pre className="report-card">
                    <code>
                        precision    recall  f1-score   support<br/><br/>
                        CANDIDATE       0.81      0.81      0.81      1606<br/>
                        CONFIRMED       0.86      0.92      0.89      1606<br/>
                        FALSE POSITIVE       0.95      0.89      0.91      1607<br/><br/>
                        accuracy                           0.87      4819<br/>
                    </code>
                </pre>
                <p>The model shows a high **recall of 92% for CONFIRMED** planets, which is excellent for a discovery tool as it minimizes missed opportunities.</p>
            </div>

            <div className="insight-card">
                <h3>Confusion Matrix</h3>
                <img src="/confusion_matrix.png" alt="Confusion Matrix" style={{ maxWidth: '100%', borderRadius: '6px' }} />
                <p>The matrix shows how predictions line up with true labels. The diagonal from top-left to bottom-right shows correct predictions.</p>
            </div>
            
            <div className="insight-card">
                <h3>Feature Importance</h3>
                <img src="/feature_importance.png" alt="Feature Importance" style={{ maxWidth: '100%', borderRadius: '6px' }} />
                <p>This chart ranks the data features by their predictive power. NASA's pre-calculated **false positive flags** are the most influential factors in the model's decision-making process.</p>
            </div>
        </div>
    );
};

export default ModelInsightsPage;
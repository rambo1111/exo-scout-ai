import React from 'react';
import { motion } from 'framer-motion';
import '../App.css'; // Ensure your CSS is imported

const pipelineSteps = [
    {
        number: 1,
        title: "Data Harmonization",
        description: "Started with three separate, heterogenous datasets from NASA's Kepler, K2, and TESS missions. They were combined into a single dataset with a unified schema, resulting in **19,420 total objects of interest**.",
        image: null
    },
    {
        number: 2,
        title: "Missing Value Imputation",
        description: "The combined data had over 66,000 missing values. Instead of discarding data, a model-based **IterativeImputer** was used to intelligently predict and fill in the gaps.",
        image: "/missing_data.png"
    },
    {
        number: 3,
        title: "Feature Engineering & Outlier Treatment",
        description: "Two new, physically-motivated features were created: **`stellar_density`** and **`radius_ratio`**. Extreme outliers were also capped using winsorization to make the model more robust.",
        image: null
    },
    {
        number: 4,
        title: "Class Balancing with SMOTE",
        description: "The dataset was highly imbalanced. The **Synthetic Minority Over-sampling Technique (SMOTE)** was used to create synthetic data for the minority classes (CONFIRMED, CANDIDATE), resulting in a perfectly balanced dataset for training.",
        image: null
    }
];

// Animation variants for the steps
const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
};

const PipelinePage = () => {
    return (
        <div className="pipeline-container">
            <h2>The Data Pipeline Journey</h2>
            <p>The model was not built on raw data. It required a multi-step pipeline to clean, enhance, and balance the data for training.</p>

            {pipelineSteps.map((step, index) => (
                <motion.div
                    key={step.number}
                    className="pipeline-step"
                    variants={stepVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                    <div className="step-number">{step.number}</div>
                    <div className="step-content">
                        <h3>{step.title}</h3>
                        {/* Use dangerouslySetInnerHTML to render bold tags */}
                        <p dangerouslySetInnerHTML={{ __html: step.description }}></p>
                        {step.image && (
                            <img src={step.image} alt={`${step.title} visualization`} style={{ maxWidth: '100%', borderRadius: '6px', marginTop: '1rem' }}/>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default PipelinePage;
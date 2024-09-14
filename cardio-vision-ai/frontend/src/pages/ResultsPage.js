import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PredictionResults from '../components/PredictionResults'; 
import PredictionCharts from '../components/PredictionCharts';

function ResultsPage() {
    const [openCharts, setOpenCharts] = useState(true);
    const location = useLocation();
    const { results = {}, isSaved = false } = location.state || {}; 

    // Function to reorder patient info based on desired field order
    const transformPatientInfo = (patientInfo) => {
        return {
            0: patientInfo.age,
            1: patientInfo.gender,
            2: patientInfo.chestPainType,
            3: patientInfo.bloodPressure,
            4: patientInfo.cholesterol,
            5: patientInfo.fastingBloodSugar,
            6: patientInfo.restingECG,
            7: patientInfo.maxHeartRate,
            8: patientInfo.exerciseAngina,
            9: patientInfo.oldpeak,
            10: patientInfo.stSlope,
            11: patientInfo.predictionOutcome === 'High Risk' ? 1 : 0
        };
    };
    
    // Initialize updatedResults based on isSaved
    const [updatedResults, setUpdatedResults] = useState(() => {
        if (isSaved) {
            // If results isSaved, use savedPatients and transform the data
            return (results.savedPatients || []).map(patient => transformPatientInfo(patient.patientInfo));
        } else {
            // If not saved, use results as before
            return (results || []).map(result => ({ ...result }));
        }
    });

    useEffect(() => {
        if (isSaved) {
            setUpdatedResults((results.savedPatients || []).map(patient => transformPatientInfo(patient.patientInfo)));
        } else {
            setUpdatedResults((results || []).map(result => ({ ...result })));
        }
    }, [isSaved, results]);

    return (
        <div className="container">
            <h2>Prediction Results</h2>
            <PredictionResults
                results={results}
                updatedResults={updatedResults}
                setUpdatedResults={setUpdatedResults}
                isSaved={isSaved}
            />

            <PredictionCharts
                updatedResults={updatedResults}
                openCharts={openCharts}
                setOpenCharts={setOpenCharts}
            />
        </div>
    );
}

export default ResultsPage;

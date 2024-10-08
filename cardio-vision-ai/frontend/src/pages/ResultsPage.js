import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PredictionResults from '../components/PredictionResults'; 
import PredictionCharts from '../components/PredictionCharts';
import Card from 'react-bootstrap/Card';
import '../styles/styles.css';

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
            11: patientInfo.predictionOutcome === 'High Risk' ? 1 : 0,
            12: patientInfo.remark,
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
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div>
                    <Card>
                        <Card.Header as="h2">Prediction Results</Card.Header>
                        <Card.Body className="card-body-scroll">
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
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>

    );
}

export default ResultsPage;

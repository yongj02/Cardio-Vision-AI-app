import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import PredictionResults from '../components/PredictionResults'; 
import PredictionCharts from '../components/PredictionCharts';

function ResultsPage() {
    const location = useLocation();
    const { results = [] } = location.state || {};
    const [updatedResults, setUpdatedResults] = useState(
        results.map(result => ({ ...result }))
    );
    const [openCharts, setOpenCharts] = useState(true);

    return (
        <div className="container">
            <h2>Prediction Results</h2>
            <PredictionResults
                results={results}
                updatedResults={updatedResults}
                setUpdatedResults={setUpdatedResults}
            />

            <PredictionCharts
                updatedResults={results}
                openCharts={openCharts}
                setOpenCharts={setOpenCharts}
            />
        </div>
    );
}

export default ResultsPage;

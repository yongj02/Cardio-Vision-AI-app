import React from 'react';
import { useLocation } from 'react-router-dom';
import { Chart, CategoryScale, registerables } from 'chart.js';
import { Chart as ChartJS } from 'react-chartjs-2';
import axios from 'axios';

// Register the necessary components
Chart.register(CategoryScale, ...registerables);

function ResultsPage() {
    const location = useLocation();
    const { results = [
        { id: '1', age: 45, bloodPressure: 120, prediction: 'High Risk' },
        { id: '2', age: 50, bloodPressure: 130, prediction: 'Moderate Risk' },
        { id: '3', age: 60, bloodPressure: 140, prediction: 'Low Risk' },
    ] } = location.state || {}; // Add fallback value with dummy data

    const handleMarkCorrect = async (patientId) => {
        try {
            await axios.post(`/api/predictions/${patientId}/mark-correct`);
            alert('Marked as correct');
        } catch (error) {
            console.error('Error marking as correct', error);
        }
    };

    const handleMarkIncorrect = async (patientId) => {
        try {
            await axios.post(`/api/predictions/${patientId}/mark-incorrect`);
            alert('Marked as incorrect');
        } catch (error) {
            console.error('Error marking as incorrect', error);
        }
    };

    // Generate chart data (example, customize according to your needs)
    const chartData = {
        labels: results.map((patient, index) => `Patient ${index + 1}`),
        datasets: [
            {
                label: 'Prediction Accuracy',
                data: results.map(() => Math.floor(Math.random() * 100)), // Placeholder data
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container">
            <h2>Prediction Results</h2>

            {/* Render a chart (e.g., Bar Chart) */}
            <div className="chart-container">
                <h3>Prediction Summary</h3>
                <ChartJS type="bar" data={chartData} />
            </div>

            {/* Render a table of patient data and predictions */}
            <h3>Patient Predictions</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Patient ID</th>
                        <th>Age</th>
                        <th>Blood Pressure</th>
                        <th>Prediction</th>
                        <th>Correct</th>
                        <th>Incorrect</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((patient) => (
                        <tr key={patient.id}>
                            <td>{patient.id}</td>
                            <td>{patient.age}</td>
                            <td>{patient.bloodPressure}</td>
                            <td>{patient.prediction}</td>
                            <td>
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleMarkCorrect(patient.id)}
                                >
                                    Correct
                                </button>
                            </td>
                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleMarkIncorrect(patient.id)}
                                >
                                    Incorrect
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ResultsPage;

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Table, Collapse, Modal, Form } from 'react-bootstrap';
import { Bar, Pie, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler } from 'chart.js';

// Register components
ChartJS.register(
    Title, Tooltip, Legend, 
    BarElement, CategoryScale, LinearScale, 
    PointElement, LineElement, Filler, 
    ArcElement
);

function ResultsPage() {
    const location = useLocation();
    const { results = [] } = location.state || {};
    const [updatedResults, setUpdatedResults] = useState(
        results.map(result => ({ ...result, isMarkedCorrect: false }))
    );
    const [openPredictions, setOpenPredictions] = useState(true); // Show predictions by default
    const [openCharts, setOpenCharts] = useState(true); // Show charts by default
    const [showSaveModal, setShowSaveModal] = useState(false); // Modal visibility state
    const [recordName, setRecordName] = useState(''); // Record name state

    const handleMarkCorrect = (index) => {
        setUpdatedResults(prevResults => {
            const newResults = [...prevResults];
            newResults[index] = { ...newResults[index], isMarkedCorrect: true };
            return newResults;
        });
    };

    const handleMarkIncorrect = (index) => {
        setUpdatedResults(prevResults => {
            const newResults = [...prevResults];
            const updatedPrediction = newResults[index][7] === 1 ? 0 : 1;
            newResults[index] = {
                ...newResults[index],
                [7]: updatedPrediction,
                isMarkedCorrect: false
            };
            return newResults;
        });
    };

    const handleSaveToAccount = () => {
        setShowSaveModal(true);
    };

    const handleSaveRecord = () => {
        console.log(`Saving record as: ${recordName}`);
        setShowSaveModal(false);
        setRecordName('');
    };

    // Preparing data for charts
    const ages = updatedResults.map(result => result[0]);
    const genders = updatedResults.map(result => result[1]);
    const bloodPressures = updatedResults.map(result => result[2]);
    const cholesterols = updatedResults.map(result => result[3]);
    const smokingStatuses = updatedResults.map(result => result[4]);
    const diabetesStatuses = updatedResults.map(result => result[5]);
    const bmis = updatedResults.map(result => result[6]);
    const predictions = updatedResults.map(result => result[7]);

    const countOccurrences = (array) => {
        return array.reduce((acc, value) => {
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});
    };

    const ageData = {
        labels: [...new Set(ages)].sort((a, b) => a - b),
        datasets: [{
            label: 'Age Distribution',
            data: ages.reduce((acc, age) => {
                acc[age] = (acc[age] || 0) + 1;
                return acc;
            }, {}),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    const genderCounts = countOccurrences(genders);
    const genderData = {
        labels: Object.keys(genderCounts),
        datasets: [{
            label: 'Gender Distribution',
            data: Object.values(genderCounts),
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1,
        }],
    };

    const bloodPressureData = {
        labels: ['Blood Pressure'],
        datasets: [{
            label: 'Cardiovascular Disease',
            data: bloodPressures.map((bp, index) => ({ x: bp, y: predictions[index] })),
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
            showLine: false,
        }],
    };

    const cholesterolData = {
        labels: ['Cholesterol'],
        datasets: [{
            label: 'Cardiovascular Disease',
            data: cholesterols.map((chol, index) => ({ x: chol, y: predictions[index] })),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            showLine: false,
        }],
    };

    const smokingCounts = countOccurrences(smokingStatuses);
    const smokingData = {
        labels: Object.keys(smokingCounts),
        datasets: [{
            label: 'Cardiovascular Disease by Smoking Status',
            data: Object.keys(smokingCounts).map(status => {
                return updatedResults.filter((_, i) => smokingStatuses[i] === status).map(result => result[7]).reduce((acc, value) => {
                    acc[value] = (acc[value] || 0) + 1;
                    return acc;
                }, {});
            }),
            backgroundColor: 'rgba(255, 205, 86, 0.2)',
            borderColor: 'rgba(255, 205, 86, 1)',
            borderWidth: 1,
        }],
    };

    const diabetesCounts = countOccurrences(diabetesStatuses);
    const diabetesData = {
        labels: Object.keys(diabetesCounts),
        datasets: [{
            label: 'Cardiovascular Disease by Diabetes Status',
            data: Object.keys(diabetesCounts).map(status => {
                return updatedResults.filter((_, i) => diabetesStatuses[i] === status).map(result => result[7]).reduce((acc, value) => {
                    acc[value] = (acc[value] || 0) + 1;
                    return acc;
                }, {});
            }),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        }],
    };

    const bmiData = {
        labels: ['BMI'],
        datasets: [{
            label: 'Cardiovascular Disease',
            data: bmis.map((bmi, index) => ({ x: bmi, y: predictions[index] })),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            showLine: false,
        }],
    };

    return (
        <div className="container">
            <h2>Prediction Results</h2>

            <Button
                variant="secondary"
                onClick={() => setOpenPredictions(!openPredictions)}
                aria-controls="collapsible-predictions"
                aria-expanded={openPredictions}
                className="w-100 mb-3"
            >
                {openPredictions ? 'Hide Predictions' : 'Show Predictions'}
            </Button>

            <Collapse in={openPredictions}>
                <div id="collapsible-predictions">
                    <Button
                        variant="primary"
                        className="mb-3"
                        onClick={handleSaveToAccount}
                    >
                        Save to Account
                    </Button>
                    <Table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Blood Pressure</th>
                                <th>Cholesterol</th>
                                <th>Smoking</th>
                                <th>Diabetes</th>
                                <th>BMI</th>
                                <th>Prediction</th>
                                <th>Mark Correct</th>
                                <th>Mark Incorrect</th>
                            </tr>
                        </thead>
                        <tbody>
                            {updatedResults.map((patient, index) => {
                                const rowClass = patient.isMarkedCorrect
                                    ? 'table-success'
                                    : patient[7] === 1
                                    ? ''
                                    : 'table-danger';
                                return (
                                    <tr key={index} className={rowClass}>
                                        <td>{patient[0]}</td>
                                        <td>{patient[1]}</td>
                                        <td>{patient[2]}</td>
                                        <td>{patient[3]}</td>
                                        <td>{patient[4]}</td>
                                        <td>{patient[5]}</td>
                                        <td>{patient[6]}</td>
                                        <td>
                                            {patient[7] === 1
                                                ? <strong>High Risk</strong>
                                                : <strong>Low Risk</strong>}
                                        </td>
                                        <td>
                                            <Button
                                                className="btn btn-success"
                                                onClick={() => handleMarkCorrect(index)}
                                            >
                                                Correct
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                className="btn btn-danger"
                                                onClick={() => handleMarkIncorrect(index)}
                                            >
                                                Incorrect
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </Collapse>

            <Button
                variant="secondary"
                onClick={() => setOpenCharts(!openCharts)}
                aria-controls="collapsible-charts"
                aria-expanded={openCharts}
                className="w-100 mb-3"
            >
                {openCharts ? 'Hide Charts' : 'Show Charts'}
            </Button>

            <Collapse in={openCharts}>
                <div id="collapsible-charts">
                    <div className="charts">
                        <h3>Charts</h3>
                        <div className="chart-container">
                            <h4>Age Distribution</h4>
                            <Bar data={ageData} />
                        </div>
                        <div className="chart-container">
                            <h4>Gender Distribution</h4>
                            <Pie data={genderData} />
                        </div>
                        <div className="chart-container">
                            <h4>Blood Pressure vs. Cardiovascular Disease</h4>
                            <Scatter data={bloodPressureData} />
                        </div>
                        <div className="chart-container">
                            <h4>Cholesterol Levels vs. Cardiovascular Disease</h4>
                            <Scatter data={cholesterolData} />
                        </div>
                        <div className="chart-container">
                            <h4>Smoking Status vs. Cardiovascular Disease</h4>
                            <Bar data={smokingData} />
                        </div>
                        <div className="chart-container">
                            <h4>Diabetes vs. Cardiovascular Disease</h4>
                            <Bar data={diabetesData} />
                        </div>
                        <div className="chart-container">
                            <h4>BMI vs. Cardiovascular Disease</h4>
                            <Scatter data={bmiData} />
                        </div>
                    </div>
                </div>
            </Collapse>

            {/* Save Record Modal */}
            <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Save Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formRecordName">
                            <Form.Label>Record Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter record name"
                                value={recordName}
                                onChange={(e) => setRecordName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveRecord}>
                        Save Record
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ResultsPage;
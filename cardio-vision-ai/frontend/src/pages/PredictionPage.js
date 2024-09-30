import React, { useState, useEffect } from 'react';
import { Button, Collapse, Alert, Spinner, ProgressBar, Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatabaseSelector from '../components/DatasetSelector';
import FileUploader from '../components/FileUploader';
import ManualEntry from '../components/ManualEntry';
import '../styles/styles.css';

const PredictionPage = () => {
    const [activeButton, setActiveButton] = useState(null);
    const [showDatabase, setShowDatabase] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [patients, setPatients] = useState([]);
    const [showPatients, setShowPatients] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false); // New state for explanation collapse
    const navigate = useNavigate();

    useEffect(() => {
        // You might want to fetch datasets or other initialization here
    }, []);

    const handleCollapse = (type) => {
        if (activeButton === type) {
            // If the same button is clicked, collapse it
            setActiveButton(null);
            setShowDatabase(false);
            setShowUpload(false);
            setShowManualEntry(false);
        } else {
            // Otherwise, open the clicked section and close others
            setActiveButton(type);
            setShowDatabase(type === 'database');
            setShowUpload(type === 'upload');
            setShowManualEntry(type === 'manual');
        }
    };

    const handlePredict = async () => {
        setLoading(true);
        setProgress(50); // Assume halfway progress when the model starts

        try {
            // Commenting out the API call
            const response = await axios.post('/api/predict', {
                patients: patients.map((patient) => {
                    return {
                        age: patient[0],
                        gender: patient[1],
                        chestPainType: patient[2],
                        restingBP: patient[3],
                        cholesterol: patient[4],
                        fastingBS: patient[5],
                        restingECG: patient[6],
                        maxHR: patient[7],
                        exerciseAngina: patient[8],
                        oldpeak: patient[9],
                        stSlope: patient[10],
                    }
                }), // Pass patients data to backend
            });

            // Add a value of 1 to each patient, assuming they have cardiovascular disease
            const modifiedPatients = response.data.predictedPatients.map(predictedPatient => Object.values(predictedPatient));
            setProgress(100); // Progress complete

            // Navigate to the results page with the modified patients data
            navigate('/results', { state: { results: modifiedPatients } });
        } catch (error) {
            setError('Error running model.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileProcessed = (newPatients) => {
        if (Array.isArray(newPatients)) {
            setPatients(prevPatients => [...prevPatients, ...newPatients]);
        } else {
            console.error('Expected newPatients to be an array but received:', newPatients);
            setError('Error processing file.');
        }
    };

    const handleDeletePatient = (index) => {
        setPatientToDelete(index);
        setShowDeleteModal(true);
    };

    const confirmDeletePatient = () => {
        setPatients(patients.filter((_, idx) => idx !== patientToDelete));
        setShowDeleteModal(false);
    };

    const cancelDeletePatient = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteAllPatients = () => {
        setShowDeleteAllModal(true);
    };

    const confirmDeleteAllPatients = () => {
        setPatients([]);
        setShowDeleteAllModal(false);
    };

    const cancelDeleteAllPatients = () => {
        setShowDeleteAllModal(false);
    };

    return (
        <div className="container">
            <h2>Make Predictions</h2>

            {/* Collapsible Explanation Section */}
            <Button
                variant="info"
                className="w-100 mb-2"
                onClick={() => setShowExplanation(!showExplanation)}
                aria-controls="explanation-collapse"
                aria-expanded={showExplanation}
            >
                Required Variables for Prediction
            </Button>
            <Collapse in={showExplanation}>
                <div id="explanation-collapse" className="mb-3">
                    <p>
                        To make predictions, your dataset must include the following columns with exact names and data types:
                    </p>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Variable</th>
                                <th>Example Value</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Age</td>
                                <td>45</td>
                                <td>Patient's age in years.</td>
                            </tr>
                            <tr>
                                <td>Sex</td>
                                <td>M</td>
                                <td>Patient's sex: M (male) or F (female).</td>
                            </tr>
                            <tr>
                                <td>ChestPainType</td>
                                <td>ATA</td>
                                <td>Type of chest pain experienced by the patient: ATA (typical angina), NAP (non-anginal pain), etc.</td>
                            </tr>
                            <tr>
                                <td>RestingBP</td>
                                <td>120</td>
                                <td>Resting blood pressure in mm Hg.</td>
                            </tr>
                            <tr>
                                <td>Cholesterol</td>
                                <td>210</td>
                                <td>Serum cholesterol level in mg/dl.</td>
                            </tr>
                            <tr>
                                <td>FastingBS</td>
                                <td>0</td>
                                <td>Fasting blood sugar level: 1 if {'>'} 120 mg/dl, 0 otherwise.</td>
                            </tr>
                            <tr>
                                <td>RestingECG</td>
                                <td>Normal</td>
                                <td>Results of resting electrocardiographic measurement: Normal, ST, etc.</td>
                            </tr>
                            <tr>
                                <td>MaxHR</td>
                                <td>150</td>
                                <td>Maximum heart rate achieved during exercise.</td>
                            </tr>
                            <tr>
                                <td>ExerciseAngina</td>
                                <td>N</td>
                                <td>Exercise induced angina: Y (yes) or N (no).</td>
                            </tr>
                            <tr>
                                <td>Oldpeak</td>
                                <td>1.0</td>
                                <td>Depression induced by exercise relative to rest.</td>
                            </tr>
                            <tr>
                                <td>ST_Slope</td>
                                <td>Up</td>
                                <td>Slope of the peak exercise ST segment: Up, Flat, Down.</td>
                            </tr>
                        </tbody>
                    </Table>
                    <p className="text-danger">
                        <strong>Note:</strong> The column names in your dataset must exactly match those listed above.
                    </p>
                </div>
            </Collapse>

            {/* Error and Progress Indicators */}
            {error && <Alert variant="danger">{error}</Alert>}
            {loading && (
                <div className="loading-container">
                    <Spinner animation="border" />
                    <ProgressBar now={progress} label={`${progress}%`} className="mt-3" />
                </div>
            )}

            {/* Collapsible Options */}
            {!loading && (
                <>
                    <Button
                        variant="primary"
                        className="w-100 mb-2 mt-3"
                        onClick={() => handleCollapse('database')}
                        aria-controls="database-collapse"
                        aria-expanded={showDatabase}
                    >
                        Select from Database
                    </Button>
                    <Collapse in={showDatabase}>
                        <div id="database-collapse">
                            <DatabaseSelector addPatients={handleFileProcessed} />
                        </div>
                    </Collapse>

                    <Button
                        variant="primary"
                        className="w-100 mb-2"
                        onClick={() => handleCollapse('upload')}
                        aria-controls="upload-collapse"
                        aria-expanded={showUpload}
                    >
                        Upload Own Dataset
                    </Button>
                    <Collapse in={showUpload}>
                        <div id="upload-collapse">
                            <FileUploader onFileProcessed={handleFileProcessed} />
                        </div>
                    </Collapse>

                    <Button
                        variant="primary"
                        className="w-100 mb-2"
                        onClick={() => handleCollapse('manual')}
                        aria-controls="manual-collapse"
                        aria-expanded={showManualEntry}
                    >
                        Manually Enter Patient Data
                    </Button>
                    <Collapse in={showManualEntry}>
                        <div id="manual-collapse">
                            <ManualEntry addPatient={handleFileProcessed} />
                        </div>
                    </Collapse>

                    {/* Added Patients Section */}
                    <Button
                        variant="secondary"
                        className="w-100 mb-2 mt-3"
                        onClick={() => setShowPatients(!showPatients)}
                    >
                        {showPatients ? 'Hide Added Patients' : 'Show Added Patients'}
                    </Button>
                    <Collapse in={showPatients}>
                        <div>
                            <Button
                                variant="danger"
                                className="w-100 mb-2"
                                onClick={handleDeleteAllPatients}
                                disabled={patients.length === 0}
                            >
                                Delete All Patients
                            </Button>
                            {patients.length === 0 ? (
                                <p>No patients added.</p>
                            ) : (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Age</th>
                                            <th>Sex</th>
                                            <th>Chest Pain Type</th>
                                            <th>Resting BP</th>
                                            <th>Cholesterol</th>
                                            <th>Fasting BS</th>
                                            <th>Resting ECG</th>
                                            <th>Max HR</th>
                                            <th>Exercise Angina</th>
                                            <th>Oldpeak</th>
                                            <th>ST Slope</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.map((patient, index) => (
                                            <tr key={index}>
                                                <td>{patient[0]}</td>
                                                <td>{patient[1]}</td>
                                                <td>{patient[2]}</td>
                                                <td>{patient[3]}</td>
                                                <td>{patient[4]}</td>
                                                <td>{patient[5]}</td>
                                                <td>{patient[6]}</td>
                                                <td>{patient[7]}</td>
                                                <td>{patient[8]}</td>
                                                <td>{patient[9]}</td>
                                                <td>{patient[10]}</td>
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDeletePatient(index)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </div>
                    </Collapse>

                    <Button variant="success" className="w-100 mb-2 mt-3" onClick={handlePredict}>
                        Predict
                    </Button>
                </>
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={cancelDeletePatient}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this patient?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelDeletePatient}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeletePatient}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete All Confirmation Modal */}
            <Modal show={showDeleteAllModal} onHide={cancelDeleteAllPatients}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete all added patients?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelDeleteAllPatients}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteAllPatients}>
                        Delete All
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PredictionPage;

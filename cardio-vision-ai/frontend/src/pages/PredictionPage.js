import React, { useState, useEffect } from 'react';
import { Button, Collapse, Alert, Spinner, ProgressBar, Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatabaseSelector from '../components/DatasetSelector';
import FileUploader from '../components/FileUploader';
import ManualEntry from '../components/ManualEntry';
import '../styles/styles.css';

const PredictionPage = () => {
    const [datasets, setDatasets] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [showDatabase, setShowDatabase] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [patients, setPatients] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    const handleCollapse = (type) => {
        setShowDatabase(type === 'database');
        setShowUpload(type === 'upload');
        setShowManualEntry(type === 'manual');
    };

    const handlePredict = async () => {
        setLoading(true);
        setProgress(50); // Assume halfway progress when the model starts

        try {
            const response = await axios.post('/api/runModel', {
                dataset: selectedDataset,
                patients: patients, // Pass patients data to backend
            });
            setProgress(100); // Progress complete
            navigate('/results', { state: { results: response.data } });
        } catch (error) {
            setError('Error running model.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileProcessed = (newPatients) => {
        console.log(newPatients);
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

    return (
        <div className="container">
            <h2>Make Predictions</h2>

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
                        className="w-100 mb-2"
                        onClick={() => handleCollapse('database')}
                        aria-controls="database-collapse"
                        aria-expanded={showDatabase}
                    >
                        Select from Database
                    </Button>
                    <Collapse in={showDatabase}>
                        <div id="database-collapse">
                            <DatabaseSelector datasets={datasets} setSelectedDataset={setSelectedDataset} />
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
                        <div id="upload-collapse" className="mt-3">
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
                        <div id="manual-collapse" className="mt-3">
                            <ManualEntry addPatient={handleFileProcessed} />
                        </div>
                    </Collapse>

                    <Button variant="success" className="w-100 mt-3" onClick={handlePredict}>
                        Predict
                    </Button>

                    {/* Display Added Patients */}
                    <div className="mt-3">
                        <h4>Added Patients</h4>
                        {patients.length === 0 ? (
                            <p>No patients added.</p>
                        ) : (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Age</th>
                                        <th>Gender</th>
                                        <th>Blood Pressure</th>
                                        <th>Cholesterol Levels</th>
                                        <th>Smoking Status</th>
                                        <th>Diabetes</th>
                                        <th>BMI</th>
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
        </div>
    );
};

export default PredictionPage;

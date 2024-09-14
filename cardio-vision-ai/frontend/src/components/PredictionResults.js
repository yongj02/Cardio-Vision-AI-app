import React, { useState, useContext, useEffect } from 'react';
import { Button, Table, Collapse, Modal, Form, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext'; 
import axios from 'axios';
import * as XLSX from 'xlsx'; 
import { saveAs } from 'file-saver'; 

function PredictionResults({ results, updatedResults, setUpdatedResults, isSaved }) {
    const { isLoggedIn, token } = useContext(AuthContext);
    const [openPredictions, setOpenPredictions] = useState(true);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [recordName, setRecordName] = useState('');
    const [exportFileName, setExportFileName] = useState('');
    const [filenameError, setFilenameError] = useState(false);
    const [errorSaving, setErrorSaving] = useState(false);
    const [exportFormat, setExportFormat] = useState('csv'); 
    const [editIndex, setEditIndex] = useState(null);
    const [newPrediction, setNewPrediction] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');
    const [showAlert, setShowAlert] = useState(false);

    console.log(updatedResults);

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    const handleEditPrediction = (index) => {
        setEditIndex(index);
        setNewPrediction(updatedResults[index][11] === 1 ? 'High Risk' : 'Low Risk');
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        setUpdatedResults(prevResults => {
            const newResults = [...prevResults];
            newResults[editIndex][11] = newPrediction === 'High Risk' ? 1 : 0;
            return newResults;
        });
        setShowEditModal(false);
        setEditIndex(null);
    };

    const handleSaveRecord = async (recordName) => {
        if (!recordName.trim()) {
            setErrorSaving(true);
            setAlertMessage('Please enter a valid record name.');
            setAlertType('danger');
            setShowAlert(true);
            return;
        }
    
        setErrorSaving(false);
        setAlertMessage('');
    
        const patientInfos = updatedResults.map(row => ({
            age: row[0],
            gender: row[1],
            chestPainType: row[2],
            bloodPressure: row[3],
            cholesterol: row[4],
            fastingBloodSugar: row[5],
            restingECG: row[6],
            maxHeartRate: row[7],
            exerciseAngina: row[8],
            oldpeak: row[9],
            stSlope: row[10],
            predictionOutcome: row[11] === 1 ? 'High Risk' : 'Low Risk'
        }));
        console.log(patientInfos);
    
        try {
            await axios.post('/api/patients/save', {
                name: recordName,
                patientInfos: patientInfos
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            setAlertMessage('Record saved successfully!');
            setAlertType('success');
        } catch (error) {
            setAlertMessage('Failed to save record.');
            setAlertType('danger');
        } finally {
            setShowAlert(true);
            setShowSaveModal(false); // Close modal regardless of result
        }
    };
    

    const handleUpdateRecord = async (recordId) => {
        try {
            // Assuming updatedResults is an array of arrays where each inner array represents a patient record
            const patientInfos = updatedResults.map(row => ({
                age: row[0],
                gender: row[1],
                chestPainType: row[2],
                bloodPressure: row[3],
                cholesterol: row[4],
                fastingBloodSugar: row[5],
                restingECG: row[6],
                maxHeartRate: row[7],
                exerciseAngina: row[8],
                oldpeak: row[9],
                stSlope: row[10],
                predictionOutcome: row[11] === 1 ? 'High Risk' : 'Low Risk'
            }));
    
            await axios.put(`/api/patients/update/patients/${recordId}`, {
                patientInfos: patientInfos
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            setAlertMessage('Record updated successfully!');
            setAlertType('success');
        } catch (error) {
            setAlertMessage('Failed to update record.');
            setAlertType('danger');
        } finally {
            setShowAlert(true);
            setShowSaveModal(false);
        }
    };
    
    

    const handleFileNameChange = (e) => {
        const newFileName = e.target.value;
        setExportFileName(newFileName);
        if (newFileName.trim()) {
            setFilenameError(false);
        }
    };

    const handleExport = (exportFileName, exportFormat) => {
        if (!exportFileName.trim()) {
            setFilenameError(true);
            return;
        }

        setFilenameError(false);

        const ws = XLSX.utils.json_to_sheet(updatedResults.map(row => ({
            Age: row[0],
            Gender: row[1],
            'Chest Pain Type': row[2],
            'Blood Pressure': row[3],
            Cholesterol: row[4],
            'Fasting Blood Sugar': row[5],
            'Resting Electrocardiogram': row[6],
            'Max Heart Rate': row[7],
            'Exercise Angina': row[8],
            Oldpeak: row[9],
            'ST Slope': row[10],
            Prediction: row[11] === 1 ? 'High Risk' : 'Low Risk'
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Results');

        const wbout = XLSX.write(wb, { bookType: exportFormat === 'csv' ? 'csv' : 'xlsx', type: 'binary' });
        const blob = new Blob([s2ab(wbout)], { type: exportFormat === 'csv' ? 'text/csv;charset=utf-8;' : 'application/octet-stream' });
        saveAs(blob, `${exportFileName}.${exportFormat === 'csv' ? 'csv' : 'xlsx'}`);

        setShowExportModal(false);
    };

    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    };

    return (
        <>
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
                    {/* Alert Notification */}
                    {showAlert && (
                        <Alert variant={alertType} dismissible onClose={() => setShowAlert(false)}>
                            {alertMessage}
                        </Alert>
                    )}

                    {isSaved ? (
                        <Button
                            variant="primary"
                            className="mb-3"
                            onClick={() => handleUpdateRecord(results._id)} // Adjust based on how you manage record ID
                        >
                            Update Result
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            className="mb-3"
                            onClick={() => setShowSaveModal(true)}
                            disabled={!isLoggedIn}
                        >
                            Save to Account
                        </Button>
                    )}

                    <Button
                        variant="primary"
                        className="mb-3"
                        onClick={() => setShowExportModal(true)}
                    >
                        Export Table
                    </Button>
                    <Table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Chest Pain Type</th>
                                <th>Blood Pressure</th>
                                <th>Cholesterol</th>
                                <th>Fasting Blood Sugar</th>
                                <th>Resting Electrocardiogram</th>
                                <th>Max Heart Rate</th>
                                <th>Exercise Angina</th>
                                <th>Oldpeak</th>
                                <th>ST Slope</th>
                                <th>Prediction</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {updatedResults.map((result, index) => (
                                <tr key={index}>
                                    <td>{result[0]}</td>
                                    <td>{result[1]}</td>
                                    <td>{result[2]}</td>
                                    <td>{result[3]}</td>
                                    <td>{result[4]}</td>
                                    <td>{result[5]}</td>
                                    <td>{result[6]}</td>
                                    <td>{result[7]}</td>
                                    <td>{result[8]}</td>
                                    <td>{result[9]}</td>
                                    <td>{result[10]}</td>
                                    <td>{result[11] === 1 ? 'High Risk' : 'Low Risk'}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => handleEditPrediction(index)}>
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Collapse>

            {/* Edit Prediction Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Prediction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>New Prediction</Form.Label>
                        <Form.Control
                            as="select"
                            value={newPrediction}
                            onChange={(e) => setNewPrediction(e.target.value)}
                        >
                            <option value="High Risk">High Risk</option>
                            <option value="Low Risk">Low Risk</option>
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Save Record Modal */}
            <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isSaved ? 'Update Record' : 'Save Record'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Record Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={recordName}
                                onChange={(e) => setRecordName(e.target.value)}
                                isInvalid={errorSaving && !recordName.trim()}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid record name.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => isSaved ? handleUpdateRecord(results._id) : handleSaveRecord(recordName)}>
                        {isSaved ? 'Update' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Export Modal */}
            <Modal show={showExportModal} onHide={() => setShowExportModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Export Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>File Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={exportFileName}
                                onChange={handleFileNameChange}
                                isInvalid={filenameError}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid file name.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>File Format</Form.Label>
                            <Form.Control
                                as="select"
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value)}
                            >
                                <option value="csv">CSV</option>
                                <option value="excel">Excel</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowExportModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => handleExport(exportFileName, exportFormat)}>
                        Export
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PredictionResults;


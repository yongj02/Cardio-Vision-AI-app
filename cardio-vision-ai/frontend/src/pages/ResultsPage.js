import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Table, Collapse, Modal, Form } from 'react-bootstrap';
import { Bar, Pie, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler } from 'chart.js';
import { AuthContext } from '../context/AuthContext'; // Corrected import
import { saveAs } from 'file-saver'; // for file saving
import * as XLSX from 'xlsx'; // for Excel export
import Papa from 'papaparse'; // for CSV export

// Register Chart.js components
ChartJS.register(
    Title, Tooltip, Legend, 
    BarElement, CategoryScale, LinearScale, 
    PointElement, LineElement, Filler, 
    ArcElement
);

function ResultsPage() {
    const location = useLocation();
    const { results = [] } = location.state || {};
    const { isLoggedIn } = useContext(AuthContext); // Get isLoggedIn from AuthContext

    const [updatedResults, setUpdatedResults] = useState(
        results.map(result => ({ ...result, isMarkedIncorrect: false }))
    );
    const [openPredictions, setOpenPredictions] = useState(true);
    const [openCharts, setOpenCharts] = useState(true);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [recordName, setRecordName] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [newPrediction, setNewPrediction] = useState(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFileName, setExportFileName] = useState('');
    const [exportFormat, setExportFormat] = useState('csv'); // Default export format
    const [filenameError, setFilenameError] = useState(false);
    const [errorSaving, setErrorSaving] = useState(false);

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

    const handleSaveToAccount = () => {
        if (!isLoggedIn) return; // Exit if not logged in
        setShowSaveModal(true);
    };

    const handleSaveRecord = () => {
        if (!recordName.trim()) {
            setErrorSaving(true);
            return;
        }

        setErrorSaving(false);
        console.log(`Saving record as: ${recordName}`);
        setShowSaveModal(false);
        setRecordName('');
    };

    const handleExport = () => {
        if (!exportFileName.trim()) {
            setFilenameError(true);
            return;
        }

        setFilenameError(false);

        const fileName = `${exportFileName}.xlsx`;
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

        if (exportFormat === 'csv') {
            // Convert JSON data to CSV format and trigger download
            const csv = Papa.unparse(updatedResults.map(row => ({
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
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, `${exportFileName}.csv`);
        } else if (exportFormat === 'excel') {
            // Export as Excel file
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
            const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
            saveAs(blob, fileName);
        }
        
        setShowExportModal(false);
        setExportFileName('');
    };

    // Convert binary string to array buffer
    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
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
                        disabled={!isLoggedIn} // Disable if not logged in
                    >
                        Save to Account
                    </Button>
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
                                        <Button
                                            variant="warning"
                                            onClick={() => handleEditPrediction(index)}
                                        >
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
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
                    {/* Include your chart components here */}
                </div>
            </Collapse>

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
                                value={recordName}
                                onChange={(e) => {
                                    setRecordName(e.target.value);
                                    if (errorSaving && e.target.value.trim()) {
                                        setErrorSaving(false);
                                    }
                                }}
                                placeholder="Enter record name"
                                isInvalid={errorSaving}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a record name.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveRecord}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Prediction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formPrediction">
                            <Form.Label>Prediction</Form.Label>
                            <Form.Control
                                as="select"
                                value={newPrediction}
                                onChange={(e) => setNewPrediction(e.target.value)}
                            >
                                <option>High Risk</option>
                                <option>Low Risk</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showExportModal} onHide={() => setShowExportModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Export Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formExportFileName">
                            <Form.Label>File Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={exportFileName}
                                onChange={(e) => {
                                    setExportFileName(e.target.value);
                                    if (filenameError && e.target.value.trim()) {
                                        setFilenameError(false);
                                    }
                                }}
                                placeholder="Enter file name"
                                isInvalid={filenameError}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a file name.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formExportFormat">
                            <Form.Label>Export Format</Form.Label>
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
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleExport}>
                        Export
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ResultsPage;

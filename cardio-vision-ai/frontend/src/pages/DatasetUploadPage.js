import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Container, Table, Button, Modal } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const DatasetUploadPage = () => {
    const [datasets, setDatasets] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const [isValidFile, setIsValidFile] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [datasetToDelete, setDatasetToDelete] = useState(null);  // Track the dataset to delete

    const requiredColumns = ['age', 'gender', 'blood pressure', 'cholesterol levels', 'smoking status', 'diabetes', 'BMI'];

    // Fetch datasets on component mount
    const fetchDatasets = async () => {
        try {
            const response = await axios.get('/api/datasets');
            setDatasets(response.data || []);
        } catch (err) {
            setError('Error fetching datasets.');
        }
    };

    React.useEffect(() => {
        fetchDatasets();
    }, []);

    // Handle file selection and validation
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) {
            setFile(null);
            setIsValidFile(false);
            return;
        }

        const validFormats = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!validFormats.includes(selectedFile.type)) {
            setFileError('Invalid file format. Please upload a CSV or Excel file.');
            setIsValidFile(false);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            const headers = worksheet[0];

            if (!headers) {
                setFileError('The file is empty or not formatted correctly.');
                setIsValidFile(false);
                return;
            }

            const missingColumns = requiredColumns.filter(col => !headers.includes(col));
            if (missingColumns.length > 0) {
                setFileError(`File is missing the following required columns: ${missingColumns.join(', ')}`);
                setIsValidFile(false);
                return;
            }

            setFileError('');
            setIsValidFile(true);
            setFile(selectedFile);
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    // Handle file upload
    const handleUpload = async () => {
        if (!isValidFile || !file) {
            setUploadError('No valid file selected.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/datasets/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                const updatedDatasets = await axios.get('/api/datasets');
                setDatasets(updatedDatasets.data || []);
                setSuccess('Dataset uploaded successfully!');
                setFile(null);
                setIsValidFile(false);
            }
        } catch (err) {
            setUploadError('Failed to upload the dataset. Please try again.');
        }
    };

    // Confirm deletion modal
    const confirmDeleteDataset = (dataset) => {
        setDatasetToDelete(dataset);
        setShowDeleteModal(true);
    };

    // Handle dataset deletion
    const handleDeleteDataset = async () => {
        if (!datasetToDelete) return;

        try {
            await axios.delete(`/api/datasets/${datasetToDelete._id}`);
            setDatasets(datasets.filter((d) => d._id !== datasetToDelete._id));
            setSuccess('Dataset deleted successfully!');
        } catch (err) {
            setError('Failed to delete dataset.');
        } finally {
            setShowDeleteModal(false);
            setDatasetToDelete(null);
        }
    };

    // Render datasets table
    const renderDatasetsTable = () => (
        <Table striped bordered hover className="mt-4">
            <thead>
                <tr>
                    <th>Dataset Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {datasets.length === 0 ? (
                    <tr>
                        <td colSpan="2" className="text-center">No datasets available.</td>
                    </tr>
                ) : (
                    datasets.map((dataset) => (
                        <tr key={dataset._id}>
                            <td>{dataset.name}</td>
                            <td>
                                <Button
                                    variant="danger"
                                    onClick={() => confirmDeleteDataset(dataset)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );

    return (
        <Container className="mt-5">
            <h2>Dataset Upload</h2>

            {/* Success, upload error, and fetch error alerts */}
            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
            {uploadError && <Alert variant="danger" onClose={() => setUploadError('')} dismissible>{uploadError}</Alert>}
            {fileError && <Alert variant="danger" onClose={() => setFileError('')} dismissible>{fileError}</Alert>}

            {/* File input and validation */}
            <input
                type="file"
                accept=".csv, .xls, .xlsx"
                onChange={handleFileChange}
            />
            <Button
                className="mt-3"
                disabled={!isValidFile}
                onClick={handleUpload}
            >
                Upload
            </Button>

            {/* Display existing datasets */}
            {renderDatasetsTable()}

            {/* Modal to confirm dataset deletion */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this dataset: <strong>{datasetToDelete?.name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteDataset}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default DatasetUploadPage;

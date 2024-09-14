import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Container, Table, Button, Modal } from 'react-bootstrap';
import FileUploader from '../components/FileUploader';

const DatasetUploadPage = () => {
    const [datasets, setDatasets] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [datasetToDelete, setDatasetToDelete] = useState(null);  // To store the dataset we want to delete

    // Fetch existing datasets
    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const response = await axios.get('/api/datasets');
                setDatasets(response.data || []);
            } catch (err) {
                setError('Error fetching datasets.');
            }
        };
        fetchDatasets();
    }, []);

    // Handle file processing and upload
    const handleFileProcessed = async (file) => {
        setError('');
        setSuccess('');
        setUploadError('');

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
            }
        } catch (err) {
            setUploadError('Failed to upload the dataset. Please try again.');
        }
    };

    // Handle dataset deletion
    const handleDeleteDataset = async () => {
        if (!datasetToDelete) return;

        try {
            await axios.delete(`/api/datasets/${datasetToDelete._id}`);
            // Remove the deleted dataset from the UI
            setDatasets(datasets.filter(dataset => dataset._id !== datasetToDelete._id));
            setSuccess('Dataset deleted successfully!');
        } catch (err) {
            setError('Failed to delete the dataset.');
        } finally {
            setShowDeleteModal(false); // Close modal after action
        }
    };

    // Show the delete confirmation modal
    const confirmDeleteDataset = (dataset) => {
        setDatasetToDelete(dataset);
        setShowDeleteModal(true);
    };

    // Render the table to display datasets
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
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

            {/* File upload section */}
            <FileUploader onFileProcessed={handleFileProcessed} />

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
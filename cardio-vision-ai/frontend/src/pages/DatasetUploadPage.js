import React, { useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const DatasetUploadPage = () => {
    const [datasets, setDatasets] = useState([]);
    const [file, setFile] = useState(null);
    const [isValidFile, setIsValidFile] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [isDeleteModal, setIsDeleteModal] = useState(false);  // New state to differentiate delete modal
    const [datasetToDelete, setDatasetToDelete] = useState(null);

    const requiredColumns = [
        'age',
        'sex',
        'chestpaintype',
        'restingbp',
        'cholesterol',
        'fastingbs',
        'restingecg',
        'maxhr',
        'exerciseangina',
        'oldpeak',
        'st_slope'
    ];

    // Fetch datasets on component mount
    const fetchDatasets = async () => {
        try {
            const response = await axios.get('/api/datasets');
            setDatasets(response.data || []);
        } catch (err) {
            triggerModal('Error', 'Error fetching datasets.');
        }
    };

    React.useEffect(() => {
        fetchDatasets();
    }, []);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) {
            setFile(null);
            setIsValidFile(false);
            return;
        }
    
        const validFormats = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!validFormats.includes(selectedFile.type)) {
            triggerModal('Invalid File Format', 'Invalid file format. Please upload a CSV or Excel file.');
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
                triggerModal('Invalid File', 'The file is empty or not formatted correctly.');
                setIsValidFile(false);
                return;
            }
    
            // Case-insensitive check for missing columns
            const lowerCaseHeaders = headers.map(header => header.toLowerCase());
            const missingColumns = requiredColumns.filter(col => !lowerCaseHeaders.includes(col.toLowerCase()));
            if (missingColumns.length > 0) {
                triggerModal('Missing Columns', `File is missing the following required columns: ${missingColumns.join(', ')}`);
                setIsValidFile(false);
                return;
            }
    
            // Check for missing values in rows (explicit check for null, undefined, or empty string)
            const requiredColumnIndices = requiredColumns.reduce((acc, col) => {
                acc[col] = lowerCaseHeaders.indexOf(col.toLowerCase());
                return acc;
            }, {});
    
            const missingValuesRows = worksheet.slice(1).filter(row =>
                requiredColumns.some(col => {
                    const value = row[requiredColumnIndices[col]];
                    // Explicit check for null, undefined, or empty string
                    return value === undefined || value === null || value === '';
                })
            );
    
            if (missingValuesRows.length > 0) {
                triggerModal('Missing Values', 'One or more rows contain missing values in required columns. Please check your file.');
                setIsValidFile(false);
                return;
            }
    
            setFile(selectedFile);
            setIsValidFile(true);
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    // Trigger the modal for errors or success
    const triggerModal = (title, content) => {
        setModalTitle(title);
        setModalContent(content);
        setIsDeleteModal(false);  // Reset the delete modal flag
        setShowModal(true);
    };

    // Confirm deletion modal
    const confirmDeleteDataset = (dataset) => {
        setDatasetToDelete(dataset);
        setModalTitle('Confirm Deletion');
        setModalContent(`Are you sure you want to delete the dataset: ${dataset.name}?`);
        setIsDeleteModal(true);  // Set this as a delete modal
        setShowModal(true);
    };

    // Handle dataset deletion
    const handleDeleteDataset = async () => {
        if (!datasetToDelete) return;

        try {
            await axios.delete(`/api/datasets/${datasetToDelete._id}`);
            setDatasets(datasets.filter((d) => d._id !== datasetToDelete._id));
            triggerModal('Success', 'Dataset deleted successfully!');
        } catch (err) {
            triggerModal('Error', 'Failed to delete dataset.');
        } finally {
            setDatasetToDelete(null);
            setIsDeleteModal(false);
        }
    };

    // Handle file upload
    const handleUpload = async () => {
        if (!isValidFile || !file) {
            triggerModal('Error', 'No valid file selected.');
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
                triggerModal('Success', 'Dataset uploaded successfully!');
                setFile(null);
                setIsValidFile(false);
            }
        } catch (err) {
            triggerModal('Upload Failed', 'Failed to upload the dataset. Please try again.');
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

            {/* Modal for deletion confirmation, errors, and success messages */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalContent}</Modal.Body>
                <Modal.Footer>
                    {isDeleteModal ? (
                        <>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleDeleteDataset}>
                                Delete
                            </Button>
                        </>
                    ) : (
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default DatasetUploadPage;

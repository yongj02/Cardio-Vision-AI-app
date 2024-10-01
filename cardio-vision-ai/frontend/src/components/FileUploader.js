import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Modal, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import '../styles/styles.css';

const FileUploader = ({ onFileProcessed }) => {
    const [fileError, setFileError] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [modalTitle, setModalTitle] = useState('');

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

    const handleDrop = (acceptedFiles) => {
        processFile(acceptedFiles[0]);
    };

    const processFile = (file) => {
        setFileError('');
        setUploadError('');
        setUploadSuccess('');

        const validFormats = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

        if (!validFormats.includes(file.type)) {
            setModalTitle('Invalid File Format');
            setModalContent('Invalid file format. Please upload a CSV or Excel file.');
            setShowModal(true);
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
                setModalTitle('Empty or Incorrect File');
                setModalContent('The file is empty or not formatted correctly.');
                setShowModal(true);
                return;
            }

            // Convert headers to lowercase for case-insensitive comparison
            const lowerCaseHeaders = headers.map(header => header.toLowerCase());

            const headerIndices = requiredColumns.reduce((acc, col) => {
                const index = lowerCaseHeaders.indexOf(col);
                if (index !== -1) acc[col] = index;
                return acc;
            }, {});

            // Check if all required columns are present
            if (Object.keys(headerIndices).length === requiredColumns.length) {
                const reorderedData = worksheet.slice(1).map(row => {
                    return requiredColumns.map(col => row[headerIndices[col]]);
                });

                setModalTitle('Upload Success');
                setModalContent('File uploaded successfully with all required columns.');
                setShowModal(true);
                onFileProcessed(reorderedData);
            } else {
                setModalTitle('Missing Columns');
                setModalContent('File is missing one or more required columns.');
                setShowModal(true);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        multiple: false,
        accept: '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const handleCloseModal = () => setShowModal(false);

    return (
        <div>
            <div
                {...getRootProps({ className: 'dropzone mb-3' })}
            >
                <input {...getInputProps()} />
                Drag & drop your dataset here, or click to select files
            </div>

            {/* Bootstrap Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalContent}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default FileUploader;

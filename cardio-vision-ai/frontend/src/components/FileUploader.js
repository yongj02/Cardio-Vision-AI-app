import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Alert, Modal, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import '../styles/styles.css';

const FileUploader = ({ onFileProcessed }) => {
    const [fileError, setFileError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    
    const requiredColumns = [
        'Age',
        'Sex',
        'ChestPainType',
        'RestingBP',
        'Cholesterol',
        'FastingBS',
        'RestingECG',
        'MaxHR',
        'ExerciseAngina',
        'Oldpeak',
        'ST_Slope'
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
            setFileError('Invalid file format. Please upload a CSV or Excel file.');
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
                setUploadError('The file is empty or not formatted correctly.');
                return;
            }

            const headerMap = {
                'Age': 'Age',
                'Sex': 'Sex',
                'ChestPainType': 'ChestPainType',
                'RestingBP': 'RestingBP',
                'Cholesterol': 'Cholesterol',
                'FastingBS': 'FastingBS',
                'RestingECG': 'RestingECG',
                'MaxHR': 'MaxHR',
                'ExerciseAngina': 'ExerciseAngina',
                'Oldpeak': 'Oldpeak',
                'ST_Slope': 'ST_Slope'
            };
            

            const headerIndices = requiredColumns.reduce((acc, col) => {
                const index = headers.indexOf(col);
                if (index !== -1) acc[col] = index;
                return acc;
            }, {});

            if (Object.keys(headerIndices).length === requiredColumns.length) {
                const reorderedData = worksheet.slice(1).map(row => {
                    return requiredColumns.map(col => row[headerIndices[col]]);
                });

                setUploadSuccess('File uploaded successfully with all required columns.');
                onFileProcessed(reorderedData);
            } else {
                setUploadError('File is missing one or more required columns.');
            }
        };
        reader.readAsArrayBuffer(file);

        setUploading(true);

        setTimeout(() => {
            setUploading(false);
        }, 5000);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        multiple: false,
        accept: '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    return (
        <div>
            <div
                {...getRootProps({ className: 'dropzone element-space-bottom' })}
            >
                <input {...getInputProps()} />
                Drag & drop your dataset here, or click to select files
            </div>
            {fileError && <Alert variant="danger" className="mt-2">{fileError}</Alert>}
            {uploadError && <Alert variant="danger" className="mt-2">{uploadError}</Alert>}
            {uploadSuccess && <Alert variant="success" className="mt-2">{uploadSuccess}</Alert>}
        </div>
    );
};

export default FileUploader;

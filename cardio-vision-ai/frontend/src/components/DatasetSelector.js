import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import XLSX

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

const DatabaseSelector = ({ addPatients }) => {
    const [datasets, setDatasets] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const response = await axios.get('/api/datasets');
                setDatasets(response.data || []); // Ensure datasets is always an array
            } catch (error) {
                setError('Error fetching datasets.');
            }
        };

        fetchDatasets();
    }, []);

    const handleSelectDataset = async (dataset) => {
        try {
            const response = await axios.get(`/api/datasets/${dataset._id}/file`, { responseType: 'blob' });
            const file = new File([response.data], dataset.name, { type: response.headers['content-type'] });

            // Process the file similarly to how it's done in FileUploader
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                const headers = worksheet[0];

                if (!headers) {
                    setError('The file is empty or not formatted correctly.');
                    return;
                }

                const headerIndices = requiredColumns.reduce((acc, col) => {
                    const index = headers.indexOf(col);
                    if (index !== -1) acc[col] = index;
                    return acc;
                }, {});

                if (Object.keys(headerIndices).length === requiredColumns.length) {
                    const reorderedData = worksheet.slice(1).map(row => {
                        return requiredColumns.map(col => row[headerIndices[col]]);
                    });

                    addPatients(reorderedData);
                } else {
                    setError('File is missing one or more required columns.');
                }
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            setError('Error fetching dataset file.');
        }
    };

    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}
            {datasets.length === 0 ? (
                <p>No datasets available.</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Dataset Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datasets.map((dataset) => (
                            <tr key={dataset._id}>
                                <td>{dataset.name}</td>
                                <td>
                                    <Button
                                        onClick={() => handleSelectDataset(dataset)}
                                    >
                                        Select
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default DatabaseSelector;

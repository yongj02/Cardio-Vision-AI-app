import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

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

    const handleSelectDataset = (dataset) => {
        // Logic to handle dataset selection
        addPatients(dataset.patients); // Example: add patients from the selected dataset
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

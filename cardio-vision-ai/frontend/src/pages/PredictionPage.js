import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PredictionPage() {
    const [datasets, setDatasets] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [manualEntries, setManualEntries] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch datasets from the database
        const fetchDatasets = async () => {
            try {
                const { data } = await axios.get('/api/datasets');
                setDatasets(data);
            } catch (error) {
                console.error('Error fetching datasets', error);
            }
        };

        fetchDatasets();
    }, []);

    const handleDatasetChange = (e) => {
        setSelectedDataset(e.target.value);
    };

    const handleFileUpload = (e) => {
        setUploadedFile(e.target.files[0]);
    };

    const handleManualChange = (index, e) => {
        const { name, value } = e.target;
        const updatedEntries = [...manualEntries];
        updatedEntries[index] = {
            ...updatedEntries[index],
            [name]: value
        };
        setManualEntries(updatedEntries);
    };

    const handleAddEntry = () => {
        setManualEntries([...manualEntries, {}]);
    };

    const handleDeleteEntry = (index) => {
        const updatedEntries = manualEntries.filter((_, i) => i !== index);
        setManualEntries(updatedEntries);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let predictionData = {};

        if (selectedDataset) {
            predictionData.datasetId = selectedDataset;
        } else if (uploadedFile) {
            const formData = new FormData();
            formData.append('file', uploadedFile);
            try {
                const { data } = await axios.post('/api/predictions/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                predictionData = data;
            } catch (error) {
                console.error('Error uploading file', error);
                setError('Failed to upload file. Please try again.');
                return;
            }
        } else if (manualEntries.length > 0) {
            predictionData.manualData = manualEntries;
        } else {
            setError('Please select a dataset, upload a file, or enter patient data.');
            return;
        }

        try {
            const { data } = await axios.post('/api/predictions', predictionData);
            navigate('/results', { state: { results: data } });
        } catch (error) {
            console.error('Error making prediction', error);
            setError('Failed to make prediction. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2>Make a Prediction</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Select Dataset from Database</label>
                    <select
                        className="form-control"
                        value={selectedDataset}
                        onChange={handleDatasetChange}
                    >
                        <option value="">Select a dataset</option>
                        {datasets.map((dataset) => (
                            <option key={dataset._id} value={dataset._id}>
                                {dataset.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Or Upload Your Own Dataset</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={handleFileUpload}
                    />
                </div>

                <div className="form-group">
                    <label>Or Manually Enter Patient Data</label>
                    {manualEntries.map((entry, index) => (
                        <div key={index} className="form-group">
                            <input
                                type="number"
                                name="age"
                                className="form-control mb-2"
                                placeholder="Age"
                                value={entry.age || ''}
                                onChange={(e) => handleManualChange(index, e)}
                            />
                            <input
                                type="number"
                                name="bloodPressure"
                                className="form-control mb-2"
                                placeholder="Blood Pressure"
                                value={entry.bloodPressure || ''}
                                onChange={(e) => handleManualChange(index, e)}
                            />
                            <button
                                type="button"
                                className="btn btn-danger mb-3"
                                onClick={() => handleDeleteEntry(index)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-secondary mb-3"
                        onClick={handleAddEntry}
                    >
                        Add Another Patient
                    </button>
                </div>

                <button type="submit" className="btn btn-primary">
                    Predict
                </button>
            </form>
        </div>
    );
}

export default PredictionPage;

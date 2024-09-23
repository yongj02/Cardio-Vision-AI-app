const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    // Add other fields if needed, e.g., description
}, { timestamps: true });

const Dataset = mongoose.model('Dataset', datasetSchema);

module.exports = Dataset;
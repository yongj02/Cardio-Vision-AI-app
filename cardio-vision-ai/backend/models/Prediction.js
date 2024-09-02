const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientData: { type: Map, of: String, required: true },
    predictionResult: { type: String, required: true },
    correct: { type: Boolean, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);

const mongoose = require('mongoose');

const predictionResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  savedPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }] // Array of Patient IDs
});

const PredictionResult = mongoose.model('PredictionResult', predictionResultSchema);

module.exports = PredictionResult;

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientInfo: { type: Object, required: true },
  predictionOutcome: { type: String, required: true },
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientInfo: {
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    chestPainType: { type: String, required: true },
    bloodPressure: { type: Number, required: true },
    cholesterol: { type: Number, required: true },
    fastingBloodSugar: { type: Number, required: true },
    restingECG: { type: String, required: true },
    maxHeartRate: { type: Number, required: true },
    exerciseAngina: { type: String, required: true },
    oldpeak: { type: Number, required: true },
    stSlope: { type: String, required: true },
    predictionOutcome: { type: String, required: true } // High Risk or Low Risk
  }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;

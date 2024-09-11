const Patient = require('../models/Patient');

const savePatientData = async (req, res) => {
  const { patientInfo, predictionOutcome } = req.body;
  try {
    const patient = new Patient({
      user: req.user.id,
      patientInfo,
      predictionOutcome,
    });
    await patient.save();
    res.status(201).json({ message: 'Patient data saved successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { savePatientData };

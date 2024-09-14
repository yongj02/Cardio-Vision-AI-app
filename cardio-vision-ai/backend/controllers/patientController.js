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

const deletePatientData = async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await Patient.findOneAndDelete({ _id: id, user: req.user.id });
    if (!patient) {
      return res.status(404).json({ error: 'Patient data not found' });
    }
    res.status(200).json({ message: 'Patient data deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePatientData = async (req, res) => {
  const { id } = req.params;
  const { newName } = req.body; // Assuming newName is the field you want to update
  try {
    const patient = await Patient.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: { 'patientInfo.name': newName } }, // Update the necessary field
      { new: true }
    );
    if (!patient) {
      return res.status(404).json({ error: 'Patient data not found' });
    }
    res.status(200).json({ message: 'Patient data updated successfully', patient });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { savePatientData, deletePatientData, updatePatientData };

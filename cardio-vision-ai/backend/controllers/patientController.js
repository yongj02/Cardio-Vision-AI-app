const Patient = require('../models/Patient');
const PredictionResult = require('../models/PredictionResult');

// Save multiple patients and create a new PredictionResult
const savePatientData = async (req, res) => {
  const { name, patientInfos } = req.body; // Expecting an array of patientInfos and a name for the prediction result
  try {
    // Create and save each patient
    const savedPatientIds = [];
    for (const patientInfo of patientInfos) {
      const patient = new Patient({ patientInfo });
      await patient.save();
      savedPatientIds.push(patient._id);
    }

    // Create and save a new PredictionResult
    const predictionResult = new PredictionResult({
      user: req.user.id,
      name,
      savedPatients: savedPatientIds
    });
    await predictionResult.save();

    res.status(201).json({ message: 'Patient data saved successfully', predictionResult });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a PredictionResult and all associated patients
const deletePatientData = async (req, res) => {
  const { id } = req.params;
  try {
    const predictionResult = await PredictionResult.findById(id).populate('savedPatients');
    if (!predictionResult) {
      return res.status(404).json({ error: 'PredictionResult not found' });
    }

    // Delete associated patients
    await Patient.deleteMany({ _id: { $in: predictionResult.savedPatients.map(patient => patient._id) } });

    // Delete the PredictionResult
    await PredictionResult.findByIdAndDelete(id);

    res.status(200).json({ message: 'PredictionResult and associated patients deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update the name of a PredictionResult
const updateResultName = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body; // Expecting updated name

  try {
    const predictionResult = await PredictionResult.findByIdAndUpdate(
      id,
      { $set: { name } }, // Update the name field
      { new: true }
    );
    if (!predictionResult) {
      return res.status(404).json({ error: 'PredictionResult not found' });
    }
    res.status(200).json({ message: 'PredictionResult updated successfully', predictionResult });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update the savedPatients for a PredictionResult
const updatePatientData = async (req, res) => {
  const { id } = req.params;
  const { patientInfos } = req.body; // Expecting an array of patientInfos

  try {
    const predictionResult = await PredictionResult.findById(id);
    if (!predictionResult) {
      return res.status(404).json({ error: 'PredictionResult not found' });
    }

    // Delete existing patients
    await Patient.deleteMany({ _id: { $in: predictionResult.savedPatients } });

    // Create and save new patients
    const savedPatientIds = [];
    for (const patientInfo of patientInfos) {
      const patient = new Patient({ patientInfo });
      await patient.save();
      savedPatientIds.push(patient._id);
    }

    // Update the PredictionResult with new patients
    predictionResult.savedPatients = savedPatientIds;
    await predictionResult.save();

    res.status(200).json({ message: 'PredictionResult updated with new patients successfully', predictionResult });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Retrieve all PredictionResults for the current user
const getUserPredictionResults = async (req, res) => {
  try {
    const predictionResults = await PredictionResult.find({ user: req.user.id }).populate('savedPatients');
    res.status(200).json(predictionResults);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { savePatientData, deletePatientData, updateResultName, updatePatientData, getUserPredictionResults };

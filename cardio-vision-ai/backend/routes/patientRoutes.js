const express = require('express');
const {
  savePatientData,
  deletePatientData,
  updateResultName,  
  updatePatientData, 
  getUserPredictionResults
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Save multiple patients and create a new PredictionResult
router.post('/save', protect, savePatientData);

// Delete a PredictionResult and all associated patients
router.delete('/delete/:id', protect, deletePatientData);

// Update the name of a PredictionResult
router.put('/update/name/:id', protect, updateResultName); 

// Update the savedPatients for a PredictionResult
router.put('/update/patients/:id', protect, updatePatientData); 

// Retrieve all PredictionResults for the current user
router.get('/results', protect, getUserPredictionResults);

module.exports = router;

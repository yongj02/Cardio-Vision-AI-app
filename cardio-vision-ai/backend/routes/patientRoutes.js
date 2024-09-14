const express = require('express');
const { savePatientData, deletePatientData, updatePatientData, getUserPredictionResults } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/save', protect, savePatientData); // Save multiple patients
router.delete('/delete/:id', protect, deletePatientData); // Delete PredictionResult and associated patients
router.put('/update/:id', protect, updatePatientData); // Update PredictionResult name
router.get('/results', protect, getUserPredictionResults); // Get all prediction results for a user

module.exports = router;

const express = require('express');
const { savePatientData, deletePatientData, updatePatientData } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/save', protect, savePatientData);
router.delete('/delete/:id', protect, deletePatientData);
router.put('/update/:id', protect, updatePatientData);

module.exports = router;

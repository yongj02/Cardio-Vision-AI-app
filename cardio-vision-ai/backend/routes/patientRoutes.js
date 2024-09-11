const express = require('express');
const { savePatientData } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/save', protect, savePatientData);

module.exports = router;

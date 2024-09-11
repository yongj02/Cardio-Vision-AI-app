const express = require('express');
const { makePrediction } = require('../controllers/predictionController');
const router = express.Router();

router.post('/predict', makePrediction);

module.exports = router;

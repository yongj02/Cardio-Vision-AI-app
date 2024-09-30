const express = require('express');
const { makePrediction } = require('../controllers/predictionController');
const router = express.Router();

router.post('/', makePrediction);

module.exports = router;

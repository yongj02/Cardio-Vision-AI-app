const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/prediction.controller');

router.post('/', predictionController.createPrediction);
router.post('/:id/mark-correct', predictionController.markAsCorrect);
router.post('/:id/mark-incorrect', predictionController.markAsIncorrect);

module.exports = router;

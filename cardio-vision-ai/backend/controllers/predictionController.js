const loadModel = require('../models/loadModel');
const preprocessInput = require('../utils/preprocessInput');

const makePrediction = async (req, res) => {
  try {
    const model = await loadModel();
    const inputTensor = preprocessInput(req.body);
    const prediction = model.predict(inputTensor);
    const predictedValue = (await prediction.data())[0];
    res.json({
      prediction: predictedValue === 1 ? 'Heart Disease' : 'No Heart Disease',
    });
  } catch (error) {
    console.error('Error making prediction:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { makePrediction };

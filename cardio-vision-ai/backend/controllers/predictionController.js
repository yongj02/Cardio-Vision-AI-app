const loadModel = require('../models/loadModel');
const preprocessInput = require('../utils/preprocessInput');

const makePrediction = async (req, res) => {
  try {
    // Load the model once instead of inside the loop
    const modelType = req.body.modelType.toLowerCase();
    const model = await loadModel(modelType);
    let predictedPatients = [];

    // Process each patient asynchronously
    for(const patient of req.body.patients){
      const inputTensor = preprocessInput(patient, modelType);  // Pass patient data to the preprocessing function
      const inputTensors = [
        inputTensor.reshape([inputTensor.shape[0], inputTensor.shape[1]]),
        inputTensor.reshape([inputTensor.shape[0], inputTensor.shape[1], 1]),
        inputTensor.reshape([inputTensor.shape[0], inputTensor.shape[1], 1]), 
        inputTensor.reshape([inputTensor.shape[0], inputTensor.shape[1], 1])
      ];
      const prediction = model.predict(inputTensors);
      const threshold = 0.5;
      const predictedValue = (await prediction.data())[0] >= threshold ? 1 : 0;
      predictedPatients.push({...patient, prediction: predictedValue});
    }
    res.json({
      predictedPatients
    })
  } catch (error) {
    console.error('Error making prediction:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { makePrediction };

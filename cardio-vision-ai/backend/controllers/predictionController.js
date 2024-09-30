const loadModel = require('../models/loadModel');
const preprocessInput = require('../utils/preprocessInput');

const makePrediction = async (req, res) => {
  try {
    // Load the model once instead of inside the loop
    const model = await loadModel();
    let predictedPatients = [];

    // Process each patient asynchronously
    for(const patient of req.body.patients){
      const inputTensor = preprocessInput(patient);  // Pass patient data to the preprocessing function
      const reshapedTensor = inputTensor.reshape([1, 20, 1]);
      const prediction = model.predict(reshapedTensor);
      const predictedValue = await prediction.data();
      predictedPatients.push({...patient, prediction: Math.round(predictedValue[1])});
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

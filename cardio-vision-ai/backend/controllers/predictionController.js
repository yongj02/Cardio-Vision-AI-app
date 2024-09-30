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
      const threshold = 0.99645;
      const predictedValue = (await prediction.data())[1] >= threshold ? 1 : 0;
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

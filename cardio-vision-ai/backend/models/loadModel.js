const tf = require('@tensorflow/tfjs-node');

let model;

const loadModel = async () => {
  if (!model) {
    try {
      model = await tf.loadLayersModel('file://backend/trainedModels/WOCLSA_CVD_FinalData.h5');
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
    }
  }
  return model;
};

module.exports = loadModel;

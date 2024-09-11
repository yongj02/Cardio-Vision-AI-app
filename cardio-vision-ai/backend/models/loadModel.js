const tf = require('@tensorflow/tfjs-node');

let model;

const loadModel = async () => {
  if (!model) {
    model = await tf.loadLayersModel('file://backend/trainedModels/WOCLSA_CVD_FinalData.h5');
    console.log('Model loaded successfully');
  }
  return model;
};

module.exports = loadModel;

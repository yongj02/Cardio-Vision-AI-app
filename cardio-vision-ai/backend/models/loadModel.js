const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

let model;

const loadModel = async (modelType) => {
  try {
    model = await tf.loadLayersModel(`file://trainedModels/${modelType}_model/model.json`);
    console.log(`${modelType} Model loaded successfully`);
  } catch (error) {
    console.error('Error loading model:', error);
  }
  return model;
};

module.exports = loadModel;

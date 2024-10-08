const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
/*
class OrthogonalInitializer extends tf.serialization.Serializable {
  constructor(gain = 1.0) {
    super();
    this.gain = gain;
  }

  apply(shape, dtype) {
    return tf.tidy(() => {
      console.log('Shape of tensor to initialize:', shape);
  
      let flat_shape;
      if (shape.length < 2) {
        flat_shape = [1, shape[0]];
      } else {
        flat_shape = [shape.reduce((a, b, i) => i < shape.length - 1 ? a * b : a, 1), shape[shape.length - 1]];
      }
  
      const num_rows = flat_shape[0]; // total rows of the flattened shape
      const num_cols = flat_shape[1]; // total columns of the flattened shape
      const min_dim = Math.min(num_rows, num_cols);
  
      // Generate a random matrix
      let a = tf.randomNormal(flat_shape);
      console.log('Matrix a before QR decomposition:', a);
  
      // Compute the QR factorization (Destructure result into q and r)
      const [q, r] = tf.linalg.qr(a, false);
      console.log('q:', q);
  
      // Apply diagonal identity matrix instead of bandPart
      const d = tf.eye(min_dim);
      let q_scaled = tf.mul(q, d);
  
      // Here we reshape q based on the original tensor's last dimension
      if (num_rows < num_cols) {
        q_scaled = q_scaled.transpose();
      }
  
      // Check if reshaping is necessary
      // We will only reshape q_scaled to the original shape if its shape is valid
      const q_scaled_shape = q_scaled.shape; // shape of the scaled q
      if (q_scaled_shape[0] * q_scaled_shape[1] === flat_shape[0] * flat_shape[1]) {
        q_scaled = q_scaled.reshape(shape);
      } else {
        console.warn('Skipping reshape as dimensions do not match');
      }
  
      // Apply gain (ensure proper order and non-null gain)
      console.log('Gain:', this.gain);
      return tf.mul(q_scaled, this.gain);
    });
  }

  getConfig() {
    return {
      gain: this.gain
    };
  }

  static className = 'OrthogonalInitializer';
}

tf.serialization.registerClass(OrthogonalInitializer);
*/
let model;

const loadModel = async (modelType) => {
  try {
    model = await tf.loadLayersModel(`file://trainedModels/${modelType}_model/model.json`);
    console.log('Model loaded successfully');
  } catch (error) {
    console.error('Error loading model:', error);
  }
  return model;
};

module.exports = loadModel;

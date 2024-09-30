const tf = require('@tensorflow/tfjs-node');

class OrthogonalInitializer extends tf.serialization.Serializable {
  constructor(gain = 1.0) {
    super();
    this.gain = gain;
  }

  apply(shape, dtype) {
    return tf.tidy(() => {
      let flat_shape;
      if (shape.length < 2) {
        flat_shape = [1, shape[0]];
      } else {
        flat_shape = [shape.reduce((a, b, i) => i < shape.length - 1 ? a * b : a, 1), shape[shape.length - 1]];
      }

      const num_rows = flat_shape[0];
      const num_cols = flat_shape[1];
      const min_dim = Math.min(num_rows, num_cols);

      // Generate a random matrix
      let a = tf.randomNormal(flat_shape);

      // Compute the QR factorization
      let q = tf.linalg.qr(a, false).q;

      // Make Q uniform
      const d = tf.sign(tf.linalg.bandPart(q, 0, -1));
      q = tf.mul(q, d);

      if (num_rows < num_cols) {
        q = q.transpose();
      }

      // Reshape to the desired shape
      q = q.reshape(shape);

      // Apply gain
      return tf.mul(this.gain, q);
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

let model;

const loadModel = async () => {
  if (!model) {
    try {
      model = await tf.loadLayersModel('file://trainedModels/model1/model.json');
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
    }
  }
  return model;
};

module.exports = loadModel;

const tf = require('@tensorflow/tfjs-node');

function trainTestSplit(X, y, trainSize = 0.8) {
    const totalSamples = X.shape[0];
    const trainSamples = Math.floor(totalSamples * trainSize);

    // Shuffle data
    let indices = Array.from({ length: totalSamples }, (_, i) => i);
    tf.util.shuffle(indices);

    const trainIndices = tf.tensor1d(indices.slice(0, trainSamples), 'int32');
    const testIndices = tf.tensor1d(indices.slice(trainSamples), 'int32');

    // Split X and y based on trainSize
    let X_train = tf.gather(X, trainIndices);
    let X_test = tf.gather(X, testIndices);
    let y_train = tf.gather(y, trainIndices);
    let y_test = tf.gather(y, testIndices);

    return [X_train, X_test, y_train, y_test];
}

module.exports = { trainTestSplit };
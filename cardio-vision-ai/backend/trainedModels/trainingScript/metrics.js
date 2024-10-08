const tf = require('@tensorflow/tfjs');

// Function to calculate confusion matrix
function confusionMatrix(y_true, y_pred, numClasses) {
    const matrix = tf.zeros([numClasses, numClasses]).arraySync();

    y_true.arraySync().forEach((trueLabel, index) => {
        const predictedLabel = y_pred.arraySync()[index];
        matrix[trueLabel][predictedLabel] += 1;
    });

    return matrix;
}

// Example function to calculate ROC AUC (binary classification)
function rocAUC(y_true, y_pred_probabilities) {
    return tf.tidy(() => {
        // Convert inputs to tensors if they aren't already
        const yTrue = tf.tensor1d(y_true.arraySync ? y_true.arraySync() : y_true);
        const yPred = tf.tensor1d(y_pred_probabilities.arraySync ? y_pred_probabilities.arraySync() : y_pred_probabilities);

        // Sort predictions in descending order
        const sortedIndices = tf.topk(yPred, yPred.size).indices;
        const sortedYTrue = tf.gather(yTrue, sortedIndices);
        const sortedYPred = tf.gather(yPred, sortedIndices);

        // Calculate true positives and false positives
        const totalPositives = tf.sum(yTrue);
        const totalNegatives = tf.sub(yTrue.size, totalPositives);

        const tp = tf.cumsum(sortedYTrue);
        const fp = tf.sub(tf.range(1, yTrue.size + 1), tp);

        // Calculate true positive rate and false positive rate
        const tpr = tf.div(tp, totalPositives);
        const fpr = tf.div(fp, totalNegatives);

        // Calculate AUC using trapezoidal rule
        const dfpr = tf.sub(fpr.slice(1), fpr.slice(0, -1));
        const avgTpr = tf.mul(tf.add(tpr.slice(1), tpr.slice(0, -1)), 0.5);
        const auc = tf.sum(tf.mul(dfpr, avgTpr));

        return auc.arraySync();
    });
}

module.exports = { confusionMatrix, rocAUC };

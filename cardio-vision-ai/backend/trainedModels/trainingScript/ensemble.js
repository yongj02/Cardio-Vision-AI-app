const { LabelEncoder } = require('./labelEncoder');
const { trainTestSplit } = require('./trainTestSplit');
const { confusionMatrix, rocAUC } = require('./metrics');
const tf = require('@tensorflow/tfjs-node');
const dfd = require('danfojs-node');

async function ensemble(dataframe, targetCol, targetDir) {
    // Label encoding
    const target = dataframe[targetCol].values;
    const uniqueClasses = Array.from(new Set(target));
    const labelEncoder = new LabelEncoder(uniqueClasses);
    const labels = labelEncoder.transform(target);
    const classes = uniqueClasses;
    const numClasses = classes.length;

    // Drop the target column from features
    const X = dataframe.drop({ columns: [targetCol] });
    const y = new dfd.Series(labels);

    // Define the loss function, activation, and output nodes based on class count
    let lossFunction, activationFunction, outputNodes;
    if (numClasses === 2){
        lossFunction = "binaryCrossentropy";
        activationFunction = "sigmoid";
        outputNodes = 1;
    } else {
        lossFunction = "sparseCategoricalCrossentropy";
        activationFunction = "softmax";
        outputNodes = numClasses;
    }

    // Split data into training and test sets
    const X_tensor = tf.tensor2d(X.values);
    const y_tensor = tf.tensor1d(y.values);
    const [X_train, X_test, y_train, y_test] = trainTestSplit(X_tensor, y_tensor);

    const n_features = X_train.shape[1];

    // Reshape data to fit Conv1D and RNN layers
    const X_train_tensor = X_train.reshape([X_train.shape[0], n_features, 1]);
    const X_test_tensor = X_test.reshape([X_test.shape[0], n_features, 1]);
    const y_train_tensor = y_train.reshape([y_train.shape[0], 1]);
    const y_test_tensor = y_test.reshape([y_test.shape[0], 1]);

    function createDnnModel(inputShape) {
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 100, activation: 'relu', inputShape: [inputShape] }));
        model.add(tf.layers.dropout({ rate: 0.2 }));
        model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
        model.add(tf.layers.dropout({ rate: 0.2 }));
        model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
        return model;
    }

    function createCnnModel(inputShape) {
        const model = tf.sequential();
        model.add(tf.layers.conv1d({ filters: 64, kernelSize: 3, activation: 'relu', inputShape: [inputShape, 1] }));
        model.add(tf.layers.maxPooling1d({ poolSize: 2 }));
        model.add(tf.layers.dropout({ rate: 0.2 }));
        model.add(tf.layers.flatten());
        model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
        model.add(tf.layers.dropout({ rate: 0.2 }));
        return model;
    }

    function createRnnModel(inputShape) {
        const inputs = tf.input({ shape: [inputShape, 1] });
        const lstmLayer = tf.layers.lstm({ units: 128, dropout: 0.2, recurrentInitializer: 'glorotUniform' }).apply(inputs);
        const dropoutLayer = tf.layers.dropout({ rate: 0.2 }).apply(lstmLayer);
        const denseLayer = tf.layers.dense({ units: 64, activation: 'relu' }).apply(dropoutLayer);
        return tf.model({ inputs, outputs: denseLayer });
    }

    function createBirnnModel(inputShape) {
        const inputs = tf.input({ shape: [inputShape, 1] });
        const bilstmLayer = tf.layers.bidirectional({ layer: tf.layers.lstm({ units: 128, dropout: 0.2, recurrentInitializer: 'glorotUniform' }) }).apply(inputs);
        const dropoutLayer = tf.layers.dropout({ rate: 0.2 }).apply(bilstmLayer);
        const denseLayer = tf.layers.dense({ units: 64, activation: 'relu' }).apply(dropoutLayer);
        return tf.model({ inputs, outputs: denseLayer });
    }

    // Create ensemble model
    function createEnsembleModel(models, inputShapes) {
        let inputs = [];
        let outputs = [];
    
        // Ensure the models are connected correctly
        models.forEach((model, i) => {
            const input = tf.input({ shape: inputShapes[i] });
            const output = model.apply(input);
            inputs.push(input);
            outputs.push(output);
        });
    
        const concatenated = tf.layers.concatenate().apply(outputs);
        let ensembleOutput = tf.layers.dense({ units: 128, activation: 'relu' }).apply(concatenated);
        ensembleOutput = tf.layers.dense({ units: outputNodes, activation: activationFunction }).apply(ensembleOutput);
        
        const ensembleModel = tf.model({ inputs: inputs, outputs: ensembleOutput });
        ensembleModel.compile({ optimizer: 'adam', loss: lossFunction, metrics: ['accuracy'] });
        
        return ensembleModel;
    }    

    // Create individual models
    const dnnModel = createDnnModel(n_features);
    const cnnModel = createCnnModel(n_features);
    const rnnModel = createRnnModel(n_features);
    const birnnModel = createBirnnModel(n_features);

    const models = [dnnModel, cnnModel, rnnModel, birnnModel];
    const inputShapes = [[n_features], [n_features, 1], [n_features, 1], [n_features, 1]]

    // Create ensemble model
    const ensembleModel = createEnsembleModel(models, inputShapes);


    const X_train_tensors = [
        X_train_tensor.reshape([X_train.shape[0], n_features]),
        X_train_tensor.reshape([X_train.shape[0], n_features, 1]),
        X_train_tensor.reshape([X_train.shape[0], n_features, 1]), 
        X_train_tensor.reshape([X_train.shape[0], n_features, 1])
    ];

    const X_test_tensors = [
        X_test_tensor.reshape([X_test.shape[0], n_features]),
        X_test_tensor.reshape([X_test.shape[0], n_features, 1]),
        X_test_tensor.reshape([X_test.shape[0], n_features, 1]),
        X_test_tensor.reshape([X_test.shape[0], n_features, 1])
    ];

    // Train the model
    const batchSize = 32;
    const epochs = 100;
    await ensembleModel.fit(X_train_tensors, y_train_tensor, {
        batchSize: batchSize,
        epochs: epochs,
        validationSplit: 0.2,
        verbose: 0
    });

    // Predict
    const ensemblePredictions = ensembleModel.predict(X_test_tensors);
    const ensemblePredictionsLabels = (numClasses === 2)
        ? ensemblePredictions.greater(0.5).toInt()
        : ensemblePredictions.argMax(-1);

    // Confusion Matrix
    const confMatrix = confusionMatrix(y_test_tensor, ensemblePredictionsLabels, numClasses);
    console.log(`Confusion Matrix:`);
    console.table(confMatrix);

    /*
    // ROC-AUC
    if (numClasses === 2) {
        const auc = rocAUC(y_test_tensor, ensemblePredictions);
        console.log(`AUC-ROC: ${auc}`);
    }
    */

    // Log Loss
    let logLoss;
    if (numClasses === 2) {
        logLoss = tf.losses.sigmoidCrossEntropy(y_test_tensor, ensemblePredictions);
    } else {
        logLoss = tf.losses.sparseCategoricalCrossentropy(y_test_tensor, ensemblePredictions);
    }
    console.log(`Log Loss: ${logLoss.mean().arraySync()}`);

    await ensembleModel.save(targetDir);
}

module.exports = { ensemble };

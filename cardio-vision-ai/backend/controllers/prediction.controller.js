const Prediction = require('../models/Prediction');
const runModel = require('../utils/runModel');

// Route to handle the prediction process
exports.createPrediction = async (req, res) => {
    const { datasetId, manualData } = req.body;

    let predictionResults = [];
    
    if (datasetId) {
        // Fetch dataset and run prediction
        // Example: const dataset = await Dataset.findById(datasetId);
        // predictionResults = runPredictionOnDataset(dataset);
    } else if (manualData) {
        // Run prediction on manually entered data
        // Example: predictionResults = runPredictionOnData(manualData);
    }

    // Save prediction results to the database
    const newPrediction = new Prediction({ results: predictionResults });
    await newPrediction.save();

    res.status(201).json(predictionResults);
};

// Route to mark prediction as correct
exports.markAsCorrect = async (req, res) => {
    const { id } = req.params;
    const prediction = await Prediction.findById(id);
    
    if (prediction) {
        prediction.correct = true;
        await prediction.save();
        res.status(200).json({ message: 'Marked as correct' });
    } else {
        res.status(404).json({ message: 'Prediction not found' });
    }
};

// Route to mark prediction as incorrect
exports.markAsIncorrect = async (req, res) => {
    const { id } = req.params;
    const prediction = await Prediction.findById(id);
    
    if (prediction) {
        prediction.correct = false;
        await prediction.save();
        res.status(200).json({ message: 'Marked as incorrect' });
    } else {
        res.status(404).json({ message: 'Prediction not found' });
    }
};

exports.runModel = async (req, res) => {
    const { dataset, manualData } = req.body;
    
    try {
        // Combine dataset and manualData if both are provided, otherwise use one of them
        const patientData = dataset || manualData;

        // Call the dummy model function
        const result = runModel(patientData);

        // Send the result back to the client
        res.json({ prediction: result });
    } catch (error) {
        console.error('Error running model:', error);
        res.status(500).json({ error: 'Failed to run model' });
    }
};



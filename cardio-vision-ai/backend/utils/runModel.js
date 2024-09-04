const runModel = (patientData) => {
    // For now, return a dummy prediction based on simple logic
    return patientData.length > 0 ? 'Positive' : 'Negative'; 
    // Replace this with the actual model's prediction logic
};

module.exports = runModel;

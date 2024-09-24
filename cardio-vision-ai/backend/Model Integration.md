# Cardiovascular Disease Prediction Model Integration

This guide provides instructions on integrating a pre-trained deep learning model to predict whether a patient has cardiovascular disease based on specific attributes. The model is saved in a `.json` format and can be used with a Node.js and Express backend and a React frontend.

## Prerequisites

- Node.js and npm installed
- Basic understanding of JavaScript, Node.js, and Express
- The `.json` model file downloaded

## Step 1: Install TensorFlow.js

To run the pre-trained model, you'll need to install TensorFlow.js, which allows you to load and use TensorFlow models directly in your JavaScript environment.

```bash
npm install @tensorflow/tfjs-node
```

## Step 2: Loading the Model

Use the following code snippet to load the model from the `.json` file. Ensure that the model is saved in the same directory as your server code or provide the correct path.

```javascript
const tf = require("@tensorflow/tfjs-node");

// Load the pre-trained model
async function loadModel() {
  const model = await tf.loadLayersModel("file://path/to/your/model.json");
  console.log("Model loaded successfully");
  return model;
}

loadModel().catch(console.error);
```

## Step 3: Preprocessing the Input Data

The model expects preprocessed data where numerical attributes are normalised, and non-numerical attributes are OneHotEncoded. Below is an example function demonstrating the preprocessing steps you need to replicate in your API:

```javascript
// Preprocessing function
function preprocessInput(data) {
  // Normalise numerical values
  minAge = 28;
  maxAge = 77;
  data.Age = (data.Age - minAge) / (maxAge - minAge);

  minRestingBP = 0;
  maxRestingBP = 200;
  data.RestingBP =
    (data.RestingBP - minRestingBP) / (maxRestingBP - minRestingBP);

  minCholesterol = 0;
  maxCholesterol = 603;
  data.Cholesterol =
    (data.Cholesterol - minCholesterol) / (maxCholesterol - minCholesterol);

  minMaxHR = 60;
  maxMaxHR = 202;
  data.MaxHR = (data.MaxHR - minMaxHR) / (maxMaxHR - minMaxHR);

  minOldpeak = -2.6;
  maxOldpeak = 6.2;
  data.Oldpeak = (data.Oldpeak - minOldpeak) / (maxOldpeak - minOldpeak);

  // OneHotEncoding non-numerical attributes
  const encodedData = {
    Sex_M: data.Sex === "M" ? 1 : 0,
    Sex_F: data.Sex === "F" ? 1 : 0,
    ChestPainType_ATA: data.ChestPainType === "ATA" ? 1 : 0,
    ChestPainType_NAP: data.ChestPainType === "NAP" ? 1 : 0,
    ChestPainType_ASY: data.ChestPainType === "ASY" ? 1 : 0,
    ChestPainType_TA: data.ChestPainType === "TA" ? 1 : 0,
    RestingECG_Normal: data.RestingECG === "Normal" ? 1 : 0,
    RestingECG_ST: data.RestingECG === "ST" ? 1 : 0,
    RestingECG_LVH: data.RestingECG === "LVH" ? 1 : 0,
    ExerciseAngina_N: data.ExerciseAngina === "N" ? 1 : 0,
    ExerciseAngina_Y: data.ExerciseAngina === "Y" ? 1 : 0,
    ST_Slope_Up: data.ST_Slope === "Up" ? 1 : 0,
    ST_Slope_Flat: data.ST_Slope === "Flat" ? 1 : 0,
    ST_Slope_Down: data.ST_Slope === "Down" ? 1 : 0,
  };

  // Combine normalised and encoded data into a single input tensor
  return tf.tensor2d([
    [
      data.Age,
      data.RestingBP,
      data.Cholesterol,
      data.FastingBS
      data.MaxHR,
      data.Oldpeak,
      encodedData.Sex_M,
      encodedData.Sex_F,
      encodedData.ChestPainType_ATA,
      encodedData.ChestPainType_NAP,
      encodedData.ChestPainType_ASY,
      encodedData.ChestPainType_TA,
      encodedData.RestingECG_Normal,
      encodedData.RestingECG_ST,
      encodedData.RestingECG_LVH,
      encodedData.ExerciseAngina_N,
      encodedData.ExerciseAngina_Y,
      encodedData.ST_Slope_Up,
      encodedData.ST_Slope_Flat,
      encodedData.ST_Slope_Down,
    ],
  ]);
}
```

## Step 4: Making Predictions

You can use the loaded model to make predictions after preprocessing the data. Below is a function illustrating how to make an API call to predict whether a patient has cardiovascular disease:

```javascript
// Express route handler example
const express = require("express");
const app = express();
app.use(express.json());

let model;

// Load the model when the server starts
loadModel().then((loadedModel) => {
  model = loadedModel;
});

app.post("/predict", async (req, res) => {
  if (!model) {
    return res.status(500).json({ error: "Model not loaded yet" });
  }

  try {
    // Preprocess input data
    const inputTensor = preprocessInput(req.body);

    // Make prediction
    const prediction = model.predict(inputTensor);
    const predictedValue = (await prediction.data())[0]; // 0 or 1 indicating Heart Disease

    res.json({
      prediction: predictedValue === 1 ? "Heart Disease" : "No Heart Disease",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
```

## Step 5: Testing the API

To test the API, you can use any HTTP client like Postman or cURL. Send a POST request to `http://localhost:3000/predict` with a JSON body containing the patient data, structured similarly to the attributes outlined at the beginning.

### Example Request Body

```json
{
  "Age": 45,
  "Sex": "M",
  "ChestPainType": "ATA",
  "RestingBP": 120,
  "Cholesterol": 210,
  "FastingBS": 0,
  "RestingECG": "Normal",
  "MaxHR": 150,
  "ExerciseAngina": "N",
  "Oldpeak": 1.0,
  "ST_Slope": "Up"
}
```

### Expected Response

```json
{
  "prediction": "No Heart Disease"
}
```

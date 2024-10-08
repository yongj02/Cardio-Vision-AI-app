const tf = require('@tensorflow/tfjs-node');
tf.env().set('PROD', true);

const { processNumericalData, encodeNonNumericalData } = require('./processData');
const { ensemble } = require('./ensemble');
const dfd = require("danfojs-node");
const fs = require("fs/promises");

// Function to load dataset based on file extension
async function loadData(filename, filetype) {
  let df;

  const dirPath = "./datasets/";

  try {
    if (filetype === ".xlsx") {
        df = await dfd.readExcel(dirPath + filename + filetype);
    } else {
        df = await dfd.readCSV(dirPath + filename + filetype);
    }
  } catch (error) {
    console.error("Error loading data:", error);
    process.exit(1);
  }

  return df;
}

// Function to read the file and extract best features
async function extractBestFeatures(filePath) {
  let bestFeatures = [];

  try {
    const data = await fs.readFile(filePath, "utf-8");
    const lines = data.split("\n").slice(1, 11);

    lines.forEach((line) => {
      const startIdx = line.indexOf("[");
      const endIdx = line.indexOf("]");
      if (startIdx !== -1 && endIdx !== -1) {
        const stringList = line.substring(startIdx, endIdx + 1);
        const validJsonString = stringList.replace(/'/g, '"');
        try {
          const featureArray = JSON.parse(validJsonString);
          bestFeatures.push(featureArray);
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
        }
      }
    });
  } catch (error) {
    console.error("Error reading features file:", error);
    process.exit(1);
  }

  return bestFeatures;
}

async function applyFeatureSelection(df, bestFeatures) {
  const dfs = [df];

  bestFeatures.forEach((features) => {
    const selectedDf = df.loc({ columns: features });
    dfs.push(selectedDf);
  });

  return dfs;
}

// Main function
async function main() {
  const fileName = "heart";
  const fileType = ".csv";
  const fsFile = "./featuresFiles/fs_" + fileName + ".txt";

  // Load the data with the correct filetype
  let df = await loadData(fileName, fileType);

  let target;

  switch (fileName) {
    case "heart":
      target = "HeartDisease";
      break;

    case "darwin_data":
      target = "class";
      df.drop({ columns: ["ID"], inplace: true });
      df[target] = df[target].replace("P", 1);
      df[target] = df[target].replace("H", 0);
      break;

    case "arcene_data":
      target = "labels";
      df[target] = df[target].replace(-1, 0);
      break;

    case "malicious_executable":
      target = "Label";
      break;

    case "semeion_dataset":
      target = "Label";
      break;

    default:
      break;
  }

  if (!target) {
    console.error("Unknown dataset");
    process.exit(1);
  }

  // Normalisation and One-Hot Encoding
  df = await processNumericalData(df, target, false); // False for normalisation, True for standardisation
  df = await encodeNonNumericalData(df, target);

  const bestFeatures = await extractBestFeatures(fsFile);
  const dfs = await applyFeatureSelection(df, bestFeatures);

  // 1, 5, 6, 9
  await ensemble(dfs[6], target, "file://../../trainedModels/woa-ensemble_model");
}

main();

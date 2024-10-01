const tf = require('@tensorflow/tfjs-node');

// Preprocessing function
function preprocessInput(data) {
  // Normalise numerical values
  const minAge = 29;
  const maxAge = 77;
  const age = (data.age - minAge) / (maxAge - minAge);

  const minRestingBP = 92;
  const maxRestingBP = 200;
  const restingBP = (data.restingBP - minRestingBP) / (maxRestingBP - minRestingBP);

  const minCholesterol = 100;
  const maxCholesterol = 564;
  const cholesterol = (data.cholesterol - minCholesterol) / (maxCholesterol - minCholesterol);

  const minMaxHR = 63;
  const maxMaxHR = 190;
  const maxHR = (data.maxHR - minMaxHR) / (maxMaxHR - minMaxHR);

  const minOldpeak = -2;
  const maxOldpeak = 4;
  const oldpeak = (data.oldpeak - minOldpeak) / (maxOldpeak - minOldpeak);

  const fastingBS = data.fastingBS;

  // OneHotEncoding non-numerical attributes
  const encodedData = {
    sex_M: data.gender === 'M' ? 1 : 0,
    sex_F: data.gender === 'F' ? 1 : 0,
    chestPainType_ATA: data.chestPainType === 'ATA' ? 1 : 0,
    chestPainType_NAP: data.chestPainType === 'NAP' ? 1 : 0,
    chestPainType_ASY: data.chestPainType === 'ASY' ? 1 : 0,
    chestPainType_TA: data.chestPainType === 'TA' ? 1 : 0,
    restingECG_Normal: data.restingECG === 'Normal' ? 1 : 0,
    restingECG_ST: data.restingECG === 'ST' ? 1 : 0,
    restingECG_LVH: data.restingECG === 'LVH' ? 1 : 0,
    exerciseAngina_N: data.exerciseAngina === 'N' ? 1 : 0,
    exerciseAngina_Y: data.exerciseAngina === 'Y' ? 1 : 0,
    stSlope_Up: data.stSlope === 'Up' ? 1 : 0,
    stSlope_Flat: data.stSlope === 'Flat' ? 1 : 0,
    stSlope_Down: data.stSlope === 'Down' ? 1 : 0,
  };

  // Combine normalised and encoded data into a single input tensor
  return tf.tensor2d([
    [
      age,
      restingBP,
      cholesterol,
      fastingBS,
      maxHR,
      oldpeak,
      encodedData.sex_M,
      encodedData.sex_F,
      encodedData.chestPainType_ATA,
      encodedData.chestPainType_NAP,
      encodedData.chestPainType_ASY,
      encodedData.chestPainType_TA,
      encodedData.restingECG_Normal,
      encodedData.restingECG_ST,
      encodedData.restingECG_LVH,
      encodedData.exerciseAngina_N,
      encodedData.exerciseAngina_Y,
      encodedData.stSlope_Up,
      encodedData.stSlope_Flat,
      encodedData.stSlope_Down,
    ],
  ]);
}

module.exports = preprocessInput;

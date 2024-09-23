const tf = require('@tensorflow/tfjs-node');

// Preprocessing function
function preprocessInput(data) {
  // Normalise numerical values
  const minAge = 28;
  const maxAge = 77;
  data.Age = (data.Age - minAge) / (maxAge - minAge);

  const minRestingBP = 0;
  const maxRestingBP = 200;
  data.RestingBP = (data.RestingBP - minRestingBP) / (maxRestingBP - minRestingBP);

  const minCholesterol = 0;
  const maxCholesterol = 603;
  data.Cholesterol = (data.Cholesterol - minCholesterol) / (maxCholesterol - minCholesterol);

  const minMaxHR = 60;
  const maxMaxHR = 202;
  data.MaxHR = (data.MaxHR - minMaxHR) / (maxMaxHR - minMaxHR);

  const minOldpeak = -2.6;
  const maxOldpeak = 6.2;
  data.Oldpeak = (data.Oldpeak - minOldpeak) / (maxOldpeak - minOldpeak);

  // OneHotEncoding non-numerical attributes
  const encodedData = {
    Sex_M: data.Sex === 'M' ? 1 : 0,
    Sex_F: data.Sex === 'F' ? 1 : 0,
    ChestPainType_ATA: data.ChestPainType === 'ATA' ? 1 : 0,
    ChestPainType_NAP: data.ChestPainType === 'NAP' ? 1 : 0,
    ChestPainType_ASY: data.ChestPainType === 'ASY' ? 1 : 0,
    ChestPainType_TA: data.ChestPainType === 'TA' ? 1 : 0,
    RestingECG_Normal: data.RestingECG === 'Normal' ? 1 : 0,
    RestingECG_ST: data.RestingECG === 'ST' ? 1 : 0,
    RestingECG_LVH: data.RestingECG === 'LVH' ? 1 : 0,
    ExerciseAngina_N: data.ExerciseAngina === 'N' ? 1 : 0,
    ExerciseAngina_Y: data.ExerciseAngina === 'Y' ? 1 : 0,
    ST_Slope_Up: data.ST_Slope === 'Up' ? 1 : 0,
    ST_Slope_Flat: data.ST_Slope === 'Flat' ? 1 : 0,
    ST_Slope_Down: data.ST_Slope === 'Down' ? 1 : 0,
  };

  // Combine normalised and encoded data into a single input tensor
  return tf.tensor2d([
    [
      data.Age,
      data.RestingBP,
      data.Cholesterol,
      data.FastingBS,
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

module.exports = preprocessInput;

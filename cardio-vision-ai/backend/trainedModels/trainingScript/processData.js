const dfd = require("danfojs-node");

// Preprocessing numerical data
function processNumericalData(df, targetCol, standardise) {
    const scaler = standardise ? new dfd.StandardScaler() : new dfd.MinMaxScaler();
    const y = df[targetCol];
    df = df.drop({ columns: [targetCol], axis: 1 });
    const numericalCol = df.columns.filter(col => 
        ['int32', 'float32', 'int64', 'float64'].includes(df[col].dtype)
    );

    if (numericalCol.length === 0) {
        return df;
    }

    numericalCol.forEach(col => {
        df[col] = df[col].map(val => parseFloat(val));
    });

    const numericalData = df.loc({ columns: numericalCol });

    scaler.fit(numericalData);

    let df_enc = scaler.transform(numericalData);

    df = df.drop({ columns: numericalCol, axis: 1 });
    df = dfd.concat({ dfList: [df_enc, df, y], axis: 1, ignoreIndex: false });

    return df;
}

// Using OneHotEncoder to encode non-numerical data
function encodeNonNumericalData(df, targetCol) {
    const y = df[targetCol];
    df = df.drop({ columns: [targetCol], axis: 1 });
    const encoder = new dfd.OneHotEncoder();
    const nonNumericalCol = df.columns.filter(col => 
        ['string'].includes(df[col].dtype)
    );

    if (nonNumericalCol.length === 0) {
        return dfd.concat({ dfList: [df, new dfd.df({ [targetCol]: y })], axis: 1 });
    }

    let encodedDataList = [];
    for (let col of nonNumericalCol) {
        encoder.fit(df[col]);
        const encodedData = encoder.transform(df[col].values);

        const uniqueValues = df[col].unique().values;
        const newColumnNames = uniqueValues.map(value => `${col}_${value}`);

        const encodedDf = new dfd.DataFrame(encodedData, { columns: newColumnNames });
        encodedDataList.push(encodedDf);
    }

    df = df.drop({ columns: nonNumericalCol, axis: 1 });
    df = dfd.concat({ dfList: [df, ...encodedDataList, y], axis: 1, ignoreIndex: false });

    return df;
}

module.exports = { processNumericalData, encodeNonNumericalData };
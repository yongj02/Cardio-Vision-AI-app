function LabelEncoder(classes) {
    this.classes = classes;
    this.classToIndex = {};
    this.indexToClass = {};

    // Create mapping beween class names and numerical indices
    classes.forEach((cls, index) => {
        this.classToIndex[cls] = index;
        this.indexToClass[index] = cls;
    })

    // Transform labels to numerical format
    this.transform = function(labels) {
        return labels.map(label => this.classToIndex[label]);
    }

    // Inverse transform: map numerical labels back to original labels
    this.inverseTransform = function(encodedLabels) {
        return encodedLabels.map(index => this.indexToClass[index]);
    }
}

module.exports = { LabelEncoder };

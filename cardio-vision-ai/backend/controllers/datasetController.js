const Dataset = require('../models/Dataset');
const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse');
const ExcelJS = require('exceljs');

const uploadDataset = async (req, res) => {
    try {
        const { originalname, path: filePath } = req.file;
        const ext = path.extname(originalname);

        // Save file information to the database
        const dataset = new Dataset({
            name: originalname,
            fileUrl: filePath
        });
        await dataset.save();

        res.status(201).json({ message: 'Dataset uploaded successfully', dataset });
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload dataset', error });
    }
};

const getDatasets = async (req, res) => {
    try {
        const datasets = await Dataset.find();
        res.status(200).json(datasets);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch datasets', error });
    }
};

module.exports = {
    uploadDataset,
    getDatasets
};
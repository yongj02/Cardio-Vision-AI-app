const Dataset = require('../models/Dataset');
const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse');
const ExcelJS = require('exceljs');

// Function to process CSV files
const processCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const records = [];
        fs.createReadStream(filePath)
            .pipe(parse({ delimiter: ',' }))
            .on('data', (row) => {
                records.push(row);
            })
            .on('end', () => {
                resolve(records);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};

// Function to process Excel files
const processExcel = async (filePath) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);
    const rows = [];

    worksheet.eachRow({ includeEmpty: true }, (row) => {
        rows.push(row.values);
    });
    return rows;
};

const uploadDataset = async (req, res) => {
    try {
        const { originalname, path: filePath } = req.file;
        const ext = path.extname(originalname).toLowerCase(); // Ensure extension is in lowercase

        let processedData;
        if (ext === '.csv') {
            processedData = await processCSV(filePath);
        } else if (ext === '.xlsx') {
            processedData = await processExcel(filePath);
        } else {
            return res.status(400).json({ message: 'Unsupported file format. Please upload a CSV or Excel file.' });
        }

        // Save file information to the database
        const dataset = new Dataset({
            name: originalname,
            fileUrl: filePath,
        });
        await dataset.save();

        res.status(201).json({ message: 'Dataset uploaded and processed successfully', dataset, processedData });
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

const deleteDataset = async (req, res) => {
    try {
        const dataset = await Dataset.findById(req.params.id);
        if (!dataset) {
            return res.status(404).json({ message: 'Dataset not found' });
        }

        // Check if the file exists before attempting to delete
        if (fs.existsSync(dataset.fileUrl)) {
            try {
                // Attempt to delete the file
                fs.unlinkSync(dataset.fileUrl);
            } catch (fileError) {
                console.error('File deletion error:', fileError);
            }
        } else {
            console.warn(`File at ${dataset.fileUrl} does not exist.`);
        }

        // Delete the dataset entry from the database
        await Dataset.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Dataset deleted successfully' });
    } catch (error) {
        console.error('Error deleting dataset:', error);
        res.status(500).json({ message: 'Failed to delete dataset', error });
    }
};


module.exports = {
    uploadDataset,
    getDatasets,
    deleteDataset
};

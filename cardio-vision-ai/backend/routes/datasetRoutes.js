const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadDataset, getDatasets, deleteDataset } = require('../controllers/datasetController');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadDataset);
router.get('/', getDatasets);
router.delete('/:id', deleteDataset); // Add delete route

module.exports = router;

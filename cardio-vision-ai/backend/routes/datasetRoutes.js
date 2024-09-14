const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadDataset, getDatasets } = require('../controllers/datasetController');

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadDataset);
router.get('/', getDatasets);

module.exports = router;
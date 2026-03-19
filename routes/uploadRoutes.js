const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const uploadController = require('../controllers/uploadController');

// Task 3: File Upload Endpoint
router.post('/upload-image', upload.single('image'), uploadController.uploadImage);

module.exports = router;

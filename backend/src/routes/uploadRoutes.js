const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const UploadController = require('../controllers/uploadController');

// Upload único
router.post('/', upload.single('file'), UploadController.upload);

// Upload múltiplo
router.post('/batch', upload.array('files', 10), UploadController.batchUpload);

module.exports = router;

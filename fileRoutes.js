const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const ctrl = require('../controllers/fileController');

router.post('/upload', upload.single('file'), ctrl.uploadFile);
router.get('/:filename', ctrl.getFile);
router.delete('/:filename', ctrl.deleteFile);

module.exports = router;

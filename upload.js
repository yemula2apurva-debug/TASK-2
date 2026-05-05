const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/fileDB',
  file: (req, file) => {
    return {
      filename: Date.now() + '-' + file.originalname,
      bucketName: 'uploads'
    };
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/') &&
        !file.mimetype.startsWith('application/')) {
      return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;
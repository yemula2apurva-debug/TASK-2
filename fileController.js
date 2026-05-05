const mongoose = require('mongoose');

let gfs;
mongoose.connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

// Upload handled by Multer
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.status(201).json({
    message: 'File uploaded successfully',
    file: req.file
  });
};

// Get file by filename
exports.getFile = async (req, res) => {
  try {
    const files = await mongoose.connection.db
      .collection('uploads.files')
      .find({ filename: req.params.filename })
      .toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const readStream = gfs.openDownloadStreamByName(req.params.filename);
    readStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete file
exports.deleteFile = async (req, res) => {
  try {
    const files = await mongoose.connection.db
      .collection('uploads.files')
      .find({ filename: req.params.filename })
      .toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    await gfs.delete(files[0]._id);

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
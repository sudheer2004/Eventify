const multer = require('multer');
const { env } = require('../config/environment');

const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum is 5MB' });
    }
    return res.status(400).json({ message: err.message });
  }
  
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({ message: err.message });
  }
  
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;
const cloudinary = require('cloudinary').v2;
const { env } = require('./environment');

const configureCloudinary = () => {
  console.log('🔧 Configuring Cloudinary...');
  
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true
  });

  console.log('Cloud Name:', env.CLOUDINARY_CLOUD_NAME);
  console.log('API Key:', env.CLOUDINARY_API_KEY ? '✓ Present' : '✗ Missing');
  console.log('API Secret:', env.CLOUDINARY_API_SECRET ? '✓ Present' : '✗ Missing');
  console.log('✅ Cloudinary configured\n');
};

module.exports = { cloudinary, configureCloudinary };
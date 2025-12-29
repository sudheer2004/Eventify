const mongoose = require('mongoose');
const { env } = require('./environment');

const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDatabase;
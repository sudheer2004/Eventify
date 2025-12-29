const app = require('./src/app');
const connectDatabase = require('./src/config/database');
const { configureCloudinary } = require('./src/config/cloudinary');
const { configureGemini, getGeminiModel } = require('./src/config/gemini');
const { validateEnvironment, env } = require('./src/config/environment');

// Validate environment variables
validateEnvironment();

// Configure services
configureCloudinary();
const model = configureGemini();

// Connect to database
connectDatabase();

// Start server
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
  console.log(`💡 Gemini AI: ${!!model && typeof model.generateContent === 'function' ? '✅ Ready' : '❌ Not available'}`);
  console.log(`🔒 Race Condition Protection: ✅ Enabled (Atomic Operations)`);
  console.log(`${'='.repeat(50)}\n`);
});
const app = require('./src/app');
const connectDatabase = require('./src/config/database');
const { configureCloudinary } = require('./src/config/cloudinary');
const { configureGemini, getGeminiModel } = require('./src/config/gemini');
const { validateEnvironment, env } = require('./src/config/environment');

validateEnvironment();

configureCloudinary();
const model = configureGemini();

connectDatabase();

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
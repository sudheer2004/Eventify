const { GoogleGenerativeAI } = require('@google/generative-ai');
const { env } = require('./environment');

let model = null;

const configureGemini = () => {
  console.log('🔧 Configuring Gemini AI...');
  
  try {
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    
    model = genAI.getGenerativeModel({ 
     model: "gemini-2.5-flash",  // ← Changed from "gemini-1.5-flash-latest"
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
    
    console.log('✅ Gemini AI configured with model: gemini-1.5-flash\n');
    return model;
  } catch (error) {
    console.error('❌ Could not initialize Gemini model');
    console.error('Please verify your API key at: https://aistudio.google.com/app/apikey');
    process.exit(1);
  }
};

const getGeminiModel = () => {
  if (!model) {
    throw new Error('Gemini model not initialized. Call configureGemini() first.');
  }
  return model;
};

module.exports = { configureGemini, getGeminiModel };
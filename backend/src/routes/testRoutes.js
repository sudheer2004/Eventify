const express = require('express');
const { cloudinary } = require('../config/cloudinary');
const { getGeminiModel } = require('../config/gemini');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

router.get('/cloudinary', async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({ 
      success: true, 
      message: 'Cloudinary connection successful',
      status: result.status 
    });
  } catch (error) {
    console.error('Cloudinary test error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Cloudinary connection failed',
      error: error.message 
    });
  }
});

router.get('/gemini', authenticateToken, async (req, res) => {
  try {
    const model = getGeminiModel();
    
    const result = await model.generateContent('Say "Gemini AI is working perfectly!" in a friendly way.');
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      success: true, 
      message: 'Gemini AI connection successful',
      test: text
    });
  } catch (error) {
    console.error('Gemini test error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Gemini AI connection failed',
      error: error.message 
    });
  }
});

module.exports = router;
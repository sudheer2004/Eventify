const aiService = require('../services/aiService');
const { env } = require('../config/environment');

class AIController {
  async generateDescription(req, res) {
    try {
      const eventData = req.body;

      const result = await aiService.generateDescription(eventData);

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      console.error('❌ Gemini AI Error:', error);
      
      if (error.message?.includes('API key')) {
        return res.status(500).json({ 
          message: 'AI service configuration error. Please check your API key.',
          error: env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
      
      if (error.message?.includes('quota') || error.message?.includes('limit')) {
        return res.status(429).json({ 
          message: 'AI service is temporarily unavailable. Please try again later.',
        });
      }

      if (error.message?.includes('SAFETY')) {
        return res.status(400).json({ 
          message: 'Content was blocked by safety filters. Please try different event details.',
        });
      }

      res.status(500).json({ 
        message: 'Failed to generate description. Please try again.',
        error: env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new AIController();
const { getGeminiModel } = require('../config/gemini');

class AIService {
  async generateDescription(eventData) {
    const { title, category, location, date, time, capacity, existingDescription } = eventData;
    
    if (!title) {
      throw new Error('Event title is required');
    }

    const model = getGeminiModel();
    
    if (!model || typeof model.generateContent !== 'function') {
      throw new Error('AI service not available');
    }

    console.log('🤖 Generating description with Gemini AI...');

    let prompt;

    if (existingDescription && existingDescription.trim()) {
      prompt = this._buildEnhancementPrompt(title, category, location, date, time, capacity, existingDescription);
    } else {
      prompt = this._buildGenerationPrompt(title);
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    console.log('✅ Description generated successfully');
    console.log('Length:', generatedText.length, 'characters');

    return {
      description: generatedText.trim(),
      isEnhanced: !!existingDescription
    };
  }

  _buildEnhancementPrompt(title, category, location, date, time, capacity, existingDescription) {
    return `You are an expert event coordinator. Improve and enhance the following event description while preserving its original meaning and intent.

Event Title: ${title}
Category: ${category || 'General'}
Location: ${location || 'TBD'}
Date: ${date ? new Date(date).toLocaleDateString() : 'TBD'}
Time: ${time || 'TBD'}
Capacity: ${capacity || 'Limited'} attendees

Existing Description:
${existingDescription}

IMPORTANT OUTPUT RULES:
- Return ONLY plain text
- Do NOT use bold text, headings, bullet points, or markdown
- Do NOT label fields or repeat event details
- Write in paragraph form only
- Professional, engaging, and clear tone
- Maximum 2 short paragraphs (120–200 words)

Enhanced Description:`;
  }

  _buildGenerationPrompt(title) {
    return `You are an expert event coordinator.

Event Title: ${title}

IMPORTANT OUTPUT RULES:
- Return ONLY plain text
- Do NOT use bold text, headings, bullet points, or markdown
- Do NOT label fields (no "Event Title:", "Date:", etc.)
- Write as ONE single paragraph
- Maximum 30 words

Task:
Create a short, engaging event description suitable for a website.

Event Description:`;
  }
}

module.exports = new AIService();
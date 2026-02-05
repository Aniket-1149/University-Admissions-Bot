import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Compression system prompt
const COMPRESSION_SYSTEM_PROMPT = `You are a precision data extraction system for college admission documents.

CRITICAL RULES:
1. Extract ONLY factual admission requirements - NO marketing content
2. Remove all promotional language, testimonials, and subjective claims
3. Output MUST be valid JSON with exact structure
4. Be concise but complete - include all admission criteria
5. Never hallucinate or infer information not explicitly stated
6. If information is unclear or missing, omit that field

REQUIRED JSON STRUCTURE:
{
  "universityName": "string",
  "programs": [
    {
      "name": "string",
      "degree": "string",
      "duration": "string"
    }
  ],
  "requirements": {
    "academic": ["list of academic requirements"],
    "testScores": ["list of required test scores with minimum values"],
    "documents": ["list of required documents"]
  },
  "deadlines": ["list of important dates"],
  "fees": {
    "applicationFee": "string",
    "tuitionFee": "string"
  },
  "additionalInfo": ["any other critical admission information"]
}

Extract and compress the admission guidelines now.`;

const QA_SYSTEM_PROMPT = `You are a precise Q&A assistant for college admissions.

CRITICAL RULES:
1. Answer ONLY based on the provided compressed admission data
2. Never make assumptions or add information not in the data
3. If the answer is not in the data, say "This information is not available in the admission guidelines provided."
4. Be direct and factual - no promotional language
5. Keep answers concise but complete
6. Never hallucinate requirements or information

Answer the student's question based strictly on the admission data provided.`;

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'College Admissions API is running' });
});

// Compress admission text
app.post('/api/compress', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Use Gemini 2.5 Flash for compression
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
    });

    const prompt = `${COMPRESSION_SYSTEM_PROMPT}\n\nADMISSION DOCUMENT:\n${text}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        topK: 40,
      }
    });
    const response = await result.response;
    let responseText = response.text();

    // Clean up response - remove markdown code blocks if present
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse JSON
    let compressedData;
    try {
      compressedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Response Text:', responseText);
      return res.status(500).json({ 
        error: 'Failed to parse AI response. Please try again.',
        details: parseError.message 
      });
    }

    res.json(compressedData);

  } catch (error) {
    console.error('Compression Error:', error);
    res.status(500).json({ 
      error: 'Failed to process the admission text',
      details: error.message 
    });
  }
});

// Ask question based on compressed data
app.post('/api/ask-question', async (req, res) => {
  try {
    const { question, compressedData } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!compressedData) {
      return res.status(400).json({ error: 'Compressed data is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Use Gemini 2.5 Flash for Q&A
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
    });

    const prompt = `${QA_SYSTEM_PROMPT}\n\nADMISSION DATA:\n${JSON.stringify(compressedData, null, 2)}\n\nSTUDENT QUESTION:\n${question}\n\nANSWER:`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
      }
    });
    const response = await result.response;
    const answer = response.text().trim();

    res.json({ answer });

  } catch (error) {
    console.error('Q&A Error:', error);
    res.status(500).json({ 
      error: 'Failed to answer the question',
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 College Admissions API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Gemini API Key configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
});

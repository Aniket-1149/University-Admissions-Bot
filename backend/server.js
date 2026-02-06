import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';

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
1. Extract ALL factual admission requirements, no matter how small.
2. If text is provided, read it THOROUGHLY. Do not skip tables or lists.
3. Output MUST be valid JSON with exact structure.
4. If fee information is ambiguous, list what IS there.
5. If academic requirements are scattered, consolidate them list them all.
6. For programs, extract every program name mentioned.

REQUIRED JSON STRUCTURE:
{
  "universityName": "string",
  "programs": [
    {
      "name": "string",
      "degree": "string (e.g. BS, MS, PhD, Certificate)",
      "duration": "string"
    }
  ],
  "requirements": {
    "academic": ["list of academic requirements, GPA, specific degrees needed"],
    "testScores": ["list of required test scores with minimum values (SAT, ACT, GRE, TOEFL, IELTS etc)"],
    "documents": ["list of required documents (transcripts, letters, essays, resume etc)"]
  },
  "deadlines": ["list of important dates for application, scholarships, etc."],
  "fees": {
    "applicationFee": "string",
    "tuitionFee": "string (include per credit or per year details if available)",
    "otherFees": ["list of other mentioned fees"]
  },
  "additionalInfo": ["financial aid, scholarships, contact info. CLEAN TEXT ONLY. Do not use asterisks, bolding, or markdown. Split distinct points into separate items."]
}

Extract and compress the admission guidelines now. Ensure all string fields contain clean text without markdown formatting (no **, *, #, etc).`;

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

    const prompt = `${COMPRESSION_SYSTEM_PROMPT}\n\nADMISSION DOCUMENT:\n${text}`;
    const generationConfig = {
      temperature: 0.1, // Keep low for consistency
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192, // Allow for longer outputs to capture all details
    };

    let result;
    try {
      // Try with Gemini 2.5 Flash
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig
      });
    } catch (error) {
      if (error.status === 429 || (error.message && error.message.includes('429'))) {
        console.log('Gemini 2.5 Flash rate limited (Compress), switching to ScaleDown API...');
        result = await callScaleDownAPI(text, COMPRESSION_SYSTEM_PROMPT);
      } else {
        throw error;
      }
    }
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
      
      // Fallback: If responseText is not JSON (e.g. ScaleDown returned plain text),
      // wrap it in the expected structure so the frontend can display it.
      if (responseText && responseText.length > 0) {
        console.log('Attempting to structure raw text using heuristics...');
        compressedData = structureRawText(responseText);
      } else {
        return res.status(500).json({ 
          error: 'Failed to parse AI response. Please try again.',
          details: parseError.message 
        });
      }
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

    const prompt = `${QA_SYSTEM_PROMPT}\n\nADMISSION DATA:\n${JSON.stringify(compressedData, null, 2)}\n\nSTUDENT QUESTION:\n${question}\n\nANSWER:`;
    const generationConfig = {
      temperature: 0.2,
      topP: 0.8,
      topK: 40,
    };

    let result;
    try {
      // Try with Gemini 2.5 Flash
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig
      });
    } catch (error) {
      if (error.status === 429 || (error.message && error.message.includes('429'))) {
        console.log('Gemini 2.5 Flash rate limited (Q&A), switching to ScaleDown API...');
        const qaPrompt = `${QA_SYSTEM_PROMPT}\n\nSTUDENT QUESTION:\n${question}`;
        const contextData = JSON.stringify(compressedData, null, 2);
        result = await callScaleDownAPI(contextData, qaPrompt);
      } else {
        throw error;
      }
    }
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

// Helper to call ScaleDown API
async function callScaleDownAPI(context, promptText) {
  const apiKey = process.env.SCALEDOWN_API_KEY;
  const url = "https://api.scaledown.xyz/compress/raw/";

  if (!apiKey) {
    throw new Error('SCALEDOWN_API_KEY is not configured');
  }

  console.log('Calling ScaleDown API as fallback...');

  const payload = {
    context: context,
    prompt: promptText,
    model: "gpt-4o",
    scaledown: {
      rate: "auto"
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ScaleDown API Error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log('ScaleDown Raw Response:', JSON.stringify(result, null, 2));

  // Map ScaleDown 'compressed_prompt' to the expected text output
  // Support both direct property (from docs) and nested in results (from actual logs)
  const content = result.results?.compressed_prompt || result.compressed_prompt || "";
  
  if (!content) {
    console.warn("ScaleDown returned empty compressed_prompt");
  }
  
  return {
    response: {
      text: () => content
    }
  };
}

// Heuristic function to structure raw text into JSON when AI fails
function structureRawText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const data = {
    universityName: "University Admission Guide (Compressed)",
    programs: [],
    requirements: {
      academic: [],
      testScores: [],
      documents: []
    },
    deadlines: [],
    fees: {
      applicationFee: "Not specified",
      tuitionFee: "Not specified",
      otherFees: []
    },
    additionalInfo: []
  };

  // Keywords for simple classification
  const feeRegex = /(fee|rupees|rs\.|cost|payment|amount)/i;
  const appFeeRegex = /(application|registration)\s+fee/i;
  const deadlineRegex = /(date|deadline|schedule|submit|closing|open)/i;
  const programRegex = /(b\.?a\.|b\.?sc|m\.?a\.|m\.?sc|b\.?tech|m\.?tech|ph\.?d|degree|honours|major|course)/i;
  const academicRegex = /(eligib|mark|score|percent|class|grade|pass|qualification|criteri)/i;
  const documentRegex = /(mark\s?sheet|certificate|admit|card|photo|copy|copies)/i;

  // Try to set title from first line
  if (lines.length > 0 && lines[0].length < 100) {
    data.universityName = lines[0];
  }

  lines.forEach(line => {
    let matched = false;

    // Fees
    if (feeRegex.test(line)) {
      if (appFeeRegex.test(line)) {
        data.fees.applicationFee = line;
      } else {
        data.fees.otherFees.push(line);
      }
      matched = true;
    }

    // Deadlines
    if (deadlineRegex.test(line)) {
      data.deadlines.push(line);
      matched = true;
    }

    // Programs
    if (programRegex.test(line) && line.length < 100) {
      data.programs.push({
        name: line,
        degree: "Unspecified",
        duration: "Unspecified"
      });
      matched = true;
    }

    // Requirements
    if (academicRegex.test(line)) {
      data.requirements.academic.push(line);
      matched = true;
    }
    
    if (documentRegex.test(line)) {
      data.requirements.documents.push(line);
      matched = true;
    }

    // Fallback
    if (!matched) {
      data.additionalInfo.push(line);
    }
  });

  return data;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 College Admissions API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Gemini API Key configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
});

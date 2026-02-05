import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('🔍 Fetching available models...\n');
    
    // Try to list models
    const models = await genAI.listModels();
    
    console.log('✅ Available models:');
    for await (const model of models) {
      console.log(`  - ${model.name}`);
      console.log(`    Supported methods: ${model.supportedGenerationMethods?.join(', ')}`);
    }
  } catch (error) {
    console.error('❌ Error listing models:', error.message);
    
    // Try common model names
    console.log('\n🔄 Trying common model names...\n');
    
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'models/gemini-pro',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'models/gemini-1.5-flash-latest',
    ];
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        const response = await result.response;
        console.log(`✅ ${modelName} - WORKS!`);
        break; // If one works, we're done
      } catch (err) {
        console.log(`❌ ${modelName} - ${err.message.split('\n')[0]}`);
      }
    }
  }
}

listModels();

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function testDirectAPI() {
  // Try v1 endpoint
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
  try {
    console.log('🔍 Testing direct API call with v1 endpoint...\n');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, test message'
          }]
        }]
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS with v1/models/gemini-1.5-flash!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Error:', data);
      
      // Try listing models
      console.log('\n🔍 Trying to list available models...\n');
      const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`;
      const listResponse = await fetch(listUrl);
      const listData = await listResponse.json();
      
      if (listResponse.ok && listData.models) {
        console.log('✅ Available models:');
        listData.models.forEach(model => {
          console.log(`  - ${model.name}`);
        });
      } else {
        console.log('❌ Could not list models:', listData);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDirectAPI();

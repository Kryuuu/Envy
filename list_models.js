const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Bypass the model instantiation and try to fetch via HTTP if SDK doesn't expose listModels easily on the main class
  // actually genAI.getGenerativeModel is for getting a model.
  // The SDK doesn't always expose listModels directly in the helper.
  
  // Let's us fetch directly.
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.models) {
          console.log("Available Models List:");
          data.models.forEach(m => {
              console.log(`- ${m.name} [${m.supportedGenerationMethods.join(', ')}]`);
          });
      } else {
          console.log("No models found or error in data:", JSON.stringify(data));
      }
  } catch (error) {
      console.error("Error listing models:", error);
  }
}

listModels();

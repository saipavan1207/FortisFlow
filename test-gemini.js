/* global process */
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("No VITE_GEMINI_API_KEY found!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const prompt = `Analyze this financial data:
Monthly: []
Top Categories: []
Health Score: 50
Give 2 short insights:
- spending pattern
- suggestion to improve`;

async function run() {
  try {
    console.log("Testing Gemini API connection...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    console.log("\n------------ SUCCESS ------------\n");
    console.log("Raw Response Body Structure:\n", JSON.stringify(result, null, 2).substring(0, 300) + "...\n");
    console.log("Extracted Text:\n", result.response.text());
  } catch (err) {
    console.error("\n------------ FAILURE ------------\n");
    console.error("Gemini Error:", err);
  }
}

run();

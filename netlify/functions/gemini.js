/* global require, exports, process */
/* eslint-disable no-unused-vars */
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function (event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        
        // Fetch the key from Netlify environment variables
        const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            return { statusCode: 500, body: JSON.stringify({ error: "API key is not configured on the server" }) };
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        return {
            statusCode: 200,
            body: JSON.stringify({ text }),
        };
    } catch (error) {
        console.error("Netlify Function Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Failed to generate AI content" }) };
    }
};

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { fetch } = require('undici');
global.fetch = fetch;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-api-key');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

module.exports = { model };

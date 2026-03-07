// api/chat.js
import axios from 'axios';

export default async function handler(req, res) {
  // 1. Set CORS headers so your nested frontend can talk to this API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Use the environment variable you set in the Vercel Dashboard
  const API_KEY = process.env.VITE_GEMINI_API_KEY;

  try {
    // 3. Forward the request to Google's Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      req.body
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch from Gemini",
      details: error.response?.data || error.message
    });
  }
}
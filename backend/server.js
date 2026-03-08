require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// --- 1. THE BULLETPROOF CORS FIX ---
// This must stay at the VERY TOP, before ANY other middleware or routes.
app.use((req, res, next) => {
  // Dynamically allow the origin that is making the request
  const origin = req.headers.origin;

  // Check if the origin is your specific frontend
  if (origin && origin.includes("book-my-glam-web.vercel.app")) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Fallback for testing - you can change this to your specific URL later
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // CRITICAL: Handle the browser's "preflight" check. 
  // If the browser asks for permission (OPTIONS), we say YES immediately.
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }
  next();
});

// Backup middleware (optional but good for local dev)
app.use(cors());
app.use(express.json());

// --- 2. CHAT ENDPOINT ---
app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error("Chat error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch from Gemini" });
  }
});

// --- 3. GALLERY ENDPOINT ---
app.get('/api/uploads', async (req, res) => {
  try {
    // Return placeholder to confirm the "Blocked by CORS" is gone
    res.status(200).json({
      ok: true,
      items: [
        {
          _id: "1",
          url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop",
          caption: "Connection Successful!",
          type: "image"
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Failed to fetch gallery" });
  }
});

// --- 4. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
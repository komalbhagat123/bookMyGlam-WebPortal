require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// --- 1. BULLETPROOF GLOBAL CORS ---
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin === "https://book-my-glam-web.vercel.app") {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Backup middleware (good for local dev)
app.use(cors({
  origin: "https://book-my-glam-web.vercel.app",
  credentials: true
}));
app.use(express.json());

// --- Utility: Explicitly set CORS headers per route ---
function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "https://book-my-glam-web.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}

// --- 2. CHAT ENDPOINT ---
app.post('/api/chat', async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();

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
// IMPORTANT: keep this as /api/uploads, not /gallery/api/uploads
app.get('/api/uploads', async (req, res) => {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
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

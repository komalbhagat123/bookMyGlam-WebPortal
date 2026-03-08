require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// --- 1. CONFIGURE CORS (STRONGER IMPLEMENTATION) ---
const allowedOrigins = [
  "https://book-my-glam-web.vercel.app",
  "https://book-my-glam-web.vercel.app/" // Including the trailing slash version
];

// Custom Middleware to force headers (Vercel Fix)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle Preflight: If the browser sends OPTIONS, respond immediately with 200
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Standard middleware as a backup
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// --- 2. CHAT ENDPOINT ---
app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
    // Return the structure expected by your React Gallery component
    res.status(200).json({ 
      ok: true, 
      items: [
        // Placeholder data to test if the connection is working
        {
          _id: "1",
          url: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
          caption: "Test Image",
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
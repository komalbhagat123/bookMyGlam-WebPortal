require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// --- 1. CONFIGURE CORS ---
// This allows your specific frontend to communicate with this backend
app.use(cors({
  origin: "https://book-my-glam-web.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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

// --- 3. GALLERY ENDPOINT (Placeholder Logic) ---
// Note: Ensure your DB logic or cloud storage fetching happens here
app.get('/api/uploads', async (req, res) => {
  try {
    // This should return the structure expected by your React Gallery component
    // Example response structure:
    // res.json({ ok: true, items: [...] });
    res.status(200).json({ 
      ok: true, 
      items: [] // Replace with actual data from your database
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Failed to fetch gallery" });
  }
});

// --- 4. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
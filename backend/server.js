require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedOrigins = [
  "https://book-my-glam-web.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// ─── Rate-limit queue ─────────────────────────────────────────────────────────
let isBusy = false;
const requestQueue = [];

const processQueue = async () => {
  if (isBusy || requestQueue.length === 0) return;
  isBusy = true;

  const { payload, resolve, reject } = requestQueue.shift();

  try {
    const result = await callGemini(payload);
    resolve(result);
  } catch (err) {
    reject(err);
  } finally {
    isBusy = false;
    setTimeout(processQueue, 600);
  }
};

const enqueue = (payload) =>
  new Promise((resolve, reject) => {
    requestQueue.push({ payload, resolve, reject });
    processQueue();
  });

// ─── Gemini call with exponential back-off ────────────────────────────────────
const API_KEY = process.env.GEMINI_API_KEY;

const callGemini = async (payload, maxRetries = 4) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        payload
      );
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 429 && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`Gemini 429 – retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
};

// ─── /api/chat ────────────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {

    // ✅ Now accepts { message: "..." } from the frontend
    const userText = req.body.message;

    if (!userText || userText.trim() === "") {
      return res.status(400).json({ error: "Message is required." });
    }

    const geminiPayload = {
      contents: [{ parts: [{ text: userText }] }]
    };

    const data = await enqueue(geminiPayload);
    res.json(data);

  } catch (error) {
    const status = error.response?.status || 500;
    console.error("Gemini API Error:", error.response?.data || error.message);

    if (status === 429) {
      return res.status(429).json({ error: "Too busy right now. Please try again in a moment." });
    }

    res.status(status).json({
      error: "Failed to fetch from Gemini",
      details: error.response?.data || error.message
    });
  }
});

// ─── /api/uploads ─────────────────────────────────────────────────────────────
app.get('/api/uploads', async (req, res) => {
  try {
    const folder = process.env.CLOUDINARY_FOLDER || 'salon-uploads';

    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by('created_at', 'desc')
      .max_results(30)
      .execute();

    const items = result.resources.map((file) => ({
      _id: file.public_id,
      url: file.secure_url,
      type: file.resource_type === 'video' ? 'video' : 'image',
      caption: file.context?.custom?.caption || file.public_id.split('/').pop(),
      stylist: file.context?.custom?.stylist || null,
    }));

    res.status(200).json({ ok: true, items });

  } catch (error) {
    console.error("Cloudinary fetch error:", error);
    res.status(500).json({ ok: false, error: "Failed to fetch gallery." });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
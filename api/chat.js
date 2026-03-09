// api/chat.js  (or wherever your /api/chat route lives)
// Drop-in fix: adds a per-process request queue so Gemini never gets slammed.

import express from "express";
import fetch from "node-fetch"; // or use the global fetch if Node 18+

const router = express.Router();

// ─── Simple in-process queue ──────────────────────────────────────────────────
let isBusy = false;
const requestQueue = [];

const processQueue = async () => {
  if (isBusy || requestQueue.length === 0) return;
  isBusy = true;

  const { body, resolve, reject } = requestQueue.shift();

  try {
    const result = await callGeminiWithRetry(body);
    resolve(result);
  } catch (err) {
    reject(err);
  } finally {
    isBusy = false;
    // Wait 500 ms between requests to stay under Gemini's RPM limit
    setTimeout(processQueue, 500);
  }
};

const enqueue = (body) =>
  new Promise((resolve, reject) => {
    requestQueue.push({ body, resolve, reject });
    processQueue();
  });

// ─── Gemini call with exponential back-off ────────────────────────────────────
const callGeminiWithRetry = async (body, maxRetries = 4) => {
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status !== 429) {
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || "Gemini error");
      return data;
    }

    // 429 → wait and retry
    const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s, 8s
    console.warn(`Gemini 429 – retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
    await new Promise((r) => setTimeout(r, delay));
  }

  throw new Error("RATE_LIMITED"); // all retries exhausted
};

// ─── Route ────────────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const data = await enqueue(req.body); // queue the request instead of firing directly
    res.json(data);
  } catch (err) {
    if (err.message === "RATE_LIMITED") {
      return res.status(429).json({ error: { message: "Too busy right now. Please try again in a moment." } });
    }
    console.error("Chat route error:", err);
    res.status(500).json({ error: { message: err.message } });
  }
});

export default router;
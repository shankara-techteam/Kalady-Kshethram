
// Vercel Serverless Function — handles chat requests from the widget.
// Endpoint is live at: https://<yourdomain>/api/chat
 
import Groq from "groq-sdk";
import { loadKnowledgeBase } from "../knowledgeBase.js";
import { buildSystemPrompt } from "../systemPrompt.js";
 
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
 
// Cache system prompt across warm invocations (static content, safe to reuse).
let cachedSystemPrompt = null;
 
function getSystemPrompt() {
  if (!cachedSystemPrompt) {
    const kbText = loadKnowledgeBase();
    cachedSystemPrompt = buildSystemPrompt(kbText);
  }
  return cachedSystemPrompt;
}
 
// Groq free tier (llama-3.3-70b-versatile) is rate-limited around 6,000-12,000
// tokens/minute. Our system prompt is the dominant cost per request, so we
// keep conversation history short to avoid runaway token growth in long chats.
const MAX_HISTORY_TURNS = 4; // last 4 messages (2 user + 2 assistant turns)
 
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
 
  const { message, history } = req.body;
 
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "A valid 'message' string is required." });
  }
 
  try {
    const systemPrompt = getSystemPrompt();
 
    const fullHistory = Array.isArray(history) ? history : [];
    const trimmedHistory = fullHistory.slice(-MAX_HISTORY_TURNS);
 
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...trimmedHistory,
        { role: "user", content: message },
      ],
      temperature: 0.2,
      max_tokens: 350, // answers are meant to be short (2-5 sentences)
    });
 
    const reply = completion.choices[0]?.message?.content ?? "";
 
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Groq API error:", err);
 
    // Graceful handling for free-tier rate limits (429). Groq has TWO separate
    // limits: per-minute (TPM, resolves in seconds) and per-day (TPD, can mean
    // a wait of many minutes/hours). We check the error message to give an
    // honest wait-time estimate instead of always saying "a few seconds",
    // which would be misleading for a TPD exhaustion.
    if (err?.status === 429) {
      const errMsg = (err?.error?.message || err?.message || "").toLowerCase();
      const isDailyLimit = errMsg.includes("per day") || errMsg.includes("tpd");
 
      if (isDailyLimit) {
        return res.status(429).json({
          error:
            "I've reached today's usage limit and need some time to reset. Please try again later, or contact the temple office directly in the meantime.",
        });
      }
 
      return res.status(429).json({
        error:
          "I'm receiving a lot of questions right now. Please wait a few seconds and try again.",
      });
    }
 
    return res.status(500).json({
      error: "Something went wrong while generating a response. Please try again shortly.",
    });
  }
}
 
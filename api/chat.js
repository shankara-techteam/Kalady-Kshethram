// api/chat.js
// Vercel Serverless Function — handles chat requests from the widget.
// Endpoint will be live at: https://<yourdomain>/api/chat

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "A valid 'message' string is required." });
  }

  try {
    // TEMPORARY: placeholder system prompt — will be replaced in Step 2
    // with the real knowledge-base-stuffed prompt.
    const systemPrompt = `You are Shankara Sevak, a placeholder assistant for testing purposes only. Respond briefly.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Groq API error:", err);
    return res.status(500).json({ error: "Something went wrong while generating a response." });
  }
}
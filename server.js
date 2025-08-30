// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // loads .env file

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // put your API key in .env
})

// Route for chatbot
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // lightweight, cheap, smart
      messages: [
        { role: "system", content: "You are a helpful AI robot assistant." },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong with the AI agent" });
  }
});

// Start server
app.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001");
});

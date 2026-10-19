
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.json({
    message: "KnowSpace backend is running!"
  });
});

app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a question."
      });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: `You are KnowSpace, an AI campus learning assistant.
Help students understand DSA, programming, DBMS, web development,
and computer science topics.
Use simple English, step-by-step explanations, and examples.
If a student asks a question in Hinglish, you may answer in Hinglish.
Be clear and beginner-friendly.
Do not claim that you have access to college notes or documents
unless they are actually provided in the conversation.`,
      input: question.trim()
    });

    res.json({
      question: question,
      answer: response.output_text
    });
  } catch (error) {
  console.error("AI request failed:", error.status, error.message);

  res.status(500).json({
    error: error.message || "Unknown AI error"
  });
}
    res.status(500).json({
      error: "AI could not answer right now. Please check your API key, API billing, and try again."
    });
  }
);

app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});

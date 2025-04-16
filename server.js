const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route pour générer des questions
app.post('/generate-questions', async (req, res) => {
  try {
    const { topic, level, nbQuestions } = req.body;
    const prompt = `Génère ${nbQuestions} questions à choix multiples sur le thème "${topic}" pour un niveau ${level}. Pour chaque question, donne 1 bonne réponse et 3 mauvaises réponses. Format JSON: [{question, correct_answer, incorrect_answers: []}]`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-vision-preview',
      messages: [
        { role: 'system', content: 'Tu es un générateur de quiz.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: Math.max(700, nbQuestions * 70),
      temperature: 0.7
    });
    const text = response.choices[0].message.content;
    let questions;
    try {
      questions = JSON.parse(text);
    } catch (e) {
      // Try to extract JSON from text
      const match = text.match(/\[.*\]/s);
      if (match) {
        questions = JSON.parse(match[0]);
      } else {
        throw new Error('Format de réponse inattendu');
      }
    }
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});

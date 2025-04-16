require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/generate-questions', async (req, res) => {
  const { themes, nbQuestions } = req.body;
  if (!themes || !nbQuestions) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  try {
    const prompt = `Génère ${nbQuestions} questions de quiz variées sur les thèmes suivants : ${themes.join(', ')}.

Pour CHAQUE question, respecte STRICTEMENT ce format, sans rien ajouter ni omettre :
1. [Thème] Question complète et explicite sur une seule ligne
Proposition 1
Proposition 2
Proposition 3
Proposition 4
Réponse : (texte EXACT de la bonne réponse, identique à une des propositions ci-dessus)

Exemples :
1. [Cinéma] Quel film a remporté l'Oscar du meilleur film en 2020 ?
Parasite
Joker
1917
Once Upon a Time... in Hollywood
Réponse : Parasite

1. [Sciences] Quelle planète est la plus proche du Soleil ?
Vénus
Mars
Mercure
Jupiter
Réponse : Mercure

IMPORTANT :
- Il doit y avoir 1 ligne question, 4 propositions (sans lettre ni numéro devant), puis une ligne Réponse.
- Les propositions doivent être dans le même ordre que la bonne réponse.
- La réponse doit être le texte EXACT d'une des propositions, sans ajout.
- N'ajoute JAMAIS de section "Propositions" ou d'intitulé inutile.
- N'utilise JAMAIS de numérotation ou de lettre devant les choix.
- N'utilise JAMAIS de retour à la ligne dans la question, ni dans les propositions.
- Ne saute JAMAIS la ligne Réponse.
- Pas de phrase d'introduction, pas de conclusion.`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview', // GPT-4.1 nano ou équivalent selon l'API
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.8
    });
    const text = completion.choices[0].message.content;
    res.json({ questions: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

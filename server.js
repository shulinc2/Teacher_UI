require('dotenv').config();
const express = require('express');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });
    res.json({ reply: completion.data.choices[0].message.content });
  } catch (err) {
    console.error('Error from OpenAI:', err.message);
    res.status(500).json({ reply: 'Something went wrong.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

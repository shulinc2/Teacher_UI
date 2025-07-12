import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.post('/api/deepseek', async (req, res) => {
  const { messages, model = 'deepseek-chat' } = req.body;
  try {
    const r = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({ model, messages, temperature: 0.7 })
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DeepSeek request failed' });
  }
});

app.listen(3001, () => console.log('Proxy on http://localhost:3001'));

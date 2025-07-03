// server.js
import express from 'express';
import path    from 'path';
import cors    from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', express.static(path.join(process.cwd(), 'public')));

app.post('/api/analyze', async (req, res) => {
  const resp = await fetch('http://pdf-fastapi:7860/analyze', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(req.body)
  });
  const data = await resp.json();
  res.json(data);
});
;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});

// index.js
import express from 'express';
import path    from 'path';
import ocrProxy from './ocrProxy.js';

const app = express();

//解析 JSON
app.use(express.json());

//静态文件服务
app.use('/', express.static(path.join(process.cwd(), 'public')));

// 3) OCR 代理路由
app.use('/api/analyze', ocrProxy);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Front-end server listening on http://localhost:${PORT}`);
});

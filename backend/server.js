import express from 'express';
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import pdfParse from 'pdf-parse';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// 读 client_secrets + token
const CREDENTIALS_PATH = path.join(__dirname, 'client_secrets.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

const { installed } = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));

const oAuth2Client = new google.auth.OAuth2(
  installed.client_id,
  installed.client_secret,
  installed.redirect_uris[0]
);
oAuth2Client.setCredentials(token);

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

const TMP_DIR = path.join(__dirname, 'tmp');
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

app.get('/api/fetch-drive-pdf', async (req, res) => {
  const fileId = req.query.fileId;
  if (!fileId) return res.status(400).send('Missing fileId');

  try {
    // 下载 PDF 到临时目录
    const destPath = path.join(TMP_DIR, `${fileId}.pdf`);
    await new Promise((resolve, reject) => {
      const dest = fs.createWriteStream(destPath);
      drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' },
        (err, response) => {
          if (err) return reject(err);
          response.data
            .on('end', resolve)
            .on('error', reject)
            .pipe(dest);
        }
      );
    });

    // 解析
    const data = await pdfParse(destPath);
    fs.unlink(destPath, () => {});
    res.json({ text: data.text });
  } catch (err) {
    console.error('❌ Error fetching PDF:', err);
    res.status(500).send('Failed to fetch or parse PDF');
  }
});

app.listen(port, () => {
  console.log(`✅  API ready → http://localhost:${port}`);
});

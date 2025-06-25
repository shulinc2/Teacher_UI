import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import fs from "fs";
import fsp from "fs/promises";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import DeepSeek from "openai";
import * as wav from "node-wav";
import { pipeline, env } from "@xenova/transformers";
env.logLevel = "error";

/* ─────────────────────────────── 环境变量检查 ─────────────────────────────── */
["AZURE_SPEECH_KEY", "AZURE_SPEECH_REGION", "DEEPSEEK_API_KEY"].forEach(k => {
  if (!process.env[k]) {
    console.error(`❌ 缺少环境变量 ${k}`);
    process.exit(1);
  }
});
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ─────────────────────── DeepSeek / Azure SDK 初始化 ─────────────────────── */
const deepseek = new DeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});
const baseSpeechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.AZURE_SPEECH_KEY,
  process.env.AZURE_SPEECH_REGION
);
baseSpeechConfig.setProperty(
  sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs,
  "30000"
);
baseSpeechConfig.setProperty(
  sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs,
  "30000"
);

/* ─────────────────────────────── Express 设置 ─────────────────────────────── */
const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());
app.use(express.json());
app.use(express.static("."));

/* ─────────────────────────────── 工具函数 ─────────────────────────────── */
const shell = (cmd, args) =>
  new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: "inherit" });
    p.on("close", c => (c === 0 ? res() : rej(new Error(`${cmd} exited ${c}`))));
  });

const fileExists = async p => !!(await fsp.stat(p).catch(() => 0));

async function saveOutput(id, data) {
  await fsp.mkdir("outputs", { recursive: true });
  const out = `outputs/${id}.json`;
  await fsp.writeFile(out, JSON.stringify(data, null, 2), "utf8");
  return out;
}

const toWav16k = (src, dst) =>
  shell("ffmpeg", [
    "-y",
    "-i",
    src,
    "-vn",
    "-ac",
    "1",
    "-ar",
    "16000",
    "-sample_fmt",
    "s16",
    "-c:a",
    "pcm_s16le",
    dst,
  ]);

const downloadYTAudio = (url, mp3) =>
  shell("yt-dlp", [
    "-f",
    "bestaudio",
    "-x",
    "--audio-format",
    "mp3",
    "--no-playlist",
    "--max-filesize",
    "200M",
    "-o",
    mp3,
    url,
  ]);

/* ─────────────────────── 语音识别模块 ─────────────────────── */
function azureTranscribeFromWav(wavPath, langTag = "zh") {
  return new Promise((resolve, reject) => {
    const localeMap = { zh: "zh-CN", "zh-Hant": "zh-TW", en: "en-US" };
    const speechConfig = baseSpeechConfig;
    speechConfig.speechRecognitionLanguage = localeMap[langTag] || langTag;
    speechConfig.setProperty(
      sdk.PropertyId.Speech_LogFilename,
      `azure_log_${Date.now()}.txt`
    );

    const audioConfig = sdk.AudioConfig.fromAudioFileInput(wavPath);
    const rec = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    let fullTranscript = "";

    rec.recognized = (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        fullTranscript += e.result.text + " ";
      }
    };
    rec.canceled = (s, e) => {
      rec.stopContinuousRecognitionAsync();
      reject(new Error(e.errorDetails));
    };
    rec.sessionStopped = () => {
      rec.stopContinuousRecognitionAsync();
      resolve(fullTranscript.trim());
    };

    rec.startContinuousRecognitionAsync();
  });
}

async function whisperTranscribe(wavPath, langTag = "zh") {
  const stt = await pipeline(
    "automatic-speech-recognition",
    "Xenova/whisper-medium"
  );
  const buf = fs.readFileSync(wavPath);
  const { sampleRate, channelData } = wav.decode(buf);
  const res = await stt(channelData[0], {
    sampling_rate: sampleRate,
    language: langTag,
    task: "transcribe",
    chunk_length_s: 30,
    stride_length_s: 5,
  });
  return res.text.trim();
}

/* ─────────────────────── 多语言摘要 ─────────────────────── */
const prompts = {
    zh: `
  请先用 **200-500 字**完整概括这段内容，然后依序细节的分析以下四个问题，
  每个问题 **100-150 字**，并保持相同编号独立成段。
  
  1. **故事的核心驱动力是什么？**（人与外界／他人／自我的矛盾）
  2. **人物塑造：** 主角是谁？核心目标／动机？经历了怎样的变化／成长？（静态或动态）
  3. **主题思想：** 故事真正想探讨的深层含义是什么？（关于人性、社会、生命等）
  4. **三者关系：** 情节冲突如何推动人物行动与变化？冲突解决与人物变化如何共同揭示主题？
  
  格式：
  **概括：** ……
  
  **1. 核心驱动力**  
  ……
  
  **2. 人物塑造**  
  ……
  
  **3. 主题思想**  
  ……
  
  **4. 三者关系**  
  ……
  `.trim(),
  
    "zh-Hant": `
  請先用 **200-500 字**完整概括這段內容，然後依序细节的分析以下四個問題，
  每個問題 **100-150 字**，並保持相同編號獨立成段。
  
  1. **故事的核心驅動力是什麼？**（人與外界／他人／自我的矛盾）
  2. **人物塑造：** 主角是誰？核心目標／動機？經歷了怎樣的變化／成長？（靜態或動態）
  3. **主題思想：** 故事真正想探討的深層含義是什麼？（關於人性、社會、生命等）
  4. **三者關係：** 情節衝突如何推動人物行動與變化？衝突解決與人物變化如何共同揭示主題？
  
  格式：
  **概括：** ……
  
  **1. 核心驅動力**  
  ……
  
  **2. 人物塑造**  
  ……
  
  **3. 主題思想**  
  ……
  
  **4. 三者關係**  
  ……
  `.trim(),
  
    en: `
  First provide a **200–500-word** overall summary, then analyse the four points
  below in detail, **100–150 words** each, keeping the same numbering.
  
  1. **Core Driving Force:** Which conflict powers the story (man vs. environment / others / self)?
  2. **Characterisation:** Who is the protagonist? What is their main goal or motivation? How do they change (static vs. dynamic)?
  3. **Theme:** What deeper meaning does the story explore (humanity, society, life, etc.)?
  4. **Inter-relation:** How does the conflict drive actions and character change? How do the resolution and changes together reveal the theme?
  
  Format exactly as:
  
  **Summary:** ……
  
  **1. Core Driving Force**  
  ……
  
  **2. Characterisation**  
  ……
  
  **3. Theme**  
  ……
  
  **4. Inter-relation**  
  ……
  `.trim()
  };


async function summariseOne(text, lang = "zh") {
  const { choices } = await deepseek.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: prompts[lang] || prompts.zh },
      { role: "user", content: text },
    ],
    max_tokens: 1800,
    temperature: 0.3,
  });
  return choices[0].message.content.trim();
}

const summariseMulti = async text => ({
  zh: await summariseOne(text, "zh"),
  "zh-Hant": await summariseOne(text, "zh-Hant"),
  en: await summariseOne(text, "en"),
});

/* ─────────────────────────────── 会议纪要 Prompt ─────────────────────────────── */
const minutesPrompt = {
  zh: `
你是一名专业会议记录员。请把下面的会议全文转写内容整理成「会议纪要」，
用 **要点式列表**，并包含四个区块：

◎ 关键决策  
◎ 待办事项（写清负责人 + 截止日期，如未知可写"待定"）  
◎ 重要日期 / 金额 / 里程碑  
◎ 未解决问题或后续讨论

每条前面请用 "•" 开头。仅输出会议纪要，不要添加多余说明。`.trim(),

  en: `
You are a professional meeting minutes writer. Turn the following full
transcript into concise meeting minutes with four sections:

◎ Key Decisions  
◎ Action Items (include owner + due date if known)  
◎ Important Dates / Numbers / Milestones  
◎ Open Questions & Next Steps

Bullet each line with "•" and do NOT add commentary outside the four sections.`.trim(),

"zh-Hant": `
你是一名專業會議記錄員。請把下面的會議全文轉寫內容整理成「會議紀要」，  
使用 **要點式列表**，並分成四個區塊：

◎ 關鍵決策  
◎ 待辦事項（註明負責人 + 截止日期，如未知可寫「待定」）  
◎ 重要日期 / 金額 / 里程碑  
◎ 未解決問題或後續討論

每條前面請用 "•" 開頭。僅輸出會議紀要，不要添加多餘說明。`.trim()
};

async function generateMinutes(text, lang="zh") {
  const { choices } = await deepseek.chat.completions.create({
    model      : "deepseek-chat",
    messages   : [
      { role:"system", content: minutesPrompt[lang] || minutesPrompt.zh },
      { role:"user",   content: text }
    ],
    max_tokens : 1200,
    temperature: 0.3
  });
  return choices[0].message.content.trim();
}

/* ─────────────────────────────── 多语言会议纪要 ─────────────────────────────── */
const generateMinutesMulti = async (text) => ({
  zh: await generateMinutes(text, "zh"),
  "zh-Hant": await generateMinutes(text, "zh-Hant"),
  en: await generateMinutes(text, "en"),
});

/* ─────────────────────────────── 主接口 ─────────────────────────────── */
app.post("/api/process", upload.single("media"), async (req, res) => {
  try {
    const {
      mode = "transcript",
      language = "zh",
      videoUrl,
      reuseId,
      transcript: bodyTranscript,
      engine: userEngine, 
    } = req.body;

    let transcript = bodyTranscript;
    let sttEngine = "";
    let fileData = null;

    if (reuseId) {
        const p = `outputs/${reuseId}.json`;
        if (await fileExists(p)) {
            fileData = JSON.parse(await fsp.readFile(p, 'utf8'));
            
            if (!transcript) transcript = fileData.transcript || '';
            sttEngine = fileData.engine || "reuse";

            if (mode === 'summary' && fileData.summary) {
            return res.json({ id: reuseId, transcript, summary: fileData.summary, engine: fileData.engine });
            }

            if (mode === 'minutes' && fileData.minutes) {
            return res.json({ id: reuseId, transcript, minutes: fileData.minutes, engine: fileData.engine });
            }
        }
    }

    // no transcript then download
    let wavPath = req.file?.path;
    if (!transcript && !wavPath && videoUrl) {
      const ts = Date.now(),
        mp3 = `uploads/${ts}.mp3`;
      await downloadYTAudio(videoUrl, mp3);
      wavPath = `uploads/${ts}.wav`;
      await toWav16k(mp3, wavPath);
      await fsp.unlink(mp3);
    }
    // audio recognize
    if (!transcript && wavPath) {
        const prefer = userEngine || "whisper";
        if (prefer === "azure") {
          try {
            transcript = await azureTranscribeFromWav(wavPath, language);
            sttEngine  = "azure";
          } catch {
            transcript = await whisperTranscribe(wavPath, language);
            sttEngine  = "whisper";
          }
        } else {
          try {
            transcript = await whisperTranscribe(wavPath, language);
            sttEngine  = "whisper";
          } catch {
            transcript = await azureTranscribeFromWav(wavPath, language);
            sttEngine  = "azure";
          }
        }
        await fsp.unlink(wavPath);
      }

    if (!transcript)
      return res
        .status(400)
        .json({ error: "未上传音频，也未提供 videoUrl / transcript / reuseId。" });

    // save full texts
    if (mode === "transcript") {
      const id = Date.now();
      await saveOutput(id, { transcript, engine: sttEngine });
      return res.json({ id, transcript, engine: sttEngine});
    }
    // generate summary
    if (mode === "summary") {
        const summary = await summariseMulti(transcript);
        const id = reuseId || Date.now();
        await saveOutput(id, { ...(fileData||{}), transcript, summary, engine: sttEngine });
        return res.json({ id, transcript, summary, engine: sttEngine });
      }
    
    // minutes
    if (mode === "minutes") {
      const minutes = await generateMinutesMulti(transcript);
      const id = reuseId || Date.now();
      await saveOutput(id, { transcript, minutes, engine: sttEngine });
      return res.json({id, transcript, minutes, engine: sttEngine});
    }
    return res.status(400).json({ error: `未知模式 ${mode}` });

  } catch (err) {
    console.error("❌ 出错：", err);
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────── 启动服务 ─────────────────────────────── */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Service listening on :${PORT}`));

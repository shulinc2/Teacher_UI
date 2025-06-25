import dotenv from 'dotenv';
import cors from 'cors';
import express from "express";
import multer from "multer";
import { spawn } from "child_process";
import fs from 'fs/promises';       // 用于 async 文件读写，如 fs.readFile、fs.unlink
import * as wav from 'node-wav';
import { readFile } from 'fs/promises';
import DeepSeek from "openai";          // any OpenAI‑compatible SDK
import { pipeline } from "@xenova/transformers"; // ✅ 正确
import play from "play-dl";


dotenv.config();
const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());
app.use(express.json());  // 添加 JSON 解析中间件
app.use(express.static('.'));

const deepseek = new DeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1"
});



async function extractAudio(videoPath, outPath) {
  await new Promise((res, rej) => {
    spawn("ffmpeg", ["-y", "-i", videoPath, "-vn", "-ac", "1", "-ar", "16000", outPath])
      .on("close", code => code === 0 ? res() : rej(new Error("ffmpeg failed")));
  });
}

async function transcribe(filePath, language = 'zh') {
  // 使用medium模型来提高准确性
  const stt = await pipeline("automatic-speech-recognition", "Xenova/whisper-medium", {
    progress_callback: (progress) => {
      console.log(`Transcription progress: ${Math.round(progress * 100)}%`);
    }
  });

  const buffer = await readFile(filePath);
  const { sampleRate, channelData } = wav.decode(buffer);
  const float32Array = channelData[0];

  // 计算音频总长度（小时:分钟:秒）
  const audioLengthSeconds = float32Array.length / sampleRate;
  const hours = Math.floor(audioLengthSeconds / 3600);
  const minutes = Math.floor((audioLengthSeconds % 3600) / 60);
  const seconds = Math.floor(audioLengthSeconds % 60);
  console.log(`Processing audio file of length: ${hours}:${minutes}:${seconds}`);

  // 优化转录参数
  const result = await stt(float32Array, {
    sampling_rate: sampleRate,
    chunk_length_s: 30,           // 减小块大小以提高准确性
    stride_length_s: 5,           // 适当的重叠以保持连贯性
    return_timestamps: true,      // 启用时间戳以帮助后处理
    language: language,           // 使用指定的语言
    task: 'transcribe',           
    batch_size: 8,               
    max_new_tokens: 256,         // 增加token限制
    condition_on_previous_text: true,
    temperature: 0,              // 使用确定性输出
    compression_ratio_threshold: 2.4,
    no_repeat_ngram_size: 3,     // 防止短语重复
    repetition_penalty: 1.2      // 增加重复惩罚
  });

  // 后处理转录结果
  let processedText = '';
  if (result.chunks) {
    // 如果有分块结果，处理每个块
    processedText = result.chunks
      .map(chunk => chunk.text.trim())
      .filter(text => text.length > 0)  // 移除空块
      .join(' ')
      .replace(/\s+/g, ' ')            // 规范化空格
      .trim();
  } else {
    processedText = result.text.trim();
  }

  // 清理重复内容
  processedText = processedText
    .replace(/([^.!?]+)(\s+\1)+/g, '$1')  // 移除重复的句子
    .replace(/([\u4e00-\u9fa5]+)(\s*\1)+/g, '$1')  // 移除重复的中文内容
    .replace(/\s+/g, ' ')
    .trim();

  return processedText;
}

async function splitLongAudio(inputPath, maxDurationSeconds = 1800) {
  const outputDir = 'uploads/splits';
  await fs.mkdir(outputDir, { recursive: true });
  
  // 获取音频时长
  const probe = await new Promise((resolve, reject) => {
    spawn('ffprobe', [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_format',
      inputPath
    ])
    .stdout.on('data', data => resolve(JSON.parse(data).format))
    .on('error', reject);
  });
  
  const duration = parseFloat(probe.duration);
  const segments = Math.ceil(duration / maxDurationSeconds);
  const splits = [];

  for (let i = 0; i < segments; i++) {
    const start = i * maxDurationSeconds;
    const outputPath = `${outputDir}/split_${i}.wav`;
    
    await new Promise((resolve, reject) => {
      spawn('ffmpeg', [
        '-i', inputPath,
        '-ss', start.toString(),
        '-t', maxDurationSeconds.toString(),
        '-c', 'copy',
        outputPath
      ])
      .on('close', code => code === 0 ? resolve() : reject(new Error('Split failed')))
      .on('error', reject);
    });
    
    splits.push(outputPath);
  }
  
  return splits;
}

async function processLongAudio(audioPath, language = 'zh') {
  try {
    // 将长音频分割成30分钟的片段
    console.log('分割长音频文件...');
    const splits = await splitLongAudio(audioPath);
    console.log(`音频已分割成 ${splits.length} 个片段`);

    // 处理每个片段
    let fullTranscript = '';
    for (let i = 0; i < splits.length; i++) {
      console.log(`处理第 ${i + 1}/${splits.length} 个片段...`);
      const segmentTranscript = await transcribe(splits[i], language);
      fullTranscript += segmentTranscript + '\n';
      
      // 清理临时文件
      await fs.unlink(splits[i]);
    }

    // 清理分割目录
    await fs.rmdir('uploads/splits', { recursive: true });
    
    return fullTranscript.trim();
  } catch (error) {
    console.error('处理长音频时出错:', error);
    throw error;
  }
}

async function summarise(text, language = 'zh') {
  // 根据语言选择不同的提示词
  const prompts = {
    'en': `You are a professional content analyst. Please analyze and summarize the following content using this format:

**Brief Summary**
Summarize the main points in 200-500 words

**Detailed Analysis**
- **Opening Content**: Main content and background of the opening
- **Key Moments**: Important turning points and key scenes
- **Core Content**: Main topics and key viewpoints discussed
- **Conclusion**: Content conclusion and closing
- **Important Points**: Extract 3-5 most important points or insights

Please use markdown format and keep the structure clear. Output the content directly without any additional prefix notes.`,
    
    'zh': `你是一个专业的内容分析师。请对以下内容进行分析和总结，使用以下格式：

**简要总结**
用200-500字总结整体内容要点

**详细分析**
- **开场内容**：开场的主要内容和背景
- **关键时刻**：内容中的重要转折点和关键场景
- **核心内容**：主要讨论的话题和核心观点
- **结论部分**：内容的结论和收尾
- **重要观点**：提取3-5个最重要的观点或启示

请使用markdown格式，保持结构清晰。直接输出内容，不要添加任何额外的前缀说明。`,
    
    'zh-Hant': `你是一個專業的內容分析師。請對以下內容進行分析和總結，使用以下格式：

**簡要總結**
用200-500字總結整體內容要點

**詳細分析**
- **開場內容**：開場的主要內容和背景
- **關鍵時刻**：內容中的重要轉折點和關鍵場景
- **核心內容**：主要討論的話題和核心觀點
- **結論部分**：內容的結論和收尾
- **重要觀點**：提取3-5個最重要的觀點或啟示

請使用markdown格式，保持結構清晰。直接輸出內容，不要添加任何額外的前綴說明。`
  };

  const sys = { 
    role: "system", 
    content: prompts[language] || prompts['zh']  // 默认使用简体中文
  };
  const usr = { role: "user", content: text };
  const { choices } = await deepseek.chat.completions.create({
    model: "deepseek-chat",
    messages: [sys, usr],
    max_tokens: 1500,
    temperature: 0.3,
    presence_penalty: 0.6,
    frequency_penalty: 0.6
  });
  return choices[0].message.content;
}

app.post("/api/process", upload.single("media"), async (req, res) => {
  try {
    // 获取语言设置，默认为简体中文
    const language = req.body.language || 'zh';
    console.log(`使用语言: ${language}`);

    // 检查是否是直接从转录文本生成摘要的请求
    if (req.is('application/json') && req.body.mode === 'summary' && req.body.transcript) {
      console.log('从已有转录文本生成摘要...');
      const summary = await summarise(req.body.transcript, language);
      return res.json({ summary });
    }

    const { mode, videoUrl } = req.body;
    console.log('📺 videoUrl =', videoUrl);
    let audioPath = req.file?.path;

    if (!audioPath && videoUrl && videoUrl.startsWith("http")) {
      if (!(await play.validate(videoUrl))) {
        return res.status(400).json({ error: "Invalid or unsupported video URL." });
      }

      console.log('开始下载视频...');
      const ts = Date.now();
      const tmpPath = `uploads/${ts}.%(ext)s`;
      const outputFile = `uploads/${ts}.mp3`;

      await new Promise((res, rej) => {
        const ytdl = spawn("yt-dlp", [
          "-f", "bestaudio", 
          "-x", 
          "--audio-format", "mp3", 
          "--no-playlist",
          "--progress",
          "-o", tmpPath, 
          videoUrl
        ]);
        
        ytdl.stdout.on('data', (data) => {
          console.log(`下载进度: ${data}`);
        });
        
        ytdl.on("close", code => (code === 0 ? res() : rej(new Error("yt-dlp failed"))));
      });

      console.log('开始转换音频格式...');
      const wavPath = `uploads/${ts}.wav`;
      await extractAudio(outputFile, wavPath);
      await fs.unlink(outputFile);
      audioPath = wavPath;
    }

    if (!audioPath) {
      return res.status(400).json({ error: "No valid file or video URL provided." });
    }

    console.log('开始处理音频...');
    let transcript;
    
    // 获取音频时长
    const { stdout } = await new Promise((resolve, reject) => {
      const ffprobe = spawn('ffprobe', [
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        audioPath
      ]);
      let stdout = '';
      ffprobe.stdout.on('data', data => stdout += data);
      ffprobe.on('close', code => code === 0 ? resolve({ stdout }) : reject());
    });
    
    const duration = JSON.parse(stdout).format.duration;
    
    // 如果时长超过30分钟，使用分段处理
    if (duration > 1800) {
      console.log('检测到长音频，使用分段处理...');
      transcript = await processLongAudio(audioPath, language);
    } else {
      transcript = await transcribe(audioPath, language);
    }
    
    await fs.unlink(audioPath);

    // 如果只需要转录文本，直接返回
    if (mode === "transcript") {
      return res.json({ transcript });
    }

    console.log('开始生成摘要...');
    const summary = await summarise(transcript, language);
    return res.json({ transcript, summary });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

(async () => {
  // 设置 YouTube Cookie
  await play.setToken({
    youtube: {
      cookie: process.env.YOUTUBE_COOKIE
    }
  });

  app.listen(3000, () => console.log("✅ Service listening on :3000"));
})();
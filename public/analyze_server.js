import express           from 'express';
import fetch             from 'node-fetch';
import dotenv            from 'dotenv';
import multer            from 'multer';
import pdfParse          from 'pdf-parse/lib/pdf-parse.js';
import mammoth           from 'mammoth';
import fs                from 'fs';
import path              from 'path';
import { fileURLToPath } from 'url';

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
app.use(express.static(__dirname))

console.log('DeepSeek Key:', process.env.DEEPSEEK_API_KEY);

const upload = multer({
  dest: path.join(__dirname, 'uploads')
});


function buildPrompt(text) {
  return `请根据多重智能理论分析以下学生活动记录（香港/内地皆可）。
要求：
1. 识别属于七种智能的活动
  - Mathematical: Mathematical intelligence involves the ability to reason logically, solve problems, recognize patterns, and handle abstract concepts. Students strong in this area excel in numerical calculations, logical reasoning, and scientific inquiry. They enjoy puzzles, strategy games, and systematic approaches to problem-solving. In a Hong Kong context, these students often thrive in competitive academic environments and STEM-related activities. Identify activities or roles the student has participated in that involve logical reasoning, problem-solving, or mathematical analysis. Look for involvement in math competitions, STEM workshops, or clubs that emphasize strategic thinking or quantitative skills, such as those offered in Hong Kong’s academic or extracurricular programs.
  - Verbal: Verbal intelligence encompasses the ability to use language effectively, both in spoken and written forms. Students with this strength excel in reading, writing, storytelling, and public speaking. They enjoy debates, creative writing, and expressive performances. In Hong Kong, where bilingualism (English, Cantonese, Mandarin) is valued, these students often shine in language-based competitions and expressive arts. Look for activities or roles where the student demonstrates proficiency in language, communication, or storytelling. Consider participation in speech competitions, debate teams, or writing programs, particularly those prominent in Hong Kong’s school or community settings, that highlight verbal expression and linguistic creativity.
  - Spatial: Spatial intelligence involves the ability to visualize, manipulate, and interpret spatial patterns and visual information. Students with this strength excel in activities like drawing, design, navigation, and strategic visualization (e.g., chess). In Hong Kong, these students may gravitate toward arts, design workshops, or activities requiring visual planning. Identify activities or roles where the student engages with visual arts, design, or strategic spatial planning. Focus on participation in art competitions, design workshops, or games like chess that require visualizing patterns, especially those available in Hong Kong’s school or community programs. Identify activities or roles where the student demonstrates self-reflection, independence, or personal goal-setting. Focus on involvement in reflective writing, leadership workshops, or mentorship roles, particularly those offered in Hong Kong’s schools or gifted education programs, that highlight self-awareness and introspection.
  - Musical: Musical intelligence is the capacity to perceive, create, and appreciate music and rhythmic patterns. Students with this strength excel in playing instruments, singing, composing, or recognizing musical structures. In Hong Kong, where music education is prominent, these students often participate in festivals or school ensembles, showcasing their musical talents. Look for activities or roles where the student engages with music performance, composition, or rhythmic activities. Consider involvement in music competitions, school bands, or workshops, such as those offered through Hong Kong’s vibrant music education programs, that highlight musical talent and creativity. Look for activities or roles where the student collaborates with others, leads groups, or engages in social initiatives. Consider participation in student leadership, debate conferences, or community service programs in Hong Kong that demonstrate teamwork, empathy, and social skills.
  - Intrapersonal Intelligence: Intrapersonal intelligence involves self-awareness, self-reflection, and understanding one’s own emotions, goals, and motivations. Students strong in this area excel in independent work, self-directed projects, and activities requiring introspection. In Hong Kong, these students may engage in reflective or leadership roles that allow personal growth and self-regulation. Identify activities or roles where the student demonstrates self-reflection, independence, or personal goal-setting. Focus on involvement in reflective writing, leadership workshops, or mentorship roles, particularly those offered in Hong Kong’s schools or gifted education programs, that highlight self-awareness and introspection.
  - Interpersonal Intelligence: Interpersonal intelligence is the ability to understand and interact effectively with others, including teamwork, communication, and empathy. Students with this strength excel in group activities, leadership roles, and collaborative projects. In Hong Kong, these students often thrive in student councils, debates, or community service initiatives. Look for activities or roles where the student collaborates with others, leads groups, or engages in social initiatives. Consider participation in student leadership, debate conferences, or community service programs in Hong Kong that demonstrate teamwork, empathy, and social skills.
  - Naturalistic: Naturalistic intelligence involves the ability to recognize, categorize, and interact with the natural world, including plants, animals, and ecosystems. Students with this strength excel in environmental activities, observation of natural patterns, and sustainability projects. In Hong Kong, with its rich biodiversity (e.g., wetlands), these students may engage in conservation or eco-focused programs. Identify activities or roles where the student engages with the natural environment, conservation, or ecological studies. Focus on participation in environmental clubs, competitions, or volunteer programs in Hong Kong that highlight an understanding of nature and sustainability.
  - Kinesthetic: Kinesthetic intelligence involves the ability to use physical movement, coordination, and touch to express ideas or solve problems. Students with this strength excel in sports, dance, or activities requiring dexterity. In Hong Kong, where school sports and extracurricular academies are prominent, these students often participate in competitive athletics or physical arts. Look for activities or roles where the student demonstrates physical coordination, athleticism, or dexterity. Consider involvement in sports teams, competitions, or physical performance programs, such as those organized by Hong Kong’s school sports federations or academies, that highlight bodily-kinesthetic skills.
2. 按时间权重：≤2 年 +1；2–4 年 +0.5；≥5 年 +0.1；同类活动可倍增
3. 参与度加分：获奖/排名 +1；担任领导角色 +1；可叠加
4. 结果以 **严格 JSON** 返回

活动记录全文如下：
${text}`;
}

// ----/api/analyze 路由
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { path: filePath, mimetype } = req.file;
  let text = '';

  try {
    // 提取文本
    if (mimetype === 'application/pdf') {
      const buffer = fs.readFileSync(filePath);
      const data   = await pdfParse(buffer);
      text = data.text;
      console.log('📝 Extracted PDF text:', text);
    } 
    else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      const { value } = await mammoth.extractRawText({ path: filePath });
      text = value;
      console.log('📝 Extracted DOCX text:', text);
    } 
    else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }


    // 删除临时文件
    fs.unlinkSync(filePath);

    // 发送 DeepSeek 请求
    const prompt = buildPrompt(text);
    const apiRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model:      'deepseek-chat',
        messages: [
          { role: 'system', content: '你是多重智能分析专家。' },
          { role: 'user',   content: prompt }
        ],
        temperature: 0.7
      })
    });

    const apiBody = await apiRes.json();
    if (!apiRes.ok) {
      const msg = apiBody.error?.message || `DeepSeek Error: ${apiRes.status}`;
      throw new Error(msg);
    }

    // 解析 DeepSeek 返回的 JSON 字符串
    const content = apiBody.choices?.[0]?.message?.content ?? '';
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = { raw: content };
    }

    // 返回给前端
    res.json(result);

  } catch (err) {
    console.error('Analyze Error:', err);
    // 如有残留临时文件，也尝试删除
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(500).json({ error: err.message });
  }
});

// ========== /api/deepseek 路由（通用代理） ==========
app.post('/api/deepseek', async (req, res) => {
  const { model = 'deepseek-chat', messages } = req.body;
  try {
    const apiRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({ model, messages, temperature: 0.7 })
    });
    const body = await apiRes.json();
    if (!apiRes.ok) {
      const msg = body.error?.message || `DeepSeek Error: ${apiRes.status}`;
      return res.status(500).json({ error: msg });
    }
    res.json(body);
  } catch (err) {
    console.error('Proxy Error:', err);
    res.status(500).json({ error: 'DeepSeek request failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

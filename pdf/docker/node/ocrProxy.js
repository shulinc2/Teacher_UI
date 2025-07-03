import express from "express";
import NodeCache from "node-cache";        // 简单本地缓存

const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 });

router.post("/ocr", async (req, res) => {
  try {
    const { image } = req.body;
    const hit = cache.get(image.slice(0, 48));   // 以前几字节做 key
    if (hit) return res.json(hit);

    const pyRes = await fetch("http://fastapi:7860/ocr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ img_b64: image })
    });
    const data = await pyRes.json();
    cache.set(image.slice(0, 48), data);
    res.json(data); // 直接返回全部内容，包括 text, markdown, srr

  } catch (err) {
    console.error(err);
    res.status(500).json({ text: "", markdown: "", srr: "" });
  }
});

export default router;

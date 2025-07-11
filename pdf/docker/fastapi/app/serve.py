# docker/fastapi/app/serve.py

import io
import re
import base64
import threading
from fastapi import FastAPI, Body, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Globals for your OCR and caption models
ocr = None
processor = None
model = None
init_lock = threading.Lock()

def load_models_once():
    global ocr, processor, model
    with init_lock:
        if ocr is None:
            from magic_pdf.model.custom_model import MonkeyOCR
            # load MonkeyOCR (this may take a few seconds)
            ocr = MonkeyOCR(config_path="model_configs.yaml")
            # load BLIP
            processor = BlipProcessor.from_pretrained(
                "Salesforce/blip-image-captioning-base"
            )
            model = BlipForConditionalGeneration.from_pretrained(
                "Salesforce/blip-image-captioning-base"
            )

def should_fallback(text: str,
                    min_chars: int = 8,
                    ratio_threshold: float = 0.6) -> bool:
    meaningful = re.findall(r'[\u3400-\u4DBF\u4E00-\u9FFFA-Za-z0-9]', text)
    return len(meaningful) < min_chars or len(meaningful) / max(len(text), 1) < ratio_threshold

@app.get("/ping")
async def ping():
    return {"ok": True}

@app.post("/analyze")
async def analyze(img_b64: str = Body(..., embed=True)):
    # Ensure models are loaded (only once, thread-safe)
    try:
        load_models_once()
    except Exception as e:
        raise HTTPException(500, f"模型加载失败: {e}")

    # Decode image
    data = base64.b64decode(img_b64.split(",")[-1])
    img = Image.open(io.BytesIO(data)).convert("RGB")

    # 官方推荐方式
    instruction = "Please output the text content from the image."
    text = ocr.chat_model.batch_inference([img], [instruction])[0].strip()

    # 2) decide fallback
    if len(text) < 20 or should_fallback(text):
        inputs = processor(images=img, return_tensors="pt").to(model.device)
        out_ids = model.generate(**inputs)
        text = processor.decode(out_ids[0], skip_special_tokens=True)

    return {"text": text}

@app.post("/parse_structured")
async def parse_structured(file: UploadFile = File(...)):
    try:
        load_models_once()
    except Exception as e:
        raise HTTPException(500, f"模型加载失败: {e}")

    # 保存上传文件到临时目录
    temp_path = f"/tmp/{file.filename}"
    with open(temp_path, "wb") as f_out:
        f_out.write(await file.read())
    # 调用结构化解析
    from pdf.MonkeyOCR.parse import parse_file
    output_dir = "/tmp/parse_result"
    os.makedirs(output_dir, exist_ok=True)
    result_dir = parse_file(temp_path, output_dir, ocr, split_pages=False)
    # 查找 markdown 文件
    md_file = None
    for fname in os.listdir(result_dir):
        if fname.endswith(".md"):
            md_file = os.path.join(result_dir, fname)
            break
    if not md_file:
        raise HTTPException(500, "未生成结构化 markdown 文件")
    with open(md_file, "r", encoding="utf-8") as f:
        markdown = f.read()
    return {"markdown": markdown}

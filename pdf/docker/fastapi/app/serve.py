# docker/fastapi/app/serve.py

import io
import re
import base64
import threading
from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

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

    # 1) run MonkeyOCR
    text = ocr.ocr(img).strip()
    # 2) decide fallback
    if len(text) < 20 or should_fallback(text):
        inputs = processor(images=img, return_tensors="pt").to(model.device)
        out_ids = model.generate(**inputs)
        text = processor.decode(out_ids[0], skip_special_tokens=True)

    return {"text": text}

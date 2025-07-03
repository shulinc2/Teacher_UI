FROM python:3.10-slim

# 系统依赖
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      git \
      libgl1-mesa-glx \
      libglib2.0-0 \
      libsm6 \
      libxext6 \
      libxrender1 \
 && rm -rf /var/lib/apt/lists/*

# 升级 pip/setuptools
RUN pip install --no-cache-dir --upgrade pip setuptools

# 安装 PyTorch CPU
RUN pip install --no-cache-dir \
      torch==2.6.0 \
      --index-url https://download.pytorch.org/whl/cpu

#安装 MonkeyOCR
RUN git clone --depth 1 https://github.com/Yuliang-Liu/MonkeyOCR.git /opt/MonkeyOCR \
 && pip install --no-cache-dir /opt/MonkeyOCR \
 && pip install --no-cache-dir huggingface_hub accelerate


WORKDIR /app
COPY model_configs.yaml /app/
COPY app/             /app

CMD ["uvicorn", "serve:app", "--host", "0.0.0.0", "--port", "7860"]

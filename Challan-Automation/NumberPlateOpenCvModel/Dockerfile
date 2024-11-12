FROM python:3.8-slim

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install -y \
    libsm6 \
    libxext6 \
    libxrender-dev

RUN apt-get install -y tesseract-ocr

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8


CMD ["python", "numberplateDetection.py"]
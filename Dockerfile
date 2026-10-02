# Облачный запуск Telegram-ассистента (tg_agent).
# Данные и сессия Telegram хранятся в /data — подключите туда постоянный диск хостинга.
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    TG_AGENT_DATA=/data

WORKDIR /app
RUN pip install --no-cache-dir "anthropic>=0.80" "telethon>=1.36" "qrcode>=7.4"
COPY kwork_agent/ kwork_agent/
COPY tg_agent/ tg_agent/

VOLUME /data
CMD ["python", "-m", "tg_agent", "run"]

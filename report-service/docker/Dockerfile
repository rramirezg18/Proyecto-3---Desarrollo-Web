FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1     PYTHONUNBUFFERED=1     PIP_NO_CACHE_DIR=1

WORKDIR /app

# Dependencias del sistema mínimas (si llegas a necesitar fuentes o locales, agrégalas aquí)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Instala dependencias Python
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

# Copia únicamente config por ahora (sin lógica de app)
COPY .env.example /app/.env.example

# Crea usuario no-root
RUN useradd -u 10001 -ms /bin/bash appuser
USER appuser

EXPOSE 8080

# Placeholder: cuando tengas app, cambia el CMD a uvicorn app.main:app ...
CMD ["python", "-c", "print('Entorno listo. Agrega tu app y arranca uvicorn.')"]

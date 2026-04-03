# VIK (Virtualny Inteligentny Kolega) — PRD

## Status: v3.0 — Backend Integration Complete

## Zmiany w v3.0:
- Backend FastAPI połączony z Ollama API (dynamiczna lista modeli)
- Metryki systemowe w czasie rzeczywistym (CPU/RAM via psutil, GPU via nvidia-smi)
- Dynamiczny wybór modelu z listy dostępnych w Ollama
- Chat wysyła zapytania do prawdziwego modelu LLM
- Usunięto hardkodowane nazwy modeli
- Dodano README.md, docker-compose.yml, .env.example
- Polling metryk co 10 sekund, modeli co 60 sekund

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import json
import subprocess
import platform
import time
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import psutil
import httpx
from collections import deque

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'vik_database')]

# Ollama configuration
OLLAMA_URL = os.environ.get('OLLAMA_URL', 'http://localhost:11434')

# Metrics history storage (in-memory ring buffer)
MAX_HISTORY = 60
gpu_history = deque(maxlen=MAX_HISTORY)
cpu_history = deque(maxlen=MAX_HISTORY)
start_time = time.time()

app = FastAPI(title="VIK Backend", version="3.0")
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ========== Models ==========
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: str
    messages: List[ChatMessage]
    num_ctx: Optional[int] = 8192
    temperature: Optional[float] = 0.7

class ChatResponse(BaseModel):
    role: str = "assistant"
    content: str
    model: str
    total_duration: Optional[int] = None
    eval_count: Optional[int] = None

# ========== Helper Functions ==========

def get_gpu_info() -> Dict[str, Any]:
    """Pobiera informacje o GPU przez nvidia-smi."""
    try:
        result = subprocess.run(
            ['nvidia-smi', '--query-gpu=name,memory.total,memory.used,temperature.gpu,utilization.gpu,power.draw,power.limit',
             '--format=csv,noheader,nounits'],
            capture_output=True, text=True, timeout=5
        )
        if result.returncode == 0 and result.stdout.strip():
            parts = [p.strip() for p in result.stdout.strip().split(',')]
            return {
                'name': parts[0],
                'vramTotal': int(float(parts[1])),
                'vramUsed': int(float(parts[2])),
                'temperature': int(float(parts[3])),
                'utilization': int(float(parts[4])),
                'powerDraw': int(float(parts[5])) if parts[5] != '[N/A]' else 0,
                'powerLimit': int(float(parts[6])) if parts[6] != '[N/A]' else 0,
                'available': True,
            }
    except (FileNotFoundError, subprocess.TimeoutExpired, Exception) as e:
        logger.debug(f"nvidia-smi niedostępne: {e}")
    return {
        'name': 'Brak GPU / nvidia-smi niedostępne',
        'vramTotal': 0, 'vramUsed': 0, 'temperature': 0,
        'utilization': 0, 'powerDraw': 0, 'powerLimit': 0,
        'available': False,
    }

def get_cpu_info() -> Dict[str, Any]:
    """Pobiera informacje o CPU przez psutil."""
    try:
        freq = psutil.cpu_freq()
        temps = []
        try:
            sensor_temps = psutil.sensors_temperatures()
            for name, entries in sensor_temps.items():
                for entry in entries:
                    if entry.current > 0:
                        temps.append(entry.current)
        except (AttributeError, Exception):
            pass
        
        return {
            'name': platform.processor() or f"{psutil.cpu_count(logical=False)} rdzeni CPU",
            'cores': psutil.cpu_count(logical=False) or 1,
            'threads': psutil.cpu_count(logical=True) or 1,
            'utilization': psutil.cpu_percent(interval=0.5),
            'temperature': round(sum(temps) / len(temps), 1) if temps else 0,
            'frequency': round(freq.current / 1000, 2) if freq else 0,
        }
    except Exception as e:
        logger.error(f"Błąd odczytu CPU: {e}")
        return {'name': 'Nieznany', 'cores': 1, 'threads': 1, 'utilization': 0, 'temperature': 0, 'frequency': 0}

def get_ram_info() -> Dict[str, Any]:
    """Pobiera informacje o RAM przez psutil."""
    try:
        mem = psutil.virtual_memory()
        return {
            'total': int(mem.total / (1024 * 1024)),  # MB
            'used': int(mem.used / (1024 * 1024)),
            'cached': int(getattr(mem, 'cached', 0) / (1024 * 1024)),
        }
    except Exception as e:
        logger.error(f"Błąd odczytu RAM: {e}")
        return {'total': 0, 'used': 0, 'cached': 0}

def get_uptime_str() -> str:
    """Zwraca uptime systemu."""
    try:
        uptime_sec = time.time() - psutil.boot_time()
        days = int(uptime_sec // 86400)
        hours = int((uptime_sec % 86400) // 3600)
        minutes = int((uptime_sec % 3600) // 60)
        return f"{days}d {hours}h {minutes}m"
    except Exception:
        return "N/A"

# ========== API Routes ==========

@api_router.get("/")
async def root():
    return {"message": "VIK Backend v3.0", "status": "online"}

@api_router.get("/health")
async def health_check():
    """Sprawdza stan backendu i połączenie z Ollama."""
    ollama_ok = False
    ollama_models_count = 0
    try:
        async with httpx.AsyncClient(timeout=5.0) as client_http:
            resp = await client_http.get(f"{OLLAMA_URL}/api/tags")
            if resp.status_code == 200:
                ollama_ok = True
                data = resp.json()
                ollama_models_count = len(data.get('models', []))
    except Exception:
        pass
    
    return {
        "backend": "online",
        "ollama": "connected" if ollama_ok else "disconnected",
        "ollama_url": OLLAMA_URL,
        "ollama_models": ollama_models_count,
        "uptime": get_uptime_str(),
    }

# ---------- Ollama ----------

@api_router.get("/ollama/models")
async def get_ollama_models():
    """Pobiera listę dostępnych modeli z lokalnego serwera Ollama."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client_http:
            resp = await client_http.get(f"{OLLAMA_URL}/api/tags")
            resp.raise_for_status()
            data = resp.json()
            models = []
            for m in data.get('models', []):
                size_bytes = m.get('size', 0)
                size_gb = round(size_bytes / (1024**3), 1)
                models.append({
                    'name': m.get('name', ''),
                    'size': f"{size_gb} GB" if size_gb >= 1 else f"{round(size_bytes / (1024**2))} MB",
                    'size_bytes': size_bytes,
                    'family': m.get('details', {}).get('family', ''),
                    'params': m.get('details', {}).get('parameter_size', ''),
                    'quantization': m.get('details', {}).get('quantization_level', ''),
                    'format': m.get('details', {}).get('format', ''),
                    'modified_at': m.get('modified_at', ''),
                })
            return {"models": models, "count": len(models)}
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Nie można połączyć z serwerem Ollama. Upewnij się, że Ollama jest uruchomiona.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd pobierania modeli: {str(e)}")

@api_router.post("/ollama/chat", response_model=ChatResponse)
async def chat_with_ollama(request: ChatRequest):
    """Wysyła wiadomość do modelu Ollama i zwraca odpowiedź."""
    try:
        payload = {
            "model": request.model,
            "messages": [m.model_dump() for m in request.messages],
            "stream": False,
            "options": {
                "num_ctx": request.num_ctx,
                "temperature": request.temperature,
            }
        }
        async with httpx.AsyncClient(timeout=300.0) as client_http:
            resp = await client_http.post(f"{OLLAMA_URL}/api/chat", json=payload)
            resp.raise_for_status()
            data = resp.json()
            return ChatResponse(
                content=data.get('message', {}).get('content', 'Brak odpowiedzi od modelu.'),
                model=request.model,
                total_duration=data.get('total_duration'),
                eval_count=data.get('eval_count'),
            )
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Nie można połączyć z Ollama. Sprawdź czy serwer działa.")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Błąd Ollama: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd chatu: {str(e)}")

# ---------- System Metrics ----------

@api_router.get("/system/metrics")
async def get_system_metrics():
    """Pobiera aktualne metryki systemowe (CPU, RAM, GPU) w czasie rzeczywistym."""
    gpu = get_gpu_info()
    cpu = get_cpu_info()
    ram = get_ram_info()
    
    # Dodaj do historii
    now = datetime.now().strftime('%H:%M')
    gpu_history.append({'time': now, 'vram': gpu['vramUsed'], 'util': gpu['utilization'], 'temp': gpu['temperature']})
    cpu_history.append({'time': now, 'usage': cpu['utilization'], 'temp': cpu['temperature']})
    
    return {
        'gpu': gpu,
        'cpu': cpu,
        'ram': ram,
        'uptime': get_uptime_str(),
        'hostname': platform.node(),
        'os': f"{platform.system()} {platform.release()}",
    }

@api_router.get("/system/metrics/history")
async def get_metrics_history():
    """Zwraca historię metryk do wykresów."""
    return {
        'gpu': list(gpu_history),
        'cpu': list(cpu_history),
    }

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

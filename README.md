# VIK — Virtualny Inteligentny Kolega

> Lokalny asystent AI inspirowany architekturą JARVIS. Dashboard do zarządzania modelami LLM, monitorowania systemu i prowadzenia rozmow z AI — całkowicie lokalnie, bez chmury.

---

## Spis treści

1. [Czym jest VIK?](#czym-jest-vik)
2. [Wymagania systemowe](#wymagania-systemowe)
3. [Instalacja krok po kroku](#instalacja-krok-po-kroku)
4. [Uruchamianie projektu](#uruchamianie-projektu)
5. [Jak połączyć z prawdziwymi modelami Ollama](#jak-połączyć-z-prawdziwymi-modelami-ollama)
6. [Struktura projektu](#struktura-projektu)
7. [Opis stron aplikacji](#opis-stron-aplikacji)
8. [Konfiguracja](#konfiguracja)
9. [Docker Compose — bazy danych](#docker-compose--bazy-danych)
10. [Rozwiązywanie problemów](#rozwiazywanie-problemow)
11. [Architektura techniczna](#architektura-techniczna)

---

## Czym jest VIK?

VIK to **lokalny asystent AI** z graficznym dashboardem webowym. Główne funkcje:

- **Chat z modelami AI** — rozmowa z dowolnym modelem zainstalowanym w Ollama (np. Llama, Mistral, Bielik, DeepSeek, Gemma itp.)
- **Monitor systemu w czasie rzeczywistym** — CPU, RAM, GPU (jeśli masz kartę NVIDIA) — dane odświeżane co 10 sekund
- **Dynamiczny wybór modelu** — lista modeli pobierana automatycznie z Twojego lokalnego serwera Ollama
- **Zarządzanie serwerami MCP** — przegląd mikrousług (planowane)
- **Piaskownica narzędzi** — generowanie nowych narzędzi AI (planowane)
- **Przeglądarka logów** — filtrowanie i przeszukiwanie zdarzeń systemowych
- **Ustawienia** — konfiguracja modeli, mowy, bezpieczeństwa

---

## Wymagania systemowe

### Minimum:
- **System**: Linux, macOS lub Windows (z WSL2)
- **Python**: 3.10 lub nowszy
- **Node.js**: 18.x lub 20.x
- **Yarn**: 1.22+ (menedzer pakietow)
- **Ollama**: zainstalowana i uruchomiona (https://ollama.com)

### Opcjonalnie:
- **Karta NVIDIA z nvidia-smi** — do monitorowania GPU (bez niej dashboard pokaze "Brak GPU")
- **Docker + Docker Compose** — do baz danych (PostgreSQL, Qdrant, Redis)

---

## Instalacja krok po kroku

### Krok 1 — Zainstaluj Ollama

Ollama to serwer do uruchamiania modeli AI lokalnie.

```bash
# Linux / macOS:
curl -fsSL https://ollama.com/install.sh | sh

# Windows: pobierz instalator z https://ollama.com/download
```

Sprawdz czy dziala:
```bash
ollama --version
```

### Krok 2 — Pobierz jakikolwiek model

```bash
# Przyklady modeli (wybierz jeden lub wiecej):
ollama pull llama3.2:3b          # Mały, szybki (2 GB)
ollama pull mistral:7b            # Średni, dobry do rozmów (4 GB)
ollama pull gemma2:9b             # Google Gemma 9B (5.4 GB)
ollama pull deepseek-r1:14b       # Reasoning (8.9 GB)
ollama pull bielik:11b            # Polski model Bielik (6.7 GB)

# Sprawdz zainstalowane modele:
ollama list
```

### Krok 3 — Zainstaluj Node.js i Yarn

```bash
# Sprawdz czy masz Node.js:
node -v
# Jesli nie, zainstaluj: https://nodejs.org

# Zainstaluj Yarn:
npm install -g yarn
yarn -v
```

### Krok 4 — Zainstaluj Python 3.10+

```bash
python3 --version
# Jesli nie masz: https://python.org/downloads
```

### Krok 5 — Sklonuj repozytorium (jesli jeszcze nie masz)

```bash
git clone <adres-repozytorium> vik
cd vik
```

### Krok 6 — Zainstaluj backend

```bash
cd backend

# Utworz srodowisko wirtualne:
python3 -m venv venv

# Aktywuj je:
# Linux / macOS:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# Zainstaluj zaleznosci:
pip install -r requirements.txt
```

### Krok 7 — Skonfiguruj backend

Utworz plik `.env` w katalogu `backend/`:

```bash
cat > .env << 'EOF'
MONGO_URL="mongodb://localhost:27017"
DB_NAME="vik_database"
CORS_ORIGINS="*"
OLLAMA_URL="http://localhost:11434"
EOF
```

> **UWAGA**: Jesli Ollama dziala na innym komputerze w sieci, zmien `OLLAMA_URL` na jego adres IP, np. `http://192.168.1.100:11434`

### Krok 8 — Zainstaluj frontend

```bash
cd ../frontend

# Utworz plik .env:
cat > .env << 'EOF'
REACT_APP_BACKEND_URL=http://localhost:8001
EOF

# Zainstaluj zaleznosci:
yarn install
```

> Instalacja moze potrwac 1-3 minuty.

---

## Uruchamianie projektu

Musisz uruchomić **3 rzeczy** (kazdej w osobnym terminalu):

### Terminal 1 — Ollama

```bash
ollama serve
```
> Jesli Ollama juz dziala w tle (np. po instalacji), ten krok mozesz pominac.

### Terminal 2 — Backend (FastAPI)

```bash
cd backend
source venv/bin/activate   # Linux/macOS
# venv\Scripts\activate    # Windows

uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Zobaczysz:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
```

### Terminal 3 — Frontend (React)

```bash
cd frontend
yarn start
```

Zobaczysz:
```
Compiled successfully!
Local:    http://localhost:3000
```

### Otworz przegladarke:

**http://localhost:3000**

Jesli wszystko dziala poprawnie, w prawym gornym rogu zobaczysz:
- **Ollama Online** (zielony)
- Nazwe aktywnego modelu

---

## Jak połączyć z prawdziwymi modelami Ollama

### Dashboard automatycznie:
1. Łączy się z backendem VIK (`http://localhost:8001`)
2. Backend łączy się z Ollama (`http://localhost:11434`)
3. Pobiera listę zainstalowanych modeli
4. Wyświetla je w selektorze na stronie **Chat** i **Ustawienia**
5. Wysyła wiadomości do wybranego modelu i wyświetla odpowiedzi

### Jeśli modele się nie wyświetlają:
1. Sprawdz czy Ollama działa: `curl http://localhost:11434/api/tags`
2. Sprawdz czy masz pobrane modele: `ollama list`
3. Sprawdz czy backend działa: `curl http://localhost:8001/api/health`

### Dodawanie nowych modeli:
```bash
# Pobierz nowy model:
ollama pull phi3:mini

# Model pojawi się automatycznie w dashboardzie
# (odswiezanie listy co 60 sekund lub po odswiezeniu strony)
```

---

## Struktura projektu

```
vik/
├── backend/                    # Serwer API (Python FastAPI)
│   ├── server.py              # Główny plik serwera
│   ├── requirements.txt       # Zaleznosci Python
│   └── .env                   # Konfiguracja (OLLAMA_URL, MONGO_URL)
├── frontend/                   # Interfejs webowy (React)
│   ├── src/
│   │   ├── pages/             # Strony aplikacji (7 stron)
│   │   ├── components/        # Komponenty UI
│   │   ├── lib/               # API, dane, kontekst
│   │   └── index.css          # System design tokenów
│   ├── package.json           # Zaleznosci JS
│   └── .env                   # URL backendu
├── docker-compose.yml          # Bazy danych (opcjonalnie)
└── README.md                   # Ten plik
```

---

## Opis stron aplikacji

| Strona | URL | Co robi |
|--------|-----|--------|
| **Dashboard** | `/` | Przegląd systemu: metryki CPU/RAM/GPU w czasie rzeczywistym, status Ollama, lista modeli, statusy serwisów MCP |
| **Chat** | `/chat` | Rozmowa z wybranyn modelem AI. Selektor modelu, historia konwersacji, kopiowanie odpowiedzi |
| **System** | `/system` | Szczegółowy monitor: zakładki GPU/CPU/RAM/Docker z wykresami, lista kontenerów |
| **MCP Serwery** | `/mcp` | Zarządzanie mikrousługami: restart, stop/start, statystyki |
| **Narzędzia** | `/tools` | Piaskownica: generowanie nowych narzędzi AI, testy, statusy |
| **Logi** | `/logs` | Przeglądarka logów z filtrowaniem po poziomie i wyszukiwaniem |
| **Ustawienia** | `/settings` | Konfiguracja: wybór modelu, num_ctx, mowa STT/TTS, sandbox, bazy danych |

---

## Konfiguracja

### Backend `.env`

```env
MONGO_URL="mongodb://localhost:27017"   # Adres MongoDB (opcjonalnie)
DB_NAME="vik_database"                    # Nazwa bazy danych
CORS_ORIGINS="*"                          # Dozwolone originy
OLLAMA_URL="http://localhost:11434"       # Adres serwera Ollama
```

### Frontend `.env`

```env
REACT_APP_BACKEND_URL=http://localhost:8001   # Adres backendu VIK
```

---

## Docker Compose — bazy danych

Jeśli chcesz uruchomić pełną infrastrukturę baz danych:

```bash
docker-compose up -d
```

Uruchomi to:
- **PostgreSQL** (port 5432) — dane relacyjne
- **Qdrant** (port 6333) — pamięć wektorowa RAG
- **Redis** (port 6379) — cache i kolejki Celery

> **UWAGA**: Bazy danych są opcjonalne. Dashboard i chat działają bez nich.

---

## Rozwiazywanie problemow

### "Ollama Offline" w dashboardzie

```bash
# 1. Sprawdz czy Ollama dziala:
ollama list
# Jesli blad — uruchom:
ollama serve

# 2. Sprawdz polaczenie:
curl http://localhost:11434/api/tags
# Powinno zwrocic JSON z lista modeli

# 3. Sprawdz czy backend widzi Ollama:
curl http://localhost:8001/api/health
```

### Backend nie startuje

```bash
# Sprawdz czy srodowisko wirtualne jest aktywne:
which python3
# Powinno wskazywac na venv/bin/python3

# Sprawdz brakujace pakiety:
pip install -r requirements.txt

# Uruchom ponownie:
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend nie startuje

```bash
# Upewnij sie ze jestes w katalogu frontend/
cd frontend

# Usun @emergentbase/visual-edits jesli jest blad:
yarn remove @emergentbase/visual-edits 2>/dev/null

# Przeinstaluj:
rm -rf node_modules
yarn install
yarn start
```

### Brak GPU w monitorze

To normalne jesli nie masz karty NVIDIA lub nie masz zainstalowanych sterownikow.
Dashboard pokaze "Brak GPU" i bedzie monitorowac tylko CPU i RAM.

Dla kart NVIDIA zainstaluj sterowniki:
```bash
# Ubuntu:
sudo apt install nvidia-driver-550-server
sudo apt install nvidia-cuda-toolkit
# Zrestartuj komputer
```

---

## Architektura techniczna

```
+------------------+     +-------------------+     +------------------+
|    Frontend      | --> |    Backend        | --> |    Ollama         |
|  React + Vite    |     |  FastAPI (Python) |     |  (LLM Runtime)   |
|  port 3000       |     |  port 8001        |     |  port 11434      |
+------------------+     +-------------------+     +------------------+
                              |
                    +---------+---------+
                    |         |         |
                 psutil   nvidia-smi  httpx
                 (CPU/RAM) (GPU)     (Ollama API)
```

### Endpointy API backendu:

| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/api/health` | GET | Status backendu i połączenia z Ollama |
| `/api/ollama/models` | GET | Lista dostepnych modeli z Ollama |
| `/api/ollama/chat` | POST | Wyslanie wiadomosci do modelu |
| `/api/system/metrics` | GET | Aktualne metryki CPU/RAM/GPU |
| `/api/system/metrics/history` | GET | Historia metryk (do wykresow) |

---

## Licencja

Projekt open-source. Używaj i modyfikuj według potrzeb.

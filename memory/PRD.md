# VIK (Virtualny Inteligentny Kolega) — Frontend Prototype

## Overview
JARVIS-inspired AI assistant dashboard for local DevOps/AI operations. Dark theme with cyan/teal accents, glassmorphism cards, and futuristic aesthetics.

## Architecture
- **Frontend Only Prototype** — all data is MOCKED (no backend integration)
- React + Tailwind CSS + shadcn/ui + Framer Motion + Recharts
- 7 pages with sidebar navigation layout

## Pages
1. **Dashboard** — Overview with system metrics, GPU telemetry charts, MCP service status, Ollama models, voice module, recent logs
2. **Chat** — Full conversation interface with VIK (simulated Bielik-11B responses, tool badges, copy-to-clipboard)
3. **System Monitor** — Tabbed view (GPU/CPU/RAM/Docker) with Recharts graphs and Docker container list
4. **MCP Servers** — 8 microservice cards with restart/stop actions and toast notifications
5. **Tools Sandbox** — Dynamic tool generation via dialog (simulated DeepSeek-R1-14B), tool cards with test status
6. **Logs** — Searchable/filterable system log viewer with level badges
7. **Settings** — LLM configuration (model selection, num_ctx slider), voice module toggles, security settings, database hosts

## Design Tokens
- Primary: 185 78% 42% (Cyan/Teal)
- Background: 222 30% 4% (Deep navy-black)
- Fonts: Space Grotesk (headings), Fira Sans (body), IBM Plex Mono (data)
- All styling via HSL CSS custom properties

## Status: MVP Complete ✅

import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

const apiClient = axios.create({
  baseURL: API,
  timeout: 300000,
  headers: { 'Content-Type': 'application/json' },
});

// ========== Ollama ==========

export async function fetchOllamaModels() {
  try {
    const resp = await apiClient.get('/ollama/models');
    return resp.data;
  } catch (err) {
    console.warn('Nie można pobrać modeli Ollama:', err.message);
    return { models: [], count: 0 };
  }
}

export async function sendChatMessage({ model, messages, numCtx = 8192, temperature = 0.7 }) {
  const resp = await apiClient.post('/ollama/chat', {
    model,
    messages,
    num_ctx: numCtx,
    temperature,
  });
  return resp.data;
}

// ========== System ==========

export async function fetchSystemMetrics() {
  try {
    const resp = await apiClient.get('/system/metrics');
    return resp.data;
  } catch (err) {
    console.warn('Nie można pobrać metryk systemowych:', err.message);
    return null;
  }
}

export async function fetchMetricsHistory() {
  try {
    const resp = await apiClient.get('/system/metrics/history');
    return resp.data;
  } catch (err) {
    console.warn('Nie można pobrać historii metryk:', err.message);
    return { gpu: [], cpu: [] };
  }
}

// ========== Health ==========

export async function fetchHealth() {
  try {
    const resp = await apiClient.get('/health');
    return resp.data;
  } catch (err) {
    return { backend: 'offline', ollama: 'disconnected', ollama_models: 0 };
  }
}

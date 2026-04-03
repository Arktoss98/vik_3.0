import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchHealth, fetchOllamaModels, fetchSystemMetrics } from '@/lib/api';

const VikContext = createContext(null);

export function VikProvider({ children }) {
  const [health, setHealth] = useState({ backend: 'checking', ollama: 'checking', ollama_models: 0 });
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [systemMetrics, setSystemMetrics] = useState(null);

  const refreshHealth = useCallback(async () => {
    const h = await fetchHealth();
    setHealth(h);
  }, []);

  const refreshModels = useCallback(async () => {
    const data = await fetchOllamaModels();
    setModels(data.models || []);
    if (data.models?.length > 0 && !selectedModel) {
      setSelectedModel(data.models[0].name);
    }
  }, [selectedModel]);

  const refreshMetrics = useCallback(async () => {
    const m = await fetchSystemMetrics();
    if (m) setSystemMetrics(m);
  }, []);

  // Initial load
  useEffect(() => {
    refreshHealth();
    refreshModels();
    refreshMetrics();
  }, []);

  // Polling co 10 sekund
  useEffect(() => {
    const interval = setInterval(() => {
      refreshHealth();
      refreshMetrics();
    }, 10000);
    return () => clearInterval(interval);
  }, [refreshHealth, refreshMetrics]);

  // Odśwież modele co 60 sekund
  useEffect(() => {
    const interval = setInterval(refreshModels, 60000);
    return () => clearInterval(interval);
  }, [refreshModels]);

  const value = {
    health,
    models,
    selectedModel,
    setSelectedModel,
    systemMetrics,
    refreshHealth,
    refreshModels,
    refreshMetrics,
  };

  return <VikContext.Provider value={value}>{children}</VikContext.Provider>;
}

export function useVik() {
  const ctx = useContext(VikContext);
  if (!ctx) throw new Error('useVik must be used within VikProvider');
  return ctx;
}

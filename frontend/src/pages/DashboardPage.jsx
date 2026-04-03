import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MetricCard } from "@/components/shared/MetricCard";
import { MiniChart } from "@/components/shared/MiniChart";
import { StatusDot } from "@/components/shared/StatusDot";
import { VoiceWaveform } from "@/components/shared/VoiceWaveform";
import { useVik } from "@/lib/vikContext";
import {
  systemMetricsFallback,
  mcpServers,
} from "@/lib/mockData";
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Thermometer,
  Zap,
  Activity,
  Server,
  MessageSquare,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { systemMetrics: liveMetrics, models, health } = useVik();

  const systemMetrics = liveMetrics || systemMetricsFallback;
  const gpuHistory = [];

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const vramPercent = Math.round((systemMetrics.gpu.vramUsed / systemMetrics.gpu.vramTotal) * 100);
  const ramPercent = Math.round((systemMetrics.ram.used / systemMetrics.ram.total) * 100);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Hero Header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl p-6 md:p-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-primary/3 blur-3xl" />
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 animate-vik-glow-pulse">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                Witaj w <span className="vik-gradient-text">VIK</span>
              </h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-lg">
              Virtualny Inteligentny Kolega — Twój lokalny asystent AI oparty na architekturze MCP.
              Wszystkie systemy działają poprawnie.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-2xl font-bold text-foreground tabular-nums">
              {currentTime.toLocaleTimeString('pl-PL')}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {currentTime.toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <Badge variant="outline" className="mt-1 border-success/30 text-success bg-success/5 font-mono text-[10px] gap-1">
              <StatusDot status="running" size="xs" />
              Uptime: {systemMetrics.uptime}
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Quick Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={HardDrive}
          label="GPU VRAM"
          value={`${(systemMetrics.gpu.vramUsed / 1024).toFixed(1)}`}
          unit={`/ ${(systemMetrics.gpu.vramTotal / 1024).toFixed(0)} GB`}
          subtext={`${vramPercent}% wykorzystane`}
          trend={-2.5}
        />
        <MetricCard
          icon={Cpu}
          label="CPU"
          value={`${systemMetrics.cpu.utilization}`}
          unit="%"
          subtext={`${systemMetrics.cpu.cores} rdzeni / ${systemMetrics.cpu.threads} wątków`}
          trend={5.2}
        />
        <MetricCard
          icon={MemoryStick}
          label="RAM"
          value={`${(systemMetrics.ram.used / 1024).toFixed(0)}`}
          unit={`/ ${(systemMetrics.ram.total / 1024).toFixed(0)} GB`}
          subtext={`${ramPercent}% wykorzystane`}
          trend={-1.8}
        />
        <MetricCard
          icon={Thermometer}
          label="GPU Temp"
          value={`${systemMetrics.gpu.temperature}`}
          unit="°C"
          subtext={`${systemMetrics.gpu.utilization}% obciążenie`}
          trend={3.1}
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* GPU History */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-heading">GPU Telemetria</CardTitle>
                  <CardDescription className="text-xs">{systemMetrics.gpu.name}</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] border-primary/30 text-primary">
                  LIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">VRAM Usage</span>
                    <span className="text-xs font-mono text-foreground">{(systemMetrics.gpu.vramUsed / 1024).toFixed(1)} / {(systemMetrics.gpu.vramTotal / 1024).toFixed(0)} GB</span>
                  </div>
                  <Progress value={vramPercent} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Power Draw</span>
                    <span className="text-xs font-mono text-foreground">{systemMetrics.gpu.powerDraw}W / {systemMetrics.gpu.powerLimit}W</span>
                  </div>
                  <Progress value={(systemMetrics.gpu.powerDraw / systemMetrics.gpu.powerLimit) * 100} className="h-2" />
                </div>
                <MiniChart data={gpuHistory} dataKey="vram" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* MCP Servers Status */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-heading">Serwisy MCP</CardTitle>
                <Link to="/mcp">
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                    Więcej <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ScrollArea className="h-[240px]">
                <div className="space-y-2">
                  {mcpServers.slice(0, 6).map((server) => (
                    <div
                      key={server.id}
                      className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <StatusDot status={server.status} size="sm" />
                        <div>
                          <span className="text-xs font-medium text-foreground">{server.name}</span>
                          <span className="block text-[10px] font-mono text-muted-foreground">
                            {server.language}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[9px] font-mono capitalize border-border/50"
                      >
                        {server.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Models */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading">Modele Ollama</CardTitle>
              <CardDescription className="text-xs">Załadowane modele GGUF</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                {models.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Uruchom Ollama i pobierz modele</p>
                ) : models.map((model) => (
                  <div key={model.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusDot status="running" size="xs" pulse={true} />
                        <span className="text-xs font-medium text-foreground truncate max-w-[150px]">
                          {model.name.split(':')[0]}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {model.size}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {model.params} · {model.quantization}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Voice Module */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading">Moduł Mowy</CardTitle>
              <CardDescription className="text-xs">Whisper.cpp STT + Piper TTS</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center gap-4">
              <VoiceWaveform active={false} barCount={24} className="h-12" />
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground">Mikrofon nieaktywny</p>
                <p className="text-[10px] font-mono text-muted-foreground">
                  STT: Whisper small (PL) · 780 MB VRAM
                </p>
                <p className="text-[10px] font-mono text-muted-foreground">
                  TTS: Piper CPU (24 wątków)
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-[10px] font-mono border-success/30 text-success">
                  STT Ready
                </Badge>
                <Badge variant="outline" className="text-[10px] font-mono border-warning/30 text-warning">
                  TTS Idle
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Logs */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-heading">Status Ollama</CardTitle>
                <Link to="/logs">
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                    Logi <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 rounded bg-muted/20 px-2.5 py-2">
                  <span className={`h-2 w-2 rounded-full ${health.ollama === 'connected' ? 'bg-success animate-vik-pulse' : 'bg-destructive'}`} />
                  <span className="text-foreground/80">
                    Ollama: {health.ollama === 'connected' ? 'Połączony' : 'Rozłączony'}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded bg-muted/20 px-2.5 py-2">
                  <span className={`h-2 w-2 rounded-full ${health.backend === 'online' ? 'bg-success' : 'bg-destructive'}`} />
                  <span className="text-foreground/80">
                    Backend: {health.backend === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded bg-muted/20 px-2.5 py-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-foreground/80">
                    Modele: {health.ollama_models || 0} załadowanych
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded bg-muted/20 px-2.5 py-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-foreground/80">
                    Hostname: {systemMetrics.hostname}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded bg-muted/20 px-2.5 py-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-foreground/80">
                    OS: {systemMetrics.os}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

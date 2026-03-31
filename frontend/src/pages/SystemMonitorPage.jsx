import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MiniChart } from "@/components/shared/MiniChart";
import {
  systemMetrics,
  gpuHistory,
  cpuHistory,
  ollamaModels,
  dockerContainers,
} from "@/lib/mockData";
import { StatusDot } from "@/components/shared/StatusDot";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Thermometer,
  Monitor,
  Box,
  Server,
  Zap,
  Fan,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg bg-card border border-border/50 px-3 py-2 shadow-lg">
      <p className="text-xs font-mono text-muted-foreground mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs font-mono" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
        </p>
      ))}
    </div>
  );
};

export default function SystemMonitorPage() {
  const vramPercent = Math.round((systemMetrics.gpu.vramUsed / systemMetrics.gpu.vramTotal) * 100);
  const ramPercent = Math.round((systemMetrics.ram.used / systemMetrics.ram.total) * 100);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Monitor Systemu</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {systemMetrics.hostname} · {systemMetrics.os} · Uptime: {systemMetrics.uptime}
        </p>
      </motion.div>

      <Tabs defaultValue="gpu" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="gpu" className="text-xs gap-1.5"><HardDrive className="h-3.5 w-3.5" /> GPU</TabsTrigger>
          <TabsTrigger value="cpu" className="text-xs gap-1.5"><Cpu className="h-3.5 w-3.5" /> CPU</TabsTrigger>
          <TabsTrigger value="ram" className="text-xs gap-1.5"><MemoryStick className="h-3.5 w-3.5" /> RAM</TabsTrigger>
          <TabsTrigger value="docker" className="text-xs gap-1.5"><Box className="h-3.5 w-3.5" /> Docker</TabsTrigger>
        </TabsList>

        {/* GPU Tab */}
        <TabsContent value="gpu" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'VRAM', value: `${(systemMetrics.gpu.vramUsed/1024).toFixed(1)}/${(systemMetrics.gpu.vramTotal/1024).toFixed(0)} GB`, percent: vramPercent, icon: HardDrive },
              { label: 'Wykorzystanie', value: `${systemMetrics.gpu.utilization}%`, percent: systemMetrics.gpu.utilization, icon: Zap },
              { label: 'Temperatura', value: `${systemMetrics.gpu.temperature}°C`, percent: (systemMetrics.gpu.temperature / 95) * 100, icon: Thermometer },
              { label: 'Moc', value: `${systemMetrics.gpu.powerDraw}/${systemMetrics.gpu.powerLimit}W`, percent: (systemMetrics.gpu.powerDraw/systemMetrics.gpu.powerLimit)*100, icon: Fan },
            ].map((stat) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <Card className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                      <stat.icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-heading text-xl font-bold text-foreground mb-2">{stat.value}</p>
                    <Progress value={stat.percent} className="h-1.5" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-heading">{systemMetrics.gpu.name}</CardTitle>
                    <CardDescription className="text-xs">Pascal Architecture · 16 GB GDDR5X · CUDA 12.x</CardDescription>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] border-primary/30 text-primary">LIVE 30m</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={gpuHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <defs>
                      <linearGradient id="vramGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="vram" name="VRAM (MB)" stroke="hsl(var(--primary))" fill="url(#vramGrad)" strokeWidth={2} dot={false} />
                    <Area type="monotone" dataKey="temp" name="Temp (°C)" stroke="hsl(var(--warning))" fill="url(#tempGrad)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ollama Models */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-heading">Modele Ollama — Alokacja VRAM</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ollamaModels.map((model) => (
                    <div key={model.name} className="rounded-lg bg-muted/20 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StatusDot status={model.loaded ? 'running' : 'stopped'} size="sm" />
                          <span className="text-sm font-medium text-foreground">{model.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-mono">{model.quantization}</Badge>
                          <span className="text-xs font-mono text-muted-foreground">{model.size}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={(model.vramUsage / systemMetrics.gpu.vramTotal) * 100} className="h-1.5 flex-1" />
                        <span className="text-[11px] font-mono text-muted-foreground w-16 text-right">
                          {(model.vramUsage / 1024).toFixed(1)} GB
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">{model.role}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* CPU Tab */}
        <TabsContent value="cpu" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <motion.div variants={itemVariants}>
              <Card className="glass-card">
                <CardContent className="p-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Procesor</span>
                  <p className="font-heading text-lg font-bold text-foreground mt-1">{systemMetrics.cpu.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{systemMetrics.cpu.cores} rdzeni · {systemMetrics.cpu.threads} wątków · {systemMetrics.cpu.frequency} GHz</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="glass-card">
                <CardContent className="p-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Wykorzystanie</span>
                  <p className="font-heading text-2xl font-bold text-foreground mt-1">{systemMetrics.cpu.utilization}%</p>
                  <Progress value={systemMetrics.cpu.utilization} className="h-1.5 mt-2" />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="glass-card">
                <CardContent className="p-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Temperatura</span>
                  <p className="font-heading text-2xl font-bold text-foreground mt-1">{systemMetrics.cpu.temperature}°C</p>
                  <Progress value={(systemMetrics.cpu.temperature / 85) * 100} className="h-1.5 mt-2" />
                </CardContent>
              </Card>
            </motion.div>
          </div>
          <motion.div variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-heading">CPU Usage — 30 min</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={cpuHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <defs>
                      <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="usage" name="CPU %" stroke="hsl(var(--success))" fill="url(#cpuGrad)" strokeWidth={2} dot={false} />
                    <Area type="monotone" dataKey="temp" name="Temp °C" stroke="hsl(var(--warning))" fill="none" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* RAM Tab */}
        <TabsContent value="ram" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Użyte', value: `${(systemMetrics.ram.used/1024).toFixed(0)} GB`, sub: `z ${(systemMetrics.ram.total/1024).toFixed(0)} GB` },
              { label: 'Cache', value: `${(systemMetrics.ram.cached/1024).toFixed(0)} GB`, sub: 'buforowane' },
              { label: 'Wolne', value: `${((systemMetrics.ram.total - systemMetrics.ram.used)/1024).toFixed(0)} GB`, sub: 'dostępne' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <Card className="glass-card">
                  <CardContent className="p-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                    <p className="font-heading text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-heading">Alokacja RAM — 128 GB DDR3</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Wykorzystane</span>
                      <span className="text-xs font-mono text-foreground">{ramPercent}%</span>
                    </div>
                    <Progress value={ramPercent} className="h-3" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-primary/10 p-3 text-center">
                      <p className="text-lg font-heading font-bold text-primary">{(systemMetrics.ram.used/1024).toFixed(0)}</p>
                      <p className="text-[10px] text-muted-foreground">GB Użyte</p>
                    </div>
                    <div className="rounded-lg bg-warning/10 p-3 text-center">
                      <p className="text-lg font-heading font-bold text-warning">{(systemMetrics.ram.cached/1024).toFixed(0)}</p>
                      <p className="text-[10px] text-muted-foreground">GB Cache</p>
                    </div>
                    <div className="rounded-lg bg-success/10 p-3 text-center">
                      <p className="text-lg font-heading font-bold text-success">{((systemMetrics.ram.total - systemMetrics.ram.used)/1024).toFixed(0)}</p>
                      <p className="text-[10px] text-muted-foreground">GB Wolne</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Docker Tab */}
        <TabsContent value="docker" className="space-y-4 mt-4">
          <motion.div variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-heading">Docker Compose — Kontenery</CardTitle>
                <CardDescription className="text-xs">PostgreSQL · Qdrant · Redis · Celery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dockerContainers.map((container) => (
                    <div key={container.name} className="flex items-center justify-between rounded-lg bg-muted/20 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <StatusDot status={container.status} size="sm" />
                        <div>
                          <span className="text-sm font-medium text-foreground">{container.name}</span>
                          <span className="block text-[11px] font-mono text-muted-foreground">{container.image}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          Port: {container.port}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`font-mono text-[10px] capitalize ${
                            container.status === 'running'
                              ? 'border-success/30 text-success'
                              : 'border-warning/30 text-warning'
                          }`}
                        >
                          {container.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

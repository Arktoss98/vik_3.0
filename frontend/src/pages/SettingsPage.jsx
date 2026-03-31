import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Settings,
  Cpu,
  Mic,
  Volume2,
  Shield,
  Database,
  Save,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    defaultModel: 'bielik-11b',
    reasoningModel: 'deepseek-r1-14b',
    numCtx: 8192,
    maxImageSize: 1024,
    sttEnabled: true,
    ttsEnabled: true,
    ttsVoice: 'pl-male-1',
    sandboxEnabled: true,
    sandboxTimeout: 30,
    allowlistEnabled: true,
    telegramEnabled: true,
    telegramToken: '***********',
    postgresHost: 'localhost:5432',
    qdrantHost: 'localhost:6333',
    redisHost: 'localhost:6379',
  });

  const handleSave = () => {
    toast.success('Ustawienia zapisane pomyślnie');
  };

  const handleReset = () => {
    toast.info('Ustawienia zresetowane do domyślnych');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-4xl"
    >
      <motion.div variants={itemVariants}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Ustawienia</h1>
        <p className="text-sm text-muted-foreground mt-1">Konfiguracja systemu VIK</p>
      </motion.div>

      {/* LLM Settings */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-heading">Modele LLM</CardTitle>
            </div>
            <CardDescription className="text-xs">Konfiguracja serwera Ollama i parametrów modeli</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs">Domyślny model</Label>
                <Select value={settings.defaultModel} onValueChange={(v) => setSettings(s => ({...s, defaultModel: v}))}>
                  <SelectTrigger className="bg-muted/30 border-border/50 text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bielik-11b">Bielik-11B (Q6_K)</SelectItem>
                    <SelectItem value="bielik-11b-q4">Bielik-11B (Q4_K_M)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Model Reasoning</Label>
                <Select value={settings.reasoningModel} onValueChange={(v) => setSettings(s => ({...s, reasoningModel: v}))}>
                  <SelectTrigger className="bg-muted/30 border-border/50 text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deepseek-r1-14b">DeepSeek-R1-14B (Q4_K_M)</SelectItem>
                    <SelectItem value="deepseek-r1-7b">DeepSeek-R1-7B (Q6_K)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Rozmiar kontekstu (num_ctx)</Label>
                <Badge variant="outline" className="font-mono text-[10px]">{settings.numCtx}</Badge>
              </div>
              <Slider
                value={[settings.numCtx]}
                onValueChange={([v]) => setSettings(s => ({...s, numCtx: v}))}
                min={2048}
                max={16384}
                step={1024}
                className="w-full"
              />
              <p className="text-[10px] text-muted-foreground">Limit 8192 zalecany dla Quadro P5000 (16 GB VRAM)</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Max rozmiar obrazu (px)</Label>
                <Badge variant="outline" className="font-mono text-[10px]">{settings.maxImageSize}px</Badge>
              </div>
              <Slider
                value={[settings.maxImageSize]}
                onValueChange={([v]) => setSettings(s => ({...s, maxImageSize: v}))}
                min={512}
                max={2048}
                step={128}
                className="w-full"
              />
              <p className="text-[10px] text-muted-foreground">Pre-processing skalujący obrazy przed Base64 encoding</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Voice Settings */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-heading">Moduł Mowy</CardTitle>
            </div>
            <CardDescription className="text-xs">Konfiguracja Whisper.cpp STT i Piper TTS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">STT (Whisper.cpp)</Label>
                <p className="text-[11px] text-muted-foreground">Model small · GPU Pascal · 780 MB VRAM</p>
              </div>
              <Switch checked={settings.sttEnabled} onCheckedChange={(v) => setSettings(s => ({...s, sttEnabled: v}))} />
            </div>
            <Separator className="bg-border/30" />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">TTS (Piper)</Label>
                <p className="text-[11px] text-muted-foreground">Tryb CPU · 24 wątki · WAV/MP3 streaming</p>
              </div>
              <Switch checked={settings.ttsEnabled} onCheckedChange={(v) => setSettings(s => ({...s, ttsEnabled: v}))} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Głos TTS</Label>
              <Select value={settings.ttsVoice} onValueChange={(v) => setSettings(s => ({...s, ttsVoice: v}))}>
                <SelectTrigger className="bg-muted/30 border-border/50 text-sm h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pl-male-1">Polski — Męski 1</SelectItem>
                  <SelectItem value="pl-female-1">Polski — Żeński 1</SelectItem>
                  <SelectItem value="en-male-1">English — Male 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-heading">Bezpieczeństwo</CardTitle>
            </div>
            <CardDescription className="text-xs">Sandboxing i polityki dostępu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Piaskownica Docker</Label>
                <p className="text-[11px] text-muted-foreground">Izolowane kontenery dla generowanych narzędzi</p>
              </div>
              <Switch checked={settings.sandboxEnabled} onCheckedChange={(v) => setSettings(s => ({...s, sandboxEnabled: v}))} />
            </div>
            <Separator className="bg-border/30" />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Allowlist (Zarządca Systemu)</Label>
                <p className="text-[11px] text-muted-foreground">Blokada swobodnej manipulacji konsolą powłoki</p>
              </div>
              <Switch checked={settings.allowlistEnabled} onCheckedChange={(v) => setSettings(s => ({...s, allowlistEnabled: v}))} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Timeout sandbox (s)</Label>
                <Badge variant="outline" className="font-mono text-[10px]">{settings.sandboxTimeout}s</Badge>
              </div>
              <Slider
                value={[settings.sandboxTimeout]}
                onValueChange={([v]) => setSettings(s => ({...s, sandboxTimeout: v}))}
                min={10}
                max={120}
                step={5}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Database */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-heading">Bazy Danych</CardTitle>
            </div>
            <CardDescription className="text-xs">PostgreSQL · Qdrant · Redis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-xs">PostgreSQL</Label>
                <Input
                  value={settings.postgresHost}
                  onChange={(e) => setSettings(s => ({...s, postgresHost: e.target.value}))}
                  className="bg-muted/30 border-border/50 text-sm h-9 font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Qdrant</Label>
                <Input
                  value={settings.qdrantHost}
                  onChange={(e) => setSettings(s => ({...s, qdrantHost: e.target.value}))}
                  className="bg-muted/30 border-border/50 text-sm h-9 font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Redis</Label>
                <Input
                  value={settings.redisHost}
                  onChange={(e) => setSettings(s => ({...s, redisHost: e.target.value}))}
                  className="bg-muted/30 border-border/50 text-sm h-9 font-mono"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save */}
      <motion.div variants={itemVariants} className="flex justify-end gap-3 pb-8">
        <Button variant="ghost" onClick={handleReset} className="gap-1.5 text-sm text-muted-foreground">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-sm">
          <Save className="h-4 w-4" />
          Zapisz ustawienia
        </Button>
      </motion.div>
    </motion.div>
  );
}

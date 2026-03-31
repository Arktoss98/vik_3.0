import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VoiceWaveform } from "@/components/shared/VoiceWaveform";
import { chatMessages as initialMessages } from "@/lib/mockData";
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Wrench,
  Copy,
  Check,
  Loader2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = {
      id: messages.length + 1,
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Analizuję Twoje zapytanie... Przetwarzam dane przez silnik Bielik-11B z kwantyzacją Q6_K.\n\nNa podstawie analizy mogę potwierdzić, że wszystkie systemy funkcjonują poprawnie. Czy chcesz, abym wykonał dodatkową diagnostykę?',
        'Rozumiem. Uruchamiam odpowiednie narzędzie MCP...\n\nProces zakończony pomyślnie. Wyniki zostały zapisane w bazie wektorowej Qdrant do późniejszego wykorzystania w kontekście RAG.',
        'Przetwarzam zapytanie w trybie reasoning z użyciem DeepSeek-R1-14B...\n\n**Analiza ukończona.**\nModel wygenerował rozwiązanie w 3.2 sekundy z num_ctx ograniczonym do 8192 tokenów.',
      ];
      const assistantMsg = {
        id: messages.length + 2,
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        model: 'bielik-11b-v3.0-instruct:Q6_K',
        tools_used: ['system-manager'],
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 1500 + Math.random() * 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Skopiowano do schowka");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-4">
      {/* Main Chat */}
      <div className="flex flex-1 flex-col">
        <Card className="glass-card flex flex-1 flex-col overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 animate-vik-glow-pulse">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-heading">Chat z VIK</CardTitle>
                  <p className="text-[11px] font-mono text-muted-foreground">
                    bielik-11b-v3.0-instruct:Q6_K · num_ctx: 8192
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] border-success/30 text-success gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-vik-pulse" />
                Online
              </Badge>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full" ref={scrollRef}>
              <div className="space-y-4 p-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex gap-3",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role !== "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-xl px-4 py-3 text-sm",
                        msg.role === "user"
                          ? "bg-primary/15 text-foreground"
                          : msg.role === "system"
                          ? "bg-muted/50 text-muted-foreground border border-border/50"
                          : "bg-muted/30 text-foreground"
                      )}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {msg.timestamp}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {msg.model && (
                            <Badge variant="outline" className="text-[9px] font-mono px-1.5 py-0 border-primary/20 text-primary/70">
                              {msg.model.split(':')[0]}
                            </Badge>
                          )}
                          {msg.tools_used && msg.tools_used.map((tool) => (
                            <Badge key={tool} variant="outline" className="text-[9px] font-mono px-1.5 py-0 border-warning/30 text-warning/70 gap-0.5">
                              <Wrench className="h-2.5 w-2.5" />
                              {tool}
                            </Badge>
                          ))}
                          {msg.role === "assistant" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-muted-foreground hover:text-foreground"
                              onClick={() => handleCopy(msg.id, msg.content)}
                            >
                              {copiedId === msg.id ? (
                                <Check className="h-3 w-3 text-success" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    {msg.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary mt-0.5">
                        <User className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-muted/30 px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">VIK przetwarza...</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input */}
          <div className="shrink-0 border-t border-border/50 p-4">
            <div className="flex items-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "shrink-0",
                  micActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                )}
                onClick={() => setMicActive(!micActive)}
              >
                {micActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <div className="relative flex-1">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Napisz wiadomość do VIK..."
                  className="min-h-[44px] max-h-[120px] resize-none bg-muted/30 border-border/50 pr-12 text-sm"
                  rows={1}
                />
                {micActive && (
                  <div className="absolute bottom-1 left-2">
                    <VoiceWaveform active={true} barCount={12} className="h-6" />
                  </div>
                )}
              </div>
              <Button
                size="icon"
                disabled={!inputValue.trim() || isLoading}
                onClick={handleSend}
                className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Sidebar Info */}
      <div className="hidden xl:flex w-80 flex-col gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Aktywne Modele</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-muted/30 p-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-vik-pulse" />
                <span className="text-xs font-medium text-foreground">Bielik-11B</span>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground">Q6_K · 7.8 GB VRAM · num_ctx: 8192</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3 space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                <span className="text-xs font-medium text-foreground">DeepSeek-R1-14B</span>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground">Q4_K_M · Standby · Reasoning</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Narzędzia Dostępne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: 'system-manager', desc: 'Telemetria serwera', active: true },
                { name: 'web-navigator', desc: 'Nawigacja www', active: true },
                { name: 'stt-engine', desc: 'Transkrypcja mowy', active: true },
                { name: 'tts-engine', desc: 'Synteza mowy', active: false },
                { name: 'tool-sandbox', desc: 'Generowanie narzędzi', active: false },
              ].map((tool) => (
                <div key={tool.name} className="flex items-center justify-between rounded bg-muted/20 px-2.5 py-2">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-3 w-3 text-muted-foreground" />
                    <div>
                      <span className="text-[11px] font-medium text-foreground">{tool.name}</span>
                      <span className="block text-[9px] text-muted-foreground">{tool.desc}</span>
                    </div>
                  </div>
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    tool.active ? "bg-success" : "bg-muted-foreground"
                  )} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

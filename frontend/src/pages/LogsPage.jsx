import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { logEntries } from "@/lib/mockData";
import {
  Search,
  Filter,
  Download,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const levelColors = {
  INFO: 'border-primary/30 text-primary bg-primary/5',
  DEBUG: 'border-muted-foreground/30 text-muted-foreground bg-muted/30',
  WARNING: 'border-warning/30 text-warning bg-warning/5',
  ERROR: 'border-destructive/30 text-destructive bg-destructive/5',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLevel, setActiveLevel] = useState("ALL");
  const [logs, setLogs] = useState(logEntries);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = !searchQuery ||
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.service.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = activeLevel === "ALL" || log.level === activeLevel;
      return matchesSearch && matchesLevel;
    });
  }, [logs, searchQuery, activeLevel]);

  const levels = ["ALL", "INFO", "DEBUG", "WARNING", "ERROR"];
  const levelCounts = useMemo(() => {
    const counts = { ALL: logs.length };
    logs.forEach((log) => {
      counts[log.level] = (counts[log.level] || 0) + 1;
    });
    return counts;
  }, [logs]);

  const handleRefresh = () => {
    toast.info("Odświeżanie logów...");
  };

  const handleClear = () => {
    setLogs([]);
    toast.success("Logi wyczyszczone");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 h-[calc(100vh-7rem)] flex flex-col"
    >
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Logi Systemu</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Przeglądaj zdarzenia wszystkich mikrousług VIK
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground" onClick={handleRefresh}>
              <RefreshCw className="h-3 w-3" /> Odśwież
            </Button>
            <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground">
              <Download className="h-3 w-3" /> Eksport
            </Button>
            <Button variant="ghost" size="sm" className="text-xs gap-1 text-destructive/60 hover:text-destructive" onClick={handleClear}>
              <Trash2 className="h-3 w-3" /> Wyczyść
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardContent className="p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj w logach..."
                className="pl-9 bg-muted/30 border-border/50 text-sm h-9"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {levels.map((level) => (
                <Button
                  key={level}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveLevel(level)}
                  className={cn(
                    "h-7 text-[11px] font-mono px-2.5",
                    activeLevel === level
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {level}
                  <span className="ml-1 text-[9px] opacity-60">{levelCounts[level] || 0}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Log entries */}
      <Card className="glass-card flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-1">
            {filteredLogs.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                Brak logów pasujących do filtrów
              </div>
            ) : (
              filteredLogs.map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-start gap-2 px-3 py-2 rounded hover:bg-muted/20 font-mono text-[12px] leading-relaxed"
                  style={{ transition: 'background-color 0.15s ease' }}
                >
                  <span className="shrink-0 text-muted-foreground w-[130px]">
                    {log.timestamp}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] shrink-0 px-1.5 py-0 w-[60px] justify-center font-mono",
                      levelColors[log.level]
                    )}
                  >
                    {log.level}
                  </Badge>
                  <span className="shrink-0 text-primary/70 w-[120px] truncate">
                    {log.service}
                  </span>
                  <span className="text-foreground/85 flex-1">
                    {log.message}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}

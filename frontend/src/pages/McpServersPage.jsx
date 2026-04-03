import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusDot } from "@/components/shared/StatusDot";
import { mcpServers } from "@/lib/mockData";
import {
  Server,
  RefreshCw,
  Power,
  PowerOff,
  Activity,
  AlertTriangle,
  ExternalLink,
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

export default function McpServersPage() {
  const [servers, setServers] = useState(mcpServers);

  const handleRestart = (id) => {
    toast.info(`Restartowanie serwera ${id}...`);
    setServers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'standby' } : s))
    );
    setTimeout(() => {
      setServers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'running' } : s))
      );
      toast.success(`Serwer ${id} zrestartowany pomyślnie`);
    }, 2000);
  };

  const handleToggle = (id) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newStatus = s.status === 'running' ? 'stopped' : 'running';
        toast[newStatus === 'running' ? 'success' : 'warning'](
          `Serwer ${s.name} ${newStatus === 'running' ? 'uruchomiony' : 'zatrzymany'}`
        );
        return { ...s, status: newStatus };
      })
    );
  };

  const runningCount = servers.filter((s) => s.status === 'running').length;
  const totalErrors = servers.reduce((a, s) => a + s.errors, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Serwery MCP</h1>
            <p className="text-sm text-muted-foreground mt-1">Model Context Protocol — rejestr mikrousług</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono text-xs border-success/30 text-success gap-1">
              <Activity className="h-3 w-3" />
              {runningCount}/{servers.length} aktywnych
            </Badge>
            {totalErrors > 0 && (
              <Badge variant="outline" className="font-mono text-xs border-destructive/30 text-destructive gap-1">
                <AlertTriangle className="h-3 w-3" />
                {totalErrors} błędów
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {servers.map((server) => (
          <motion.div key={server.id} variants={itemVariants}>
            <Card className="glass-card flex flex-col h-full hover:vik-glow-ring" style={{ transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Server className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-heading">{server.name}</CardTitle>
                      <CardDescription className="text-[11px] font-mono">{server.type} · {server.language}</CardDescription>
                    </div>
                  </div>
                  <StatusDot status={server.status} size="md" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">{server.description}</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded bg-muted/30 p-2 text-center">
                    <p className="text-sm font-heading font-bold text-foreground">{server.requests.toLocaleString()}</p>
                    <p className="text-[9px] text-muted-foreground">Żądania</p>
                  </div>
                  <div className="rounded bg-muted/30 p-2 text-center">
                    <p className="text-sm font-heading font-bold text-foreground">{server.errors}</p>
                    <p className="text-[9px] text-muted-foreground">Błędy</p>
                  </div>
                  <div className="rounded bg-muted/30 p-2 text-center">
                    <p className="text-sm font-heading font-bold text-foreground">{server.uptime}</p>
                    <p className="text-[9px] text-muted-foreground">Uptime</p>
                  </div>
                </div>
                {server.port && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                    <ExternalLink className="h-3 w-3" />
                    localhost:{server.port}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-border/30 pt-3 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs flex-1 h-8 text-muted-foreground hover:text-foreground"
                  onClick={() => handleRestart(server.id)}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Restart
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs flex-1 h-8 ${
                    server.status === 'running'
                      ? 'text-destructive/70 hover:text-destructive hover:bg-destructive/10'
                      : 'text-success/70 hover:text-success hover:bg-success/10'
                  }`}
                  onClick={() => handleToggle(server.id)}
                >
                  {server.status === 'running' ? (
                    <><PowerOff className="h-3 w-3 mr-1" /> Stop</>
                  ) : (
                    <><Power className="h-3 w-3 mr-1" /> Start</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

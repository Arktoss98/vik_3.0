import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusDot } from "@/components/shared/StatusDot";
import { sandboxTools } from "@/lib/mockData";
import {
  Wrench,
  Plus,
  Play,
  Trash2,
  Code2,
  TestTube2,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const statusConfig = {
  active: { label: 'Aktywny', color: 'border-success/30 text-success bg-success/5' },
  testing: { label: 'Testowanie', color: 'border-info/30 text-info bg-info/5' },
  building: { label: 'Budowanie', color: 'border-warning/30 text-warning bg-warning/5' },
  error: { label: 'Błąd', color: 'border-destructive/30 text-destructive bg-destructive/5' },
};

export default function ToolSandboxPage() {
  const [tools, setTools] = useState(sandboxTools);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [newToolDesc, setNewToolDesc] = useState("");

  const handleGenerateTool = () => {
    if (!newToolDesc.trim()) return;
    setGenerating(true);

    setTimeout(() => {
      const newTool = {
        id: `tool-${Date.now()}`,
        name: `custom_${newToolDesc.toLowerCase().replace(/\s+/g, '_').slice(0, 20)}`,
        description: newToolDesc,
        status: 'building',
        created: new Date().toISOString().split('T')[0],
        language: 'Python',
        tests: { passed: 0, failed: 0 },
        schema: '{"input": "string"}',
      };
      setTools((prev) => [newTool, ...prev]);
      setGenerating(false);
      setDialogOpen(false);
      setNewToolDesc("");
      toast.success('Narzędzie generowane przez DeepSeek-R1-14B');

      // Simulate testing completion
      setTimeout(() => {
        setTools((prev) =>
          prev.map((t) =>
            t.id === newTool.id
              ? { ...t, status: 'testing', tests: { passed: 2, failed: 1 } }
              : t
          )
        );
      }, 3000);
    }, 2500);
  };

  const handleDelete = (id) => {
    setTools((prev) => prev.filter((t) => t.id !== id));
    toast.success('Narzędzie usunięte');
  };

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
            <h1 className="font-heading text-2xl font-bold text-foreground">Piaskownica Narzędzi</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Dynamiczne generowanie narzędzi FastMCP przez DeepSeek-R1-14B
            </p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Nowe Narzędzie
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <motion.div key={tool.id} variants={itemVariants}>
            <Card className="glass-card flex flex-col h-full hover:vik-glow-ring" style={{ transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Wrench className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-heading">{tool.name}</CardTitle>
                      <CardDescription className="text-[11px] font-mono">{tool.language} · {tool.created}</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono ${statusConfig[tool.status]?.color || ''}`}
                  >
                    {statusConfig[tool.status]?.label || tool.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
                <div className="rounded-lg bg-muted/20 p-2.5">
                  <p className="text-[10px] font-mono text-muted-foreground mb-1">Schema:</p>
                  <code className="text-[11px] font-mono text-foreground/80">{tool.schema}</code>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-success" />
                    <span className="text-xs font-mono text-success">{tool.tests.passed}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-destructive" />
                    <span className="text-xs font-mono text-destructive">{tool.tests.failed}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">testów</span>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/30 pt-3 gap-2">
                <Button variant="ghost" size="sm" className="text-xs flex-1 h-8 text-muted-foreground hover:text-foreground gap-1">
                  <Play className="h-3 w-3" /> Uruchom
                </Button>
                <Button variant="ghost" size="sm" className="text-xs flex-1 h-8 text-muted-foreground hover:text-foreground gap-1">
                  <Code2 className="h-3 w-3" /> Kod
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8 text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(tool.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* New Tool Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Wygeneruj Nowe Narzędzie
            </DialogTitle>
            <DialogDescription className="text-xs">
              Opisz pożądaną funkcjonalność. DeepSeek-R1-14B wygeneruje skrypt FastMCP w izolowanym kontenerze Docker.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Textarea
              value={newToolDesc}
              onChange={(e) => setNewToolDesc(e.target.value)}
              placeholder="Np: Narzędzie do pobierania kursów walut z API NBP i konwersji PLN na USD/EUR..."
              className="min-h-[100px] bg-muted/30 border-border/50 text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-sm">
              Anuluj
            </Button>
            <Button
              onClick={handleGenerateTool}
              disabled={!newToolDesc.trim() || generating}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-sm"
            >
              {generating ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Generuję...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Generuj</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

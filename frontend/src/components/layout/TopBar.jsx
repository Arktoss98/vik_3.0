import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  Mic,
  MicOff,
  Wifi,
  Menu,
  CircleDot,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export const TopBar = ({ sidebarCollapsed, onToggleSidebar }) => {
  const [micActive, setMicActive] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <header className="flex h-16 items-center justify-between border-b border-border/50 bg-card/60 backdrop-blur-xl px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Szukaj w logach, narzędziach..."
              className={`w-64 pl-9 bg-muted/50 border-border/50 text-sm focus:w-80 ${searchFocused ? 'border-primary/50' : ''}`}
              style={{ transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Connection status */}
          <Badge
            variant="outline"
            className="hidden md:flex gap-1.5 border-success/30 text-success bg-success/5 font-mono text-[11px]"
          >
            <Wifi className="h-3 w-3" />
            Ollama Connected
          </Badge>

          {/* Active model indicator */}
          <Badge
            variant="outline"
            className="hidden lg:flex gap-1.5 border-primary/30 text-primary bg-primary/5 font-mono text-[11px]"
          >
            <CircleDot className="h-3 w-3 animate-vik-pulse" />
            Bielik-11B
          </Badge>

          {/* Voice toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMicActive(!micActive)}
                className={micActive ? "text-primary bg-primary/10" : "text-muted-foreground"}
              >
                {micActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {micActive ? "Wyłącz mikrofon" : "Włącz mikrofon (STT)"}
            </TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                  3
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              3 nowe powiadomienia
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
};

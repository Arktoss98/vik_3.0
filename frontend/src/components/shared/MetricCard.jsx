import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const MetricCard = ({ icon: Icon, label, value, unit, subtext, trend, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn("glass-card hover:vik-glow-ring", className)}
        style={{ transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-2xl font-bold text-foreground">
                  {value}
                </span>
                {unit && (
                  <span className="text-xs font-mono text-muted-foreground">{unit}</span>
                )}
              </div>
              {subtext && (
                <span className="text-xs text-muted-foreground">{subtext}</span>
              )}
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
          {trend !== undefined && (
            <div className="mt-3 flex items-center gap-1">
              <span
                className={cn(
                  "text-xs font-medium font-mono",
                  trend >= 0 ? "text-success" : "text-destructive"
                )}
              >
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </span>
              <span className="text-xs text-muted-foreground">vs wczoraj</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

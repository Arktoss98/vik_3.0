import { cn } from "@/lib/utils";

const statusColors = {
  running: "bg-success",
  idle: "bg-warning",
  standby: "bg-info",
  error: "bg-destructive",
  stopped: "bg-muted-foreground",
  building: "bg-warning",
  testing: "bg-info",
  active: "bg-success",
};

export const StatusDot = ({ status, size = "sm", pulse = true }) => {
  const sizeClasses = {
    xs: "h-1.5 w-1.5",
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  };

  return (
    <span className="relative inline-flex">
      {pulse && (status === "running" || status === "active") && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-50",
            statusColors[status] || "bg-muted-foreground"
          )}
        />
      )}
      <span
        className={cn(
          "relative inline-flex rounded-full",
          sizeClasses[size],
          statusColors[status] || "bg-muted-foreground"
        )}
      />
    </span>
  );
};

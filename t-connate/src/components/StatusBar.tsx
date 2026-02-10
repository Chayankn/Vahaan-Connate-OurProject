import { StatusBadge } from "./StatusBadge";
import { Wifi, Cpu, HardDrive, Activity, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBarProps {
  className?: string;
}

export function StatusBar({ className }: StatusBarProps) {
  return (
    <div
      className={cn(
        "h-8 px-4 flex items-center justify-between bg-card/80 backdrop-blur-sm border-t border-border text-xs",
        className
      )}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5 text-success" />
          <span className="text-muted-foreground">3 devices connected</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <StatusBadge status="live" size="sm" showLabel={false} />
        <span className="text-muted-foreground">2 active tests</span>
      </div>

      {/* Center section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span className="text-muted-foreground">Sampling: 100 Hz</span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">CPU: 42%</span>
        </div>
        <div className="flex items-center gap-2">
          <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">GPU: 28%</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

type Status = 'idle' | 'live' | 'simulating' | 'error' | 'connected' | 'disconnected' | 'pairing';

interface StatusBadgeProps {
  status: Status;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<Status, { label: string; dotClass: string; bgClass: string }> = {
  idle: {
    label: 'Idle',
    dotClass: 'bg-muted-foreground',
    bgClass: 'bg-muted/50 text-muted-foreground',
  },
  live: {
    label: 'Live',
    dotClass: 'bg-success animate-pulse',
    bgClass: 'bg-success/20 text-success',
  },
  simulating: {
    label: 'Simulating',
    dotClass: 'bg-primary animate-pulse',
    bgClass: 'bg-primary/20 text-primary',
  },
  error: {
    label: 'Error',
    dotClass: 'bg-error animate-pulse',
    bgClass: 'bg-error/20 text-error',
  },
  connected: {
    label: 'Connected',
    dotClass: 'bg-success',
    bgClass: 'bg-success/20 text-success',
  },
  disconnected: {
    label: 'Disconnected',
    dotClass: 'bg-muted-foreground',
    bgClass: 'bg-muted/50 text-muted-foreground',
  },
  pairing: {
    label: 'Pairing',
    dotClass: 'bg-warning animate-pulse',
    bgClass: 'bg-warning/20 text-warning',
  },
};

const sizeConfig = {
  sm: { dot: 'w-1.5 h-1.5', text: 'text-[10px]', padding: 'px-1.5 py-0.5' },
  md: { dot: 'w-2 h-2', text: 'text-xs', padding: 'px-2 py-1' },
  lg: { dot: 'w-2.5 h-2.5', text: 'text-sm', padding: 'px-3 py-1.5' },
};

export function StatusBadge({ status, showLabel = true, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        sizeStyles.padding,
        sizeStyles.text,
        config.bgClass
      )}
    >
      <span className={cn("rounded-full", sizeStyles.dot, config.dotClass)} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

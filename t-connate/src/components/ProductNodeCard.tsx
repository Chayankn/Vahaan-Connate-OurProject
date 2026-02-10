import { cn } from "@/lib/utils";
import { ProductType, productDefinitions } from "@/data/sampleData";
import { StatusBadge } from "./StatusBadge";
import { Sparkline } from "./Sparkline";
import { GripVertical } from "lucide-react";

interface ProductNodeCardProps {
  type: ProductType;
  name: string;
  status: 'idle' | 'live' | 'simulating' | 'error';
  sparklineData: number[];
  selected?: boolean;
  onClick?: () => void;
  draggable?: boolean;
  compact?: boolean;
}

const productColors: Record<ProductType, string> = {
  unimount: 'hsl(var(--unimount))',
  quadmount: 'hsl(var(--quadmount))',
  motion: 'hsl(var(--motion))',
  gyro: 'hsl(var(--gyro))',
  atmos: 'hsl(var(--atmos))',
};

const accentClasses: Record<ProductType, string> = {
  unimount: 'accent-unimount',
  quadmount: 'accent-quadmount',
  motion: 'accent-motion',
  gyro: 'accent-gyro',
  atmos: 'accent-atmos',
};

export function ProductNodeCard({
  type,
  name,
  status,
  sparklineData,
  selected,
  onClick,
  draggable = false,
  compact = false,
}: ProductNodeCardProps) {
  const definition = productDefinitions[type];

  if (compact) {
    return (
      <div
        className={cn(
          "glass-panel p-3 cursor-pointer transition-all duration-200 group",
          accentClasses[type],
          "hover:border-primary/50 hover:scale-[1.02]",
          draggable && "cursor-grab active:cursor-grabbing"
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          {draggable && (
            <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: `${productColors[type]}20` }}
          >
            {definition.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{definition.label}</div>
            <div className="text-xs text-muted-foreground truncate">{definition.description}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "glass-panel p-4 cursor-pointer transition-all duration-200",
        accentClasses[type],
        selected && "ring-2 ring-primary border-primary/50",
        "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: `${productColors[type]}20` }}
          >
            {definition.icon}
          </div>
          <div>
            <div className="font-semibold text-sm">{name}</div>
            <div className="text-xs text-muted-foreground">{definition.label}</div>
          </div>
        </div>
        <StatusBadge status={status} size="sm" />
      </div>
      
      <Sparkline
        data={sparklineData}
        color={productColors[type]}
        height={40}
        className="mt-2 opacity-80"
      />
      
      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        <span>RPM: {Math.round(sparklineData[sparklineData.length - 1] * 60)}</span>
        <span>Thrust: {(sparklineData[sparklineData.length - 1] * 0.15).toFixed(1)}N</span>
      </div>
    </div>
  );
}

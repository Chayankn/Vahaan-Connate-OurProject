import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface JoystickControllerProps {
  onMove?: (x: number, y: number) => void;
  onThrottleChange?: (value: number) => void;
  onYawChange?: (value: number) => void;
  size?: number;
  className?: string;
}

export function JoystickController({
  onMove,
  onThrottleChange,
  onYawChange,
  size = 120,
  className,
}: JoystickControllerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [throttle, setThrottle] = useState(0);
  const [yaw, setYaw] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxDistance = size / 2 - 20;

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let deltaX = clientX - centerX;
      let deltaY = clientY - centerY;

      // Constrain to circle
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance > maxDistance) {
        deltaX = (deltaX / distance) * maxDistance;
        deltaY = (deltaY / distance) * maxDistance;
      }

      setPosition({ x: deltaX, y: deltaY });

      // Normalize to -1 to 1
      const normalizedX = deltaX / maxDistance;
      const normalizedY = -deltaY / maxDistance; // Invert Y for intuitive up = positive
      onMove?.(normalizedX, normalizedY);
    },
    [maxDistance, onMove]
  );

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      handleMove(clientX, clientY);
    },
    [handleMove]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    onMove?.(0, 0);
  }, [onMove]);

  const handleMoveEvent = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      handleMove(clientX, clientY);
    },
    [isDragging, handleMove]
  );

  const handleThrottleChange = (value: number[]) => {
    setThrottle(value[0]);
    onThrottleChange?.(value[0]);
  };

  const handleYawChange = (value: number[]) => {
    setYaw(value[0]);
    onYawChange?.(value[0]);
  };

  return (
    <div className={cn("flex items-center gap-6", className)}>
      {/* Throttle Slider (Vertical) */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Throttle
        </span>
        <div className="flex items-center gap-3">
          <div className="h-[120px] flex items-center">
            <Slider
              orientation="vertical"
              value={[throttle]}
              onValueChange={handleThrottleChange}
              max={100}
              min={0}
              step={1}
              className="h-full"
            />
          </div>
          <div className="flex flex-col items-center justify-center bg-card border border-border rounded-md px-2 py-1 min-w-[48px]">
            <span className="text-lg font-bold text-primary">{throttle}</span>
            <span className="text-[10px] text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      {/* Joystick */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Pitch / Roll
        </span>
        <div
          ref={containerRef}
          className={cn(
            "relative rounded-full bg-secondary/80 border-2 border-border shadow-inner cursor-pointer select-none",
            isDragging && "border-primary/50"
          )}
          style={{ width: size, height: size }}
          onMouseDown={handleStart}
          onMouseMove={handleMoveEvent}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMoveEvent}
          onTouchEnd={handleEnd}
        >
          {/* Center guides */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-px h-full bg-border/50" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-px bg-border/50" />
          </div>

          {/* Outer ring */}
          <div className="absolute inset-2 rounded-full border border-dashed border-muted-foreground/30 pointer-events-none" />

          {/* Joystick knob */}
          <div
            className={cn(
              "absolute w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-lg border-2 border-primary-foreground/20 transition-shadow",
              isDragging && "shadow-primary/30 shadow-xl"
            )}
            style={{
              left: `calc(50% + ${position.x}px - 20px)`,
              top: `calc(50% + ${position.y}px - 20px)`,
              transition: isDragging ? "none" : "all 0.2s ease-out",
            }}
          >
            {/* Knob detail */}
            <div className="absolute inset-2 rounded-full bg-primary-foreground/10" />
          </div>

          {/* Direction labels */}
          <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-medium">
            +Y
          </span>
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-medium">
            -Y
          </span>
          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">
            -X
          </span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">
            +X
          </span>
        </div>
      </div>

      {/* Yaw Slider (Vertical) */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Yaw
        </span>
        <div className="flex items-center gap-3">
          <div className="h-[120px] flex items-center">
            <Slider
              orientation="vertical"
              value={[yaw]}
              onValueChange={handleYawChange}
              max={100}
              min={0}
              step={1}
              className="h-full"
            />
          </div>
          <div className="flex flex-col items-center justify-center bg-card border border-border rounded-md px-2 py-1 min-w-[48px]">
            <span className="text-lg font-bold text-primary">{yaw}</span>
            <span className="text-[10px] text-muted-foreground">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

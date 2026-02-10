import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SimulationPanelProps {
  isRunning: boolean;
  progress: number;
  speed: number;
  duration: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onDurationChange: (duration: number) => void;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  isRunning,
  progress,
  speed,
  duration,
  onStart,
  onPause,
  onReset,
  onSpeedChange,
  onDurationChange
}) => {
  return (
    <div className="h-16 bg-card/80 backdrop-blur-sm border-t border-border flex items-center px-4 gap-6">
      {/* Play controls */}
      <div className="flex items-center gap-2">
        {isRunning ? (
          <Button size="sm" variant="outline" onClick={onPause}>
            <Pause className="w-4 h-4" />
          </Button>
        ) : (
          <Button size="sm" variant="default" onClick={onStart}>
            <Play className="w-4 h-4" />
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={onReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="flex-1 max-w-md">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Simulation Progress</span>
          <span className="text-xs font-mono text-foreground">{progress.toFixed(1)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-2 w-32">
        <FastForward className="w-4 h-4 text-muted-foreground" />
        <div className="flex-1">
          <Slider
            value={[speed]}
            min={0.1}
            max={10}
            step={0.1}
            onValueChange={([v]) => onSpeedChange(v)}
          />
        </div>
        <span className="text-xs font-mono w-8">{speed}x</span>
      </div>

      {/* Duration */}
      <div className="flex items-center gap-2">
        <Label className="text-xs text-muted-foreground">Duration:</Label>
        <div className="w-20">
          <Slider
            value={[duration]}
            min={1}
            max={60}
            step={1}
            onValueChange={([v]) => onDurationChange(v)}
          />
        </div>
        <span className="text-xs font-mono">{duration}s</span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-success animate-pulse' : 'bg-muted'}`} />
        <span className="text-xs text-muted-foreground">
          {isRunning ? 'Running' : 'Ready'}
        </span>
      </div>
    </div>
  );
};

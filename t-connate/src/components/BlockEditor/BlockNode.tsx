import React from 'react';
import { PlacedBlock } from './BlockTypes';
import { Cog, Zap, Battery, Compass, Cpu, Move, Filter, FileText } from 'lucide-react';

interface BlockNodeProps {
  block: PlacedBlock;
  isSelected: boolean;
  isSimulating: boolean;
  onSelect: () => void;
  onStartConnection: (blockId: string, port: string, isOutput: boolean) => void;
  onEndConnection: (blockId: string, port: string) => void;
  onDragStart: (e: React.MouseEvent) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Cog, Zap, Battery, Compass, Cpu, Move, Filter, FileText
};

export const BlockNode: React.FC<BlockNodeProps> = ({
  block,
  isSelected,
  isSimulating,
  onSelect,
  onStartConnection,
  onEndConnection,
  onDragStart
}) => {
  const Icon = iconMap[block.icon] || Cog;

  return (
    <div
      className={`absolute cursor-move select-none transition-shadow duration-200 ${
        isSelected ? 'ring-2 ring-accent z-20' : 'z-10'
      } ${isSimulating ? 'animate-pulse' : ''}`}
      style={{ left: block.x, top: block.y }}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onMouseDown={onDragStart}
    >
      <div 
        className="bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg min-w-[140px]"
        style={{ borderColor: block.color }}
      >
        {/* Header */}
        <div 
          className="flex items-center gap-2 px-3 py-2 rounded-t-lg"
          style={{ backgroundColor: `${block.color}20` }}
        >
          <Icon className="w-4 h-4" style={{ color: block.color }} />
          <span className="text-sm font-medium text-foreground">{block.name}</span>
        </div>

        {/* Body with ports */}
        <div className="flex justify-between p-2 gap-4">
          {/* Input ports */}
          <div className="flex flex-col gap-1">
            {block.inputs.map((input) => (
              <div
                key={input}
                className="flex items-center gap-1 cursor-crosshair group"
                onMouseUp={() => onEndConnection(block.instanceId, input)}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full bg-muted border border-border group-hover:bg-accent group-hover:scale-125 transition-all"
                />
                <span className="text-[10px] text-muted-foreground">{input}</span>
              </div>
            ))}
          </div>

          {/* Output ports */}
          <div className="flex flex-col gap-1 items-end">
            {block.outputs.map((output) => (
              <div
                key={output}
                className="flex items-center gap-1 cursor-crosshair group"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onStartConnection(block.instanceId, output, true);
                }}
              >
                <span className="text-[10px] text-muted-foreground">{output}</span>
                <div 
                  className="w-2.5 h-2.5 rounded-full border border-border group-hover:bg-accent group-hover:scale-125 transition-all"
                  style={{ backgroundColor: block.color }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Simulation indicator */}
        {isSimulating && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-ping" />
        )}
      </div>
    </div>
  );
};

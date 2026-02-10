import React from 'react';
import { BLOCK_DEFINITIONS } from './BlockTypes';
import { Cog, Zap, Battery, Compass, Cpu, Move, Filter, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BlockPaletteProps {
  onDragStart: (type: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Cog, Zap, Battery, Compass, Cpu, Move, Filter, FileText
};

export const BlockPalette: React.FC<BlockPaletteProps> = ({ onDragStart }) => {
  return (
    <div className="w-48 bg-card/50 backdrop-blur-sm border-r border-border flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Components</h3>
        <p className="text-xs text-muted-foreground mt-1">Drag to canvas</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {BLOCK_DEFINITIONS.map((block) => {
            const Icon = iconMap[block.icon] || Cog;
            return (
              <div
                key={block.type}
                draggable
                onDragStart={() => onDragStart(block.type)}
                className="flex items-center gap-3 p-2 rounded-lg bg-background/50 border border-border cursor-grab hover:border-accent hover:bg-background/80 transition-all active:cursor-grabbing group"
              >
                <div 
                  className="w-8 h-8 rounded-md flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${block.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: block.color }} />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">{block.name}</span>
                  <p className="text-[10px] text-muted-foreground">
                    {block.inputs.length}in / {block.outputs.length}out
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

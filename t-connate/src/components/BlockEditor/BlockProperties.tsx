import React from 'react';
import { PlacedBlock } from './BlockTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Copy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BlockPropertiesProps {
  block: PlacedBlock | null;
  onUpdate: (blockId: string, params: Record<string, number | string>) => void;
  onDelete: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
}

export const BlockProperties: React.FC<BlockPropertiesProps> = ({
  block,
  onUpdate,
  onDelete,
  onDuplicate
}) => {
  if (!block) {
    return (
      <div className="w-56 bg-card/50 backdrop-blur-sm border-l border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-xs text-muted-foreground text-center">
            Select a block to view and edit its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-56 bg-card/50 backdrop-blur-sm border-l border-border flex flex-col">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{block.name}</h3>
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: block.color }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">ID: {block.instanceId.slice(0, 8)}</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Inputs</Label>
            <div className="flex flex-wrap gap-1">
              {block.inputs.map((input) => (
                <span 
                  key={input}
                  className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground"
                >
                  {input}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Outputs</Label>
            <div className="flex flex-wrap gap-1">
              {block.outputs.map((output) => (
                <span 
                  key={output}
                  className="text-[10px] px-2 py-0.5 rounded text-foreground"
                  style={{ backgroundColor: `${block.color}30` }}
                >
                  {output}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-3 space-y-2">
            <Label className="text-xs text-muted-foreground">Parameters</Label>
            {Object.entries(block.params).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <Label className="text-[10px] capitalize">{key}</Label>
                <Input
                  value={value}
                  onChange={(e) => {
                    const newParams = { ...block.params };
                    newParams[key] = isNaN(Number(e.target.value)) 
                      ? e.target.value 
                      : Number(e.target.value);
                    onUpdate(block.instanceId, newParams);
                  }}
                  className="h-7 text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onDuplicate(block.instanceId)}
        >
          <Copy className="w-3 h-3 mr-1" />
          Copy
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onDelete(block.instanceId)}
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};

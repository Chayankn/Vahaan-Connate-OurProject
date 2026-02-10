import { useState, useCallback } from "react";
import { ProductNode, ProductType, generateSparklineData, productDefinitions } from "@/data/sampleData";
import { ProductNodeCard } from "./ProductNodeCard";
import { cn } from "@/lib/utils";

interface WorkbenchCanvasProps {
  nodes: ProductNode[];
  onNodesChange: (nodes: ProductNode[]) => void;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
}

export function WorkbenchCanvas({
  nodes,
  onNodesChange,
  selectedNodeId,
  onSelectNode,
}: WorkbenchCanvasProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const productType = e.dataTransfer.getData('productType') as ProductType;
    if (!productType) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 100; // Center the card
    const y = e.clientY - rect.top - 50;

    const newNode: ProductNode = {
      id: `node-${Date.now()}`,
      type: productType,
      name: `${productDefinitions[productType].label}-${nodes.length + 1}`,
      x: Math.max(0, x),
      y: Math.max(0, y),
      status: 'idle',
      sparklineData: generateSparklineData(20),
    };

    onNodesChange([...nodes, newNode]);
    onSelectNode(newNode.id);
  }, [nodes, onNodesChange, onSelectNode]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectNode(null);
    }
  }, [onSelectNode]);

  return (
    <div
      className={cn(
        "flex-1 relative overflow-hidden canvas-grid transition-colors",
        dragOver && "bg-primary/5 border-2 border-dashed border-primary/30"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleCanvasClick}
    >
      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-muted-foreground animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-secondary/50 flex items-center justify-center">
              <svg className="w-10 h-10 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 4v16m8-8H4" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-medium">Drop test platforms here</p>
            <p className="text-xs mt-1">Drag nodes from the toolbox to build your test setup</p>
          </div>
        </div>
      )}

      {/* Nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute animate-fade-in"
          style={{
            left: node.x,
            top: node.y,
            width: 220,
          }}
        >
          <ProductNodeCard
            type={node.type}
            name={node.name}
            status={node.status}
            sparklineData={node.sparklineData}
            selected={selectedNodeId === node.id}
            onClick={() => onSelectNode(node.id)}
          />
        </div>
      ))}

      {/* Connection lines would go here in a full implementation */}
    </div>
  );
}

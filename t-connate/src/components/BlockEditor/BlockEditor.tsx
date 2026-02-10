import React, { useState, useRef, useCallback, useEffect } from 'react';
import { PlacedBlock, Connection, BLOCK_DEFINITIONS } from './BlockTypes';
import { BlockNode } from './BlockNode';
import { BlockPalette } from './BlockPalette';
import { BlockProperties } from './BlockProperties';
import { SimulationPanel } from './SimulationPanel';
import { ConnectionLine } from './ConnectionLine';
import { CSVDataManager, CSVDataset, CSVDataPoint } from './CSVDataManager';
import { DataOverlayChart } from './DataOverlayChart';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, ChartLine, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const BlockEditor: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [blocks, setBlocks] = useState<PlacedBlock[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [dragType, setDragType] = useState<string | null>(null);
  const [draggingBlock, setDraggingBlock] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Connection drawing state
  const [pendingConnection, setPendingConnection] = useState<{
    fromBlock: string;
    fromPort: string;
    startX: number;
    startY: number;
  } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simSpeed, setSimSpeed] = useState(1);
  const [simDuration, setSimDuration] = useState(10);

  // CSV Data state
  const [datasets, setDatasets] = useState<CSVDataset[]>([]);
  const [simulationData, setSimulationData] = useState<CSVDataPoint[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('RPM');
  const [showChart, setShowChart] = useState(true);

  const selectedBlock = blocks.find(b => b.instanceId === selectedBlockId) || null;

  // Handle dropping new blocks
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!dragType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 70;
    const y = e.clientY - rect.top - 30;

    const definition = BLOCK_DEFINITIONS.find(d => d.type === dragType);
    if (!definition) return;

    const newBlock: PlacedBlock = {
      ...definition,
      id: `${definition.type}-${Date.now()}`,
      instanceId: `${definition.type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      x: Math.max(0, x),
      y: Math.max(0, y)
    };

    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.instanceId);
    setDragType(null);
    toast.success(`Added ${definition.name} block`);
  }, [dragType]);

  // Handle block dragging
  const handleBlockDragStart = useCallback((e: React.MouseEvent, blockId: string) => {
    const block = blocks.find(b => b.instanceId === blockId);
    if (!block) return;
    
    setDraggingBlock(blockId);
    setDragOffset({
      x: e.clientX - block.x,
      y: e.clientY - block.y
    });
  }, [blocks]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    if (draggingBlock) {
      setBlocks(prev => prev.map(b => 
        b.instanceId === draggingBlock
          ? { ...b, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
          : b
      ));
    }
  }, [draggingBlock, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setDraggingBlock(null);
    if (pendingConnection) {
      setPendingConnection(null);
    }
  }, [pendingConnection]);

  // Connection handling
  const handleStartConnection = useCallback((blockId: string, port: string, isOutput: boolean) => {
    if (!isOutput) return;
    
    const block = blocks.find(b => b.instanceId === blockId);
    if (!block || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const portIndex = block.outputs.indexOf(port);
    
    setPendingConnection({
      fromBlock: blockId,
      fromPort: port,
      startX: block.x + 140,
      startY: block.y + 40 + (portIndex * 18)
    });
  }, [blocks]);

  const handleEndConnection = useCallback((toBlockId: string, toPort: string) => {
    if (!pendingConnection) return;
    if (pendingConnection.fromBlock === toBlockId) return;

    const existingConnection = connections.find(
      c => c.toBlock === toBlockId && c.toPort === toPort
    );
    if (existingConnection) {
      toast.error('Port already connected');
      setPendingConnection(null);
      return;
    }

    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      fromBlock: pendingConnection.fromBlock,
      fromPort: pendingConnection.fromPort,
      toBlock: toBlockId,
      toPort: toPort
    };

    setConnections(prev => [...prev, newConnection]);
    setPendingConnection(null);
    toast.success('Connection created');
  }, [pendingConnection, connections]);

  // Block operations
  const handleUpdateParams = useCallback((blockId: string, params: Record<string, number | string>) => {
    setBlocks(prev => prev.map(b => 
      b.instanceId === blockId ? { ...b, params } : b
    ));
  }, []);

  const handleDeleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(b => b.instanceId !== blockId));
    setConnections(prev => prev.filter(c => c.fromBlock !== blockId && c.toBlock !== blockId));
    setSelectedBlockId(null);
    toast.success('Block deleted');
  }, []);

  const handleDuplicateBlock = useCallback((blockId: string) => {
    const block = blocks.find(b => b.instanceId === blockId);
    if (!block) return;

    const newBlock: PlacedBlock = {
      ...block,
      id: `${block.type}-${Date.now()}`,
      instanceId: `${block.type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      x: block.x + 20,
      y: block.y + 20
    };

    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.instanceId);
    toast.success('Block duplicated');
  }, [blocks]);

  // Generate simulation data during simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSimProgress(prev => {
        const next = prev + (100 / (simDuration * 10)) * simSpeed;
        
        // Generate simulated data point
        const time = (next / 100) * simDuration;
        const newDataPoint: CSVDataPoint = {
          time,
          RPM: 3000 + Math.sin(time * 0.5) * 1000 + Math.random() * 200,
          Torque: 5 + Math.sin(time * 0.3) * 2 + Math.random() * 0.5,
          Temp: 25 + time * 2 + Math.random() * 5,
          Voltage: 22.2 - time * 0.1 + Math.random() * 0.3,
          Current: 15 + Math.sin(time * 0.4) * 5 + Math.random() * 2,
          AccelX: Math.sin(time * 2) * 0.5 + Math.random() * 0.1,
          AccelY: Math.cos(time * 2) * 0.5 + Math.random() * 0.1,
          AccelZ: 9.8 + Math.random() * 0.05
        };
        setSimulationData(prev => [...prev, newDataPoint]);
        
        if (next >= 100) {
          setIsSimulating(false);
          toast.success('Simulation complete');
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isSimulating, simSpeed, simDuration]);

  // CSV Data handlers
  const handleImportDataset = useCallback((dataset: CSVDataset) => {
    setDatasets(prev => [...prev, dataset]);
  }, []);

  const handleToggleDatasetVisibility = useCallback((datasetId: string) => {
    setDatasets(prev => prev.map(ds => 
      ds.id === datasetId ? { ...ds, visible: !ds.visible } : ds
    ));
  }, []);

  const handleDeleteDataset = useCallback((datasetId: string) => {
    setDatasets(prev => prev.filter(ds => ds.id !== datasetId));
    toast.success('Dataset removed');
  }, []);

  const getConnectionCoords = useCallback((conn: Connection) => {
    const fromBlock = blocks.find(b => b.instanceId === conn.fromBlock);
    const toBlock = blocks.find(b => b.instanceId === conn.toBlock);
    if (!fromBlock || !toBlock) return null;

    const fromPortIndex = fromBlock.outputs.indexOf(conn.fromPort);
    const toPortIndex = toBlock.inputs.indexOf(conn.toPort);

    return {
      x1: fromBlock.x + 140,
      y1: fromBlock.y + 40 + (fromPortIndex * 18),
      x2: toBlock.x,
      y2: toBlock.y + 40 + (toPortIndex * 18)
    };
  }, [blocks]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="h-14 bg-card/80 backdrop-blur-sm border-b border-border flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/workbench')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workbench
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-lg font-semibold text-foreground">QUADMOUNT Block Editor</h1>
          <span className="text-xs px-2 py-0.5 rounded bg-product-quadmount/20 text-product-quadmount">
            Simulink-Style
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CSVDataManager
            datasets={datasets}
            onImport={handleImportDataset}
            onExport={() => {}}
            onToggleVisibility={handleToggleDatasetVisibility}
            onDelete={handleDeleteDataset}
            simulationData={simulationData}
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowChart(!showChart)}
          >
            <ChartLine className="w-4 h-4 mr-2" />
            {showChart ? 'Hide Chart' : 'Show Chart'}
          </Button>
          <Button variant="default" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Data Overlay Chart */}
      {showChart && (datasets.length > 0 || simulationData.length > 0) && (
        <div className="px-4 py-2 bg-background border-b border-border">
          <DataOverlayChart
            datasets={datasets}
            simulationData={simulationData}
            selectedChannel={selectedChannel}
            onChannelChange={setSelectedChannel}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <BlockPalette onDragStart={setDragType} />
        
        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 relative overflow-auto bg-gradient-to-br from-background to-muted/30"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={() => setSelectedBlockId(null)}
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          {/* SVG layer for connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map(conn => {
              const coords = getConnectionCoords(conn);
              if (!coords) return null;
              return (
                <ConnectionLine
                  key={conn.id}
                  {...coords}
                  isActive={isSimulating}
                />
              );
            })}
            {/* Pending connection line */}
            {pendingConnection && (
              <ConnectionLine
                x1={pendingConnection.startX}
                y1={pendingConnection.startY}
                x2={mousePos.x}
                y2={mousePos.y}
                color="hsl(var(--muted-foreground))"
              />
            )}
          </svg>

          {/* Blocks */}
          {blocks.map(block => (
            <BlockNode
              key={block.instanceId}
              block={block}
              isSelected={block.instanceId === selectedBlockId}
              isSimulating={isSimulating}
              onSelect={() => setSelectedBlockId(block.instanceId)}
              onStartConnection={handleStartConnection}
              onEndConnection={handleEndConnection}
              onDragStart={(e) => handleBlockDragStart(e, block.instanceId)}
            />
          ))}

          {/* Empty state */}
          {blocks.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-muted-foreground text-lg">Drag components from the palette</p>
                <p className="text-muted-foreground/60 text-sm mt-1">Connect blocks by dragging from output ports to input ports</p>
              </div>
            </div>
          )}
        </div>

        <BlockProperties
          block={selectedBlock}
          onUpdate={handleUpdateParams}
          onDelete={handleDeleteBlock}
          onDuplicate={handleDuplicateBlock}
        />
      </div>

      {/* Simulation panel */}
      <SimulationPanel
        isRunning={isSimulating}
        progress={simProgress}
        speed={simSpeed}
        duration={simDuration}
        onStart={() => setIsSimulating(true)}
        onPause={() => setIsSimulating(false)}
        onReset={() => { setIsSimulating(false); setSimProgress(0); setSimulationData([]); }}
        onSpeedChange={setSimSpeed}
        onDurationChange={setSimDuration}
      />
    </div>
  );
};

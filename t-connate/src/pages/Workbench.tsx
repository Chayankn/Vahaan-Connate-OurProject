import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { GlobalToolbar } from "@/components/GlobalToolbar";
import { StatusBar } from "@/components/StatusBar";
import { Toolbox } from "@/components/Toolbox";
import { WorkbenchCanvas } from "@/components/WorkbenchCanvas";
import { PropertyInspector } from "@/components/PropertyInspector";
import { AICopilot } from "@/components/AICopilot";
import { LiveGraph } from "@/components/LiveGraph";
import { JoystickController } from "@/components/JoystickController";
import {
  ProductNode,
  ProductType,
  generateSparklineData,
  productDefinitions,
  TestDataPoint
} from "@/data/sampleData";
import {
  PanelLeftClose,
  PanelRightClose,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 🔹 Backend API
const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Control inputs interface
interface ControlInputs {
  pitch: number;
  roll: number;
  throttle: number;
  yaw: number;
}

const Workbench = () => {
  const [projectName, setProjectName] = useState("Motor Efficiency Study");
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [nodes, setNodes] = useState<ProductNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showCopilot, setShowCopilot] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showGraphs, setShowGraphs] = useState(true);

  const [controlInputs, setControlInputs] = useState<ControlInputs>({
    pitch: 0,
    roll: 0,
    throttle: 0,
    yaw: 50,
  });

  const [simulationData, setSimulationData] = useState<TestDataPoint[]>([]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const handleJoystickMove = useCallback((x: number, y: number) => {
    setControlInputs(prev => ({ ...prev, roll: x, pitch: y }));
  }, []);

  const handleThrottleChange = useCallback((value: number) => {
    setControlInputs(prev => ({ ...prev, throttle: value }));
  }, []);

  const handleYawChange = useCallback((value: number) => {
    setControlInputs(prev => ({ ...prev, yaw: value }));
  }, []);

  // ✅ REAL BACKEND DATA (REPLACES SIMULATION)
  useEffect(() => {
    if (!selectedNode || !isRunning) return;

    const interval = setInterval(() => {
      api
        .get(`/devices/${selectedNode.id}/latest`, {
          params: { limit: 20 }
        })
        .then(res => {
          setSimulationData(res.data.reverse());
        })
        .catch(err => console.error(err));
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedNode, isRunning]);

  const handleAddNode = (type: ProductType) => {
    const newNode: ProductNode = {
      id: `node-${Date.now()}`,
      type,
      name: `${productDefinitions[type].label}-${nodes.length + 1}`,
      x: 100 + nodes.length * 30,
      y: 100 + nodes.length * 30,
      status: "idle",
      sparklineData: generateSparklineData(20),
    };

    setNodes([...nodes, newNode]);
    setSelectedNodeId(newNode.id);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <GlobalToolbar
        projectName={projectName}
        onProjectNameChange={setProjectName}
        isAutoMode={isAutoMode}
        onAutoModeToggle={() => setIsAutoMode(!isAutoMode)}
        isRunning={isRunning}
        onRunToggle={() => setIsRunning(!isRunning)}
      />

      <div className="flex-1 flex overflow-hidden">
        <div
          className={cn(
            "w-72 border-r border-border bg-card/50 flex flex-col transition-all duration-300",
            !showLeftPanel && "w-0 opacity-0 overflow-hidden"
          )}
        >
          <Toolbox
            onAddNode={handleAddNode}
            onOpenCopilot={() => setShowCopilot(true)}
          />
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-l-none"
          onClick={() => setShowLeftPanel(!showLeftPanel)}
          style={{ left: showLeftPanel ? "288px" : "0" }}
        >
          <PanelLeftClose
            className={cn("w-4 h-4 transition-transform", !showLeftPanel && "rotate-180")}
          />
        </Button>

        <div className="flex-1 flex flex-col min-w-0">
          <div className={cn("flex-1", showGraphs && "flex-[2]")}>
            <WorkbenchCanvas
              nodes={nodes}
              onNodesChange={setNodes}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
            />
          </div>

          {/* 🎮 Joystick + Control Inputs */}
          <div className="flex items-center justify-center gap-6 py-3 border-t border-border bg-card/50">
            <JoystickController
              onMove={handleJoystickMove}
              onThrottleChange={handleThrottleChange}
              onYawChange={handleYawChange}
              size={100}
            />
            <div className="text-xs text-muted-foreground space-y-1 bg-card/80 border border-border rounded-lg p-3">
              <div className="font-medium text-foreground mb-2">Control Inputs</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>Pitch: <span className="text-primary font-mono">{controlInputs.pitch.toFixed(2)}</span></div>
                <div>Roll: <span className="text-primary font-mono">{controlInputs.roll.toFixed(2)}</span></div>
                <div>Throttle: <span className="text-primary font-mono">{controlInputs.throttle}%</span></div>
                <div>Yaw: <span className="text-primary font-mono">{controlInputs.yaw}%</span></div>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mx-auto -my-3 z-10 relative"
            onClick={() => setShowGraphs(!showGraphs)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showGraphs ? "Hide Graphs" : "Show Graphs"}
          </Button>

          <div
            className={cn(
              "border-t border-border bg-card/30 transition-all duration-300",
              showGraphs ? "flex-1 p-4" : "h-0 p-0 overflow-hidden opacity-0"
            )}
          >
            <div className="h-full grid grid-cols-3 gap-3">
              <LiveGraph title="RPM & Thrust" data={simulationData} metrics={["rpm", "thrust_N"]} />
              <LiveGraph title="Power & Temperature" data={simulationData} metrics={["power_W", "temperature_C"]} />
              <LiveGraph title="Torque" data={simulationData} metrics={["torque_Nm"]} />
              <LiveGraph title="Noise Level" data={simulationData} metrics={["noise_dB"]} />
              <LiveGraph title="Vibration" data={simulationData} metrics={["vibration_g"]} />
              <LiveGraph title="Current Draw" data={simulationData} metrics={["current_A"]} />
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-r-none"
          onClick={() => setShowRightPanel(!showRightPanel)}
          style={{ right: showRightPanel ? "320px" : "0" }}
        >
          <PanelRightClose
            className={cn("w-4 h-4 transition-transform", !showRightPanel && "rotate-180")}
          />
        </Button>

        <Card
          variant="glass"
          className={cn(
            "w-80 border-l border-border rounded-none transition-all duration-300",
            !showRightPanel && "w-0 opacity-0 overflow-hidden"
          )}
        >
          <PropertyInspector node={selectedNode} />
        </Card>
      </div>

      <StatusBar />
      <AICopilot isOpen={showCopilot} onClose={() => setShowCopilot(false)} />
    </div>
  );
};

export default Workbench;
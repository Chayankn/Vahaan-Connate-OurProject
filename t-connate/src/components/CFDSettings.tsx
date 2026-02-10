import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, Waves, Wind, Box, Cpu } from "lucide-react";

interface CFDSettingsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CFDSettings({ open, onOpenChange }: CFDSettingsProps) {
  const [meshDensity, setMeshDensity] = useState([50]);
  const [turbulenceModel, setTurbulenceModel] = useState("k-epsilon");
  const [solverType, setSolverType] = useState("pressure-based");
  const [enableAdaptiveMesh, setEnableAdaptiveMesh] = useState(true);
  const [maxIterations, setMaxIterations] = useState("1000");
  const [convergenceCriteria, setConvergenceCriteria] = useState("1e-6");
  const [timeStep, setTimeStep] = useState("0.001");
  const [enableParallel, setEnableParallel] = useState(true);
  const [coreCount, setCoreCount] = useState("8");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            CFD Simulation Settings
          </DialogTitle>
          <DialogDescription>
            Configure computational fluid dynamics parameters for accurate simulations
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="mesh" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mesh" className="flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5" />
              Mesh
            </TabsTrigger>
            <TabsTrigger value="physics" className="flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5" />
              Physics
            </TabsTrigger>
            <TabsTrigger value="boundary" className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5" />
              Boundary
            </TabsTrigger>
            <TabsTrigger value="solver" className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              Solver
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mesh" className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Mesh Density</Label>
                  <span className="text-sm text-muted-foreground">{meshDensity[0]}%</span>
                </div>
                <Slider
                  value={meshDensity}
                  onValueChange={setMeshDensity}
                  min={10}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-muted-foreground">
                  Higher density = more accurate results but longer computation time
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <Label>Adaptive Mesh Refinement</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Automatically refine mesh in high-gradient regions
                  </p>
                </div>
                <Switch
                  checked={enableAdaptiveMesh}
                  onCheckedChange={setEnableAdaptiveMesh}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mesh Type</Label>
                  <Select defaultValue="hybrid">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="structured">Structured</SelectItem>
                      <SelectItem value="unstructured">Unstructured</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cell Type</Label>
                  <Select defaultValue="polyhedral">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tetrahedral">Tetrahedral</SelectItem>
                      <SelectItem value="hexahedral">Hexahedral</SelectItem>
                      <SelectItem value="polyhedral">Polyhedral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Boundary Layers</Label>
                  <Input type="number" defaultValue="5" min={1} max={20} />
                </div>
                <div className="space-y-2">
                  <Label>First Layer Height (mm)</Label>
                  <Input type="number" defaultValue="0.01" step="0.001" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="physics" className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Turbulence Model</Label>
                <Select value={turbulenceModel} onValueChange={setTurbulenceModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laminar">Laminar</SelectItem>
                    <SelectItem value="k-epsilon">k-ε (Standard)</SelectItem>
                    <SelectItem value="k-omega">k-ω SST</SelectItem>
                    <SelectItem value="spalart-allmaras">Spalart-Allmaras</SelectItem>
                    <SelectItem value="les">Large Eddy Simulation (LES)</SelectItem>
                    <SelectItem value="des">Detached Eddy Simulation (DES)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Density (kg/m³)</Label>
                  <Input type="number" defaultValue="1.225" step="0.001" />
                </div>
                <div className="space-y-2">
                  <Label>Viscosity (Pa·s)</Label>
                  <Input type="number" defaultValue="1.81e-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Temperature (K)</Label>
                  <Input type="number" defaultValue="288.15" />
                </div>
                <div className="space-y-2">
                  <Label>Pressure (Pa)</Label>
                  <Input type="number" defaultValue="101325" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <Label>Compressibility</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enable for high Mach number flows
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <Label>Heat Transfer</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Include thermal energy equations
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="boundary" className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border bg-secondary/20">
                <h4 className="font-medium mb-3">Inlet Conditions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Velocity (m/s)</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Turbulence Intensity (%)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-secondary/20">
                <h4 className="font-medium mb-3">Outlet Conditions</h4>
                <div className="space-y-2">
                  <Label>Boundary Type</Label>
                  <Select defaultValue="pressure-outlet">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pressure-outlet">Pressure Outlet</SelectItem>
                      <SelectItem value="outflow">Outflow</SelectItem>
                      <SelectItem value="velocity-outlet">Velocity Outlet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-secondary/20">
                <h4 className="font-medium mb-3">Wall Conditions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Wall Type</Label>
                    <Select defaultValue="no-slip">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-slip">No-Slip</SelectItem>
                        <SelectItem value="slip">Slip</SelectItem>
                        <SelectItem value="moving">Moving Wall</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Roughness Height (mm)</Label>
                    <Input type="number" defaultValue="0" step="0.001" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="solver" className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Solver Type</Label>
                <Select value={solverType} onValueChange={setSolverType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pressure-based">Pressure-Based</SelectItem>
                    <SelectItem value="density-based">Density-Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Iterations</Label>
                  <Input
                    type="number"
                    value={maxIterations}
                    onChange={(e) => setMaxIterations(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Convergence Criteria</Label>
                  <Input
                    value={convergenceCriteria}
                    onChange={(e) => setConvergenceCriteria(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Time Step (s)</Label>
                <Input
                  value={timeStep}
                  onChange={(e) => setTimeStep(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  For transient simulations only
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <Label>Parallel Processing</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Distribute computation across multiple cores
                  </p>
                </div>
                <Switch
                  checked={enableParallel}
                  onCheckedChange={setEnableParallel}
                />
              </div>

              {enableParallel && (
                <div className="space-y-2">
                  <Label>Number of Cores</Label>
                  <Input
                    type="number"
                    value={coreCount}
                    onChange={(e) => setCoreCount(e.target.value)}
                    min={1}
                    max={64}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Discretization Scheme</Label>
                <Select defaultValue="second-order">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first-order">First Order Upwind</SelectItem>
                    <SelectItem value="second-order">Second Order Upwind</SelectItem>
                    <SelectItem value="quick">QUICK</SelectItem>
                    <SelectItem value="muscl">MUSCL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Cancel
          </Button>
          <Button variant="glow" onClick={() => onOpenChange?.(false)}>
            Apply Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

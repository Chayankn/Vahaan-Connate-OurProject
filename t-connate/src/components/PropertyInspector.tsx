import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductNode, ProductType, productDefinitions } from "@/data/sampleData";
import { StatusBadge } from "./StatusBadge";
import { Settings, Upload, Play, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyInspectorProps {
  node: ProductNode | null;
  onUpdate?: (node: ProductNode) => void;
}

const testMetrics = [
  { id: 'thrust', label: 'Thrust', unit: 'N' },
  { id: 'power', label: 'Power', unit: 'W' },
  { id: 'rpm', label: 'RPM', unit: 'rpm' },
  { id: 'torque', label: 'Torque', unit: 'Nm' },
  { id: 'noise', label: 'Noise', unit: 'dB' },
  { id: 'vibration', label: 'Vibration', unit: 'g' },
];

export function PropertyInspector({ node, onUpdate }: PropertyInspectorProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['config', 'metrics']);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['thrust', 'power', 'rpm']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  if (!node) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center">
        <div className="text-muted-foreground">
          <Settings className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Select a node to view its properties</p>
        </div>
      </div>
    );
  }

  const definition = productDefinitions[node.type];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="p-4 border-b border-border sticky top-0 bg-card/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{
              backgroundColor: `hsl(var(--${node.type}) / 0.2)`,
            }}
          >
            {definition.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{node.name}</h3>
            <p className="text-xs text-muted-foreground">{definition.label}</p>
          </div>
          <StatusBadge status={node.status} size="sm" />
        </div>
      </div>

      {/* Configuration Section */}
      <div className="border-b border-border">
        <button
          className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
          onClick={() => toggleSection('config')}
        >
          <span className="font-medium text-sm">Configuration</span>
          {expandedSections.includes('config') ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {expandedSections.includes('config') && (
          <div className="px-4 pb-4 space-y-4 animate-slide-in-up">
            <div className="space-y-2">
              <Label className="text-xs">Motor Type</Label>
              <Input placeholder="e.g., T-Motor U8 KV100" defaultValue="T-Motor U8 KV100" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">ESC Rating</Label>
                <Input placeholder="e.g., 60A" defaultValue="60A" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Battery</Label>
                <Input placeholder="e.g., 6S 5000mAh" defaultValue="6S 5000mAh" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Thrust Range (N)</Label>
                <Input placeholder="0-50" defaultValue="0-50" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">RPM Limits</Label>
                <Input placeholder="0-8000" defaultValue="0-8000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Test Duration</Label>
                <Input placeholder="e.g., 10 min" defaultValue="10 min" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Sampling Rate</Label>
                <Input placeholder="e.g., 100 Hz" defaultValue="100 Hz" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CAD Upload Section */}
      <div className="border-b border-border">
        <button
          className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
          onClick={() => toggleSection('cad')}
        >
          <span className="font-medium text-sm">Propeller CAD</span>
          {expandedSections.includes('cad') ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {expandedSections.includes('cad') && (
          <div className="px-4 pb-4 space-y-3 animate-slide-in-up">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drop STEP/IGES/STL file or click to upload
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports .step, .iges, .stl, .obj formats
            </p>
          </div>
        )}
      </div>

      {/* Test Metrics Section */}
      <div className="border-b border-border">
        <button
          className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
          onClick={() => toggleSection('metrics')}
        >
          <span className="font-medium text-sm">Test Metrics</span>
          {expandedSections.includes('metrics') ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {expandedSections.includes('metrics') && (
          <div className="px-4 pb-4 animate-slide-in-up">
            <div className="grid grid-cols-2 gap-2">
              {testMetrics.map((metric) => (
                <label
                  key={metric.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                    selectedMetrics.includes(metric.id)
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-secondary/50 border border-transparent hover:border-border"
                  )}
                >
                  <Checkbox
                    checked={selectedMetrics.includes(metric.id)}
                    onCheckedChange={() => toggleMetric(metric.id)}
                  />
                  <span className="text-sm">{metric.label}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {metric.unit}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2">
        <Button variant="glow" className="w-full" size="lg">
          <Play className="w-4 h-4 mr-2" />
          Run Live Test
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Calibrate
          </Button>
          <Button variant="secondary" className="w-full">
            Run CFD
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState, useCallback, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Wind, 
  Gauge, 
  ArrowRight, 
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Loader2,
  Box,
  Eye
} from "lucide-react";
import { CFDScene } from "./CFDScene";
import { toast } from "@/hooks/use-toast";

interface CFDViewerProps {
  className?: string;
}

export function CFDViewer({ className }: CFDViewerProps) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStreamlines, setShowStreamlines] = useState(true);
  const [showPressure, setShowPressure] = useState(false);
  const [showVelocity, setShowVelocity] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState([1]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['obj', 'stl'].includes(extension || '')) {
      toast({
        title: "Unsupported format",
        description: "Please upload an OBJ or STL file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result;
      
      try {
        if (extension === 'obj') {
          const loader = new OBJLoader();
          const object = loader.parse(contents as string);
          
          // Get the first mesh geometry
          object.traverse((child) => {
            if (child instanceof THREE.Mesh && child.geometry) {
              setGeometry(child.geometry);
            }
          });
        } else if (extension === 'stl') {
          const loader = new STLLoader();
          const geo = loader.parse(contents as ArrayBuffer);
          setGeometry(geo);
        }

        toast({
          title: "Model loaded",
          description: `Successfully loaded ${file.name}`,
        });
      } catch (error) {
        console.error('Error loading file:', error);
        toast({
          title: "Error loading file",
          description: "Failed to parse the CAD file",
          variant: "destructive",
        });
      }

      setIsLoading(false);
    };

    if (extension === 'obj') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const handleReset = useCallback(() => {
    setGeometry(null);
    setFileName(null);
    setShowStreamlines(true);
    setShowPressure(false);
    setShowVelocity(false);
    setAnimationSpeed([1]);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  return (
    <Card 
      variant="glass" 
      className={`relative overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : ''} ${className}`}
    >
      {/* Toolbar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-3 flex items-center justify-between bg-gradient-to-b from-background/90 to-transparent">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Box className="w-4 h-4 text-primary" />
            CFD Viewer
          </h3>
          {fileName && (
            <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
              {fileName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label>
            <input
              type="file"
              accept=".obj,.stl"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="outline" size="sm" className="cursor-pointer" asChild>
              <span>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span className="ml-2">Upload CAD</span>
              </span>
            </Button>
          </label>

          <Button variant="ghost" size="icon-sm" onClick={handleReset} title="Reset">
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="icon-sm" onClick={toggleFullscreen} title="Fullscreen">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className={`${isFullscreen ? 'h-full' : 'h-[500px]'} w-full`}>
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
          <Suspense fallback={null}>
            <CFDScene
              geometry={geometry}
              showStreamlines={showStreamlines}
              showPressure={showPressure}
              showVelocity={showVelocity}
              animationSpeed={animationSpeed[0]}
            />
            <Environment preset="studio" />
          </Suspense>
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={20}
          />
        </Canvas>
      </div>

      {/* Controls Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-background/95 via-background/80 to-transparent">
        <div className="flex flex-wrap items-center gap-6">
          {/* Visualization toggles */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch 
                id="streamlines" 
                checked={showStreamlines}
                onCheckedChange={setShowStreamlines}
              />
              <Label htmlFor="streamlines" className="text-xs flex items-center gap-1.5 cursor-pointer">
                <Wind className="w-3.5 h-3.5 text-primary" />
                Streamlines
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch 
                id="pressure" 
                checked={showPressure}
                onCheckedChange={setShowPressure}
              />
              <Label htmlFor="pressure" className="text-xs flex items-center gap-1.5 cursor-pointer">
                <Gauge className="w-3.5 h-3.5 text-motion" />
                Pressure
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch 
                id="velocity" 
                checked={showVelocity}
                onCheckedChange={setShowVelocity}
              />
              <Label htmlFor="velocity" className="text-xs flex items-center gap-1.5 cursor-pointer">
                <ArrowRight className="w-3.5 h-3.5 text-gyro" />
                Velocity
              </Label>
            </div>
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Animation speed */}
          <div className="flex items-center gap-3 min-w-[160px]">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">Speed</Label>
            <Slider
              value={animationSpeed}
              onValueChange={setAnimationSpeed}
              min={0}
              max={3}
              step={0.1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8">{animationSpeed[0].toFixed(1)}x</span>
          </div>

          {/* Legend */}
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Drag to orbit • Scroll to zoom</span>
            </div>
            
            {showPressure && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Pressure:</span>
                <div className="h-3 w-20 rounded-sm" style={{
                  background: 'linear-gradient(to right, hsl(250, 90%, 50%), hsl(180, 90%, 50%), hsl(60, 90%, 50%), hsl(0, 90%, 50%))'
                }} />
                <span className="text-xs text-muted-foreground">Low → High</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading model...</p>
          </div>
        </div>
      )}

      {/* No model placeholder */}
      {!geometry && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <Box className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">
              Upload an OBJ or STL file to visualize CFD data
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Demo visualization is shown with default geometry
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Save,
  FolderOpen,
  Play,
  Pause,
  Settings,
  Undo,
  Redo,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  Settings2,
  Box,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CFDSettings } from "./CFDSettings";
import logo from "@/assets/logo.png";

interface GlobalToolbarProps {
  projectName: string;
  onProjectNameChange?: (name: string) => void;
  isAutoMode?: boolean;
  onAutoModeToggle?: () => void;
  isRunning?: boolean;
  onRunToggle?: () => void;
}

export function GlobalToolbar({
  projectName,
  onProjectNameChange,
  isAutoMode = true,
  onAutoModeToggle,
  isRunning = false,
  onRunToggle,
}: GlobalToolbarProps) {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);
  const [cfdSettingsOpen, setCfdSettingsOpen] = useState(false);

  const handleNameSubmit = () => {
    onProjectNameChange?.(tempName);
    setIsEditingName(false);
  };

  return (
    <>
      <div className="h-14 px-4 flex items-center justify-between bg-card/80 backdrop-blur-sm border-b border-border">
        {/* Left section - Project info & file operations */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-black rounded-md p-1">
              <img src={logo} alt="T-CONNATE" className="w-6 h-auto" />
            </div>
            {isEditingName ? (
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                className="h-8 w-48 text-sm"
                autoFocus
              />
            ) : (
              <button
                className="font-semibold text-sm hover:text-primary transition-colors flex items-center gap-1"
                onClick={() => setIsEditingName(true)}
              >
                {projectName}
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="w-px h-6 bg-border" />

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" title="Save">
              <Save className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Open">
              <FolderOpen className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Undo">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Redo">
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Center section - Main actions */}
        <div className="flex items-center gap-3">
          <Button
            variant={isRunning ? "warning" : "glow"}
            onClick={onRunToggle}
            className="min-w-32"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stop Test
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Live Test
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => navigate('/cfd-viewer')}>
            <Box className="w-4 h-4 mr-2" />
            Run CFD
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setCfdSettingsOpen(true)} title="CFD Settings">
            <Settings2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Right section - Mode toggle & settings */}
        <div className="flex items-center gap-3">
          <button
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              isAutoMode
                ? "bg-primary/20 text-primary"
                : "bg-secondary text-muted-foreground"
            )}
            onClick={onAutoModeToggle}
          >
            {isAutoMode ? (
              <ToggleRight className="w-4 h-4" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
            {isAutoMode ? "Auto" : "Manual"}
          </button>

          <div className="w-px h-6 bg-border" />

          <Button variant="ghost" size="icon-sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CFDSettings open={cfdSettingsOpen} onOpenChange={setCfdSettingsOpen} />
    </>
  );
}

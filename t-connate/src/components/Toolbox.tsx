import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductType, productDefinitions } from "@/data/sampleData";
import {
  Search,
  FileSpreadsheet,
  GitBranch,
  Brain,
  Sliders,
  Bot,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ToolboxProps {
  onAddNode: (type: ProductType) => void;
  onOpenCopilot: () => void;
}

const productTypes: ProductType[] = ['unimount', 'quadmount', 'motion', 'gyro', 'atmos'];

const utilities = [
  { id: 'csv', label: 'CSV Import', icon: FileSpreadsheet },
  { id: 'block', label: 'Block Editor', icon: GitBranch },
  { id: 'ml', label: 'ML Dashboard', icon: Brain },
  { id: 'calibrate', label: 'Calibration', icon: Sliders },
];

const productColors: Record<ProductType, string> = {
  unimount: 'bg-unimount/20 text-unimount border-unimount/40 hover:bg-unimount/30',
  quadmount: 'bg-quadmount/20 text-quadmount border-quadmount/40 hover:bg-quadmount/30',
  motion: 'bg-motion/20 text-motion border-motion/40 hover:bg-motion/30',
  gyro: 'bg-gyro/20 text-gyro border-gyro/40 hover:bg-gyro/30',
  atmos: 'bg-atmos/20 text-atmos border-atmos/40 hover:bg-atmos/30',
};

export function Toolbox({ onAddNode, onOpenCopilot }: ToolboxProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>(['products', 'utilities']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const filteredProducts = productTypes.filter(type =>
    productDefinitions[type].label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    productDefinitions[type].description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Products Section */}
        <div className="border-b border-border">
          <button
            className="w-full flex items-center justify-between p-3 hover:bg-secondary/50 transition-colors"
            onClick={() => toggleSection('products')}
          >
            <span className="font-semibold text-sm">Test Platforms</span>
            {expandedSections.includes('products') ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {expandedSections.includes('products') && (
            <div className="px-3 pb-3 space-y-2 stagger-children">
              {filteredProducts.map((type) => {
                const def = productDefinitions[type];
                return (
                  <button
                    key={type}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border transition-all cursor-grab active:cursor-grabbing",
                      productColors[type]
                    )}
                    onClick={() => onAddNode(type)}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('productType', type);
                    }}
                  >
                    <span className="text-xl">{def.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">{def.label}</div>
                      <div className="text-xs opacity-80">{def.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Utilities Section */}
        <div className="border-b border-border">
          <button
            className="w-full flex items-center justify-between p-3 hover:bg-secondary/50 transition-colors"
            onClick={() => toggleSection('utilities')}
          >
            <span className="font-semibold text-sm">Utilities</span>
            {expandedSections.includes('utilities') ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {expandedSections.includes('utilities') && (
            <div className="px-3 pb-3 space-y-2 stagger-children">
              {utilities.map((util) => (
                <button
                  key={util.id}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-transparent hover:border-border transition-all"
                  onClick={() => {
                    if (util.id === 'block') {
                      navigate('/block-editor');
                    }
                  }}
                >
                  <util.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-sm">{util.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Copilot Button */}
      <div className="p-3 border-t border-border">
        <Button
          variant="glow"
          className="w-full"
          onClick={onOpenCopilot}
        >
          <Bot className="w-4 h-4 mr-2" />
          AI Copilot
        </Button>
      </div>
    </div>
  );
}

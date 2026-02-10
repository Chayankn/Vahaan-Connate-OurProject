import { CFDViewer } from "@/components/CFDViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const CFDViewerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 px-4 flex items-center justify-between bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="T-CONNATE" className="w-6 h-auto" />
            <h1 className="font-semibold">T-CONNATE</h1>
            <span className="text-muted-foreground">/ CFD Viewer</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <CFDViewer className="h-[calc(100vh-8rem)]" />
      </main>
    </div>
  );
};

export default CFDViewerPage;

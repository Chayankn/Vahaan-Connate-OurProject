import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Sparkline } from "@/components/Sparkline";
import { sampleProjects, sampleDevices, generateSparklineData } from "@/data/sampleData";
import {
  Plus,
  FolderOpen,
  Wifi,
  Brain,
  Activity,
  Clock,
  ArrowRight,
  Layers,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">UAV Test-Bed Suite</h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>
          <Button variant="glow" onClick={() => navigate("/workbench")}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Main content - Projects */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card variant="glass" className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Tests Today</p>
                  </div>
                </div>
              </Card>
              <Card variant="glass" className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">94%</p>
                    <p className="text-xs text-muted-foreground">ML Accuracy</p>
                  </div>
                </div>
              </Card>
              <Card variant="glass" className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">4.2h</p>
                    <p className="text-xs text-muted-foreground">Test Hours</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Recent Projects</h2>
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {sampleProjects.map((project) => (
                  <Card
                    key={project.id}
                    variant="interactive"
                    className="p-4 cursor-pointer"
                    onClick={() => navigate("/workbench")}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <FolderOpen className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {project.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{project.nodeCount} nodes</span>
                            <span>•</span>
                            <span>
                              {new Date(project.lastModified).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <StatusBadge
                        status={project.status === 'active' ? 'live' : 'idle'}
                        size="sm"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Devices & ML */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Connected Devices */}
            <Card variant="glass">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Connected Devices</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Wifi className="w-4 h-4 mr-1" />
                    Pair
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {sampleDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <StatusBadge status={device.status} showLabel={false} size="sm" />
                      <div>
                        <p className="text-sm font-medium">{device.name}</p>
                        <p className="text-xs text-muted-foreground">
                          v{device.firmwareVersion} • {device.signalStrength}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ML Status */}
            <Card variant="glass">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">ML Training</CardTitle>
                  <div className="flex items-center gap-1.5 text-xs text-success">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    Active
                  </div>
                </div>
                <CardDescription>
                  Motor efficiency model v2.4
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Training Progress</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: "78%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Loss over epochs</p>
                    <Sparkline
                      data={generateSparklineData(30).map((v, i) => 100 - v - i * 1.5)}
                      color="hsl(var(--success))"
                      height={48}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Copilot Prompt */}
            <Card variant="interactive" className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">AI Copilot Ready</p>
                  <p className="text-xs text-muted-foreground">
                    Get suggestions & optimize tests
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

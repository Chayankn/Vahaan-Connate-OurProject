import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { sampleTestData, TestDataPoint } from "@/data/sampleData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Download, Maximize2, RefreshCw, X } from "lucide-react";

interface LiveGraphProps {
  title?: string;
  data?: TestDataPoint[];
  metrics?: string[];
}

const metricColors: Record<string, string> = {
  rpm: 'hsl(var(--primary))',
  thrust_N: 'hsl(var(--success))',
  power_W: 'hsl(var(--warning))',
  torque_Nm: 'hsl(var(--quadmount))',
  noise_dB: 'hsl(var(--atmos))',
  vibration_g: 'hsl(var(--motion))',
  temperature_C: 'hsl(var(--gyro))',
  current_A: 'hsl(var(--primary))',
};

const metricLabels: Record<string, string> = {
  rpm: 'RPM',
  thrust_N: 'Thrust (N)',
  power_W: 'Power (W)',
  torque_Nm: 'Torque (Nm)',
  noise_dB: 'Noise (dB)',
  vibration_g: 'Vibration (g)',
  temperature_C: 'Temp (°C)',
  current_A: 'Current (A)',
};

export function LiveGraph({
  title = "Live Telemetry",
  data = sampleTestData,
  metrics = ['rpm', 'thrust_N', 'power_W'],
}: LiveGraphProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const chartData = useMemo(() => {
    return data.slice(-50).map((point, index) => ({
      ...point,
      time: index,
    }));
  }, [data]);

  const ChartContent = ({ height = "100%" }: { height?: string | number }) => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          opacity={0.5}
        />
        <XAxis
          dataKey="time"
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
        />
        <Legend
          wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
        />
        {metrics.map((metric) => (
          <Line
            key={metric}
            type="monotone"
            dataKey={metric}
            name={metricLabels[metric] || metric}
            stroke={metricColors[metric] || 'hsl(var(--primary))'}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <Card variant="glass" className="h-full flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Download className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setIsExpanded(true)}>
              <Maximize2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-4">
          <ChartContent />
        </CardContent>
      </Card>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[80vh] p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-[calc(80vh-80px)]">
            <ChartContent height="100%" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

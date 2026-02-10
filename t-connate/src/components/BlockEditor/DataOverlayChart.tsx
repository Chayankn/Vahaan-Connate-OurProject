import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CSVDataset, CSVDataPoint } from './CSVDataManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DataOverlayChartProps {
  datasets: CSVDataset[];
  simulationData: CSVDataPoint[];
  selectedChannel: string;
  onChannelChange: (channel: string) => void;
  isMinimized?: boolean;
}

export const DataOverlayChart: React.FC<DataOverlayChartProps> = ({
  datasets,
  simulationData,
  selectedChannel,
  onChannelChange,
  isMinimized
}) => {
  // Get all available channels from all datasets
  const availableChannels = useMemo(() => {
    const channels = new Set<string>();
    
    datasets.forEach(ds => {
      ds.columns.forEach(col => channels.add(col));
    });
    
    if (simulationData.length > 0) {
      Object.keys(simulationData[0]).forEach(key => {
        if (key !== 'time') channels.add(key);
      });
    }
    
    return Array.from(channels);
  }, [datasets, simulationData]);

  // Merge data for the chart
  const chartData = useMemo(() => {
    const timeMap = new Map<number, Record<string, number>>();
    
    // Add simulation data
    simulationData.forEach(point => {
      const existing = timeMap.get(point.time) || { time: point.time };
      existing[`sim_${selectedChannel}`] = point[selectedChannel] ?? 0;
      timeMap.set(point.time, existing);
    });
    
    // Add visible datasets
    datasets.filter(ds => ds.visible).forEach(ds => {
      ds.data.forEach(point => {
        const roundedTime = Math.round(point.time * 100) / 100;
        const existing = timeMap.get(roundedTime) || { time: roundedTime };
        if (point[selectedChannel] !== undefined) {
          existing[`${ds.name}_${selectedChannel}`] = point[selectedChannel];
        }
        timeMap.set(roundedTime, existing);
      });
    });
    
    return Array.from(timeMap.values()).sort((a, b) => a.time - b.time);
  }, [datasets, simulationData, selectedChannel]);

  if (isMinimized) {
    return null;
  }

  if (availableChannels.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>No data available. Run a simulation or import test data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Data Overlay Comparison</CardTitle>
          <Select value={selectedChannel || availableChannels[0]} onValueChange={onChannelChange}>
            <SelectTrigger className="w-40 h-8">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              {availableChannels.map(channel => (
                <SelectItem key={channel} value={channel}>
                  {channel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 10 }}
              label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fontSize: 10 }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 10 }}
              label={{ value: selectedChannel, angle: -90, position: 'insideLeft', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            
            {/* Simulation data line */}
            {simulationData.length > 0 && (
              <Line
                type="monotone"
                dataKey={`sim_${selectedChannel}`}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                name={`Simulation - ${selectedChannel}`}
              />
            )}
            
            {/* Test data lines */}
            {datasets.filter(ds => ds.visible).map(ds => (
              <Line
                key={ds.id}
                type="monotone"
                dataKey={`${ds.name}_${selectedChannel}`}
                stroke={ds.color}
                strokeWidth={2}
                strokeDasharray={ds.type === 'test' ? '5 5' : undefined}
                dot={false}
                name={`${ds.name} - ${selectedChannel}`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        
        {/* Legend for data types */}
        <div className="flex items-center justify-center gap-6 mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-primary" />
            <span>Simulation (solid)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-muted-foreground" />
            <span>Test Data (dashed)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

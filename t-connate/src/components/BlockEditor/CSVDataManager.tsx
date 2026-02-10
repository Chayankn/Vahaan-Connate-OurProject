import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, FileText, Database, Layers, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export interface CSVDataPoint {
  time: number;
  [key: string]: number;
}

export interface CSVDataset {
  id: string;
  name: string;
  type: 'simulation' | 'test';
  columns: string[];
  data: CSVDataPoint[];
  visible: boolean;
  color: string;
}

interface CSVDataManagerProps {
  datasets: CSVDataset[];
  onImport: (dataset: CSVDataset) => void;
  onExport: (datasetId: string) => void;
  onToggleVisibility: (datasetId: string) => void;
  onDelete: (datasetId: string) => void;
  simulationData?: CSVDataPoint[];
}

const DATASET_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--product-quadmount))',
  'hsl(var(--product-unimount))',
  'hsl(var(--success))',
  'hsl(var(--product-atmos))',
  'hsl(var(--accent))',
];

export const CSVDataManager: React.FC<CSVDataManagerProps> = ({
  datasets,
  onImport,
  onExport,
  onToggleVisibility,
  onDelete,
  simulationData
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewData, setPreviewData] = useState<CSVDataPoint[] | null>(null);
  const [previewColumns, setPreviewColumns] = useState<string[]>([]);
  const [datasetName, setDatasetName] = useState('');
  const [datasetType, setDatasetType] = useState<'simulation' | 'test'>('test');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (content: string): { columns: string[]; data: CSVDataPoint[] } => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have headers and at least one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const timeIndex = headers.findIndex(h => h.toLowerCase() === 'time' || h.toLowerCase() === 't');
    
    if (timeIndex === -1) {
      throw new Error('CSV must have a "time" or "t" column');
    }

    const data: CSVDataPoint[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => parseFloat(v.trim()));
      if (values.some(isNaN)) continue;

      const point: CSVDataPoint = { time: values[timeIndex] };
      headers.forEach((header, idx) => {
        if (idx !== timeIndex) {
          point[header] = values[idx];
        }
      });
      data.push(point);
    }

    const columns = headers.filter((_, idx) => idx !== timeIndex);
    return { columns, data };
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const { columns, data } = parseCSV(content);
      setPreviewData(data);
      setPreviewColumns(columns);
      setDatasetName(file.name.replace('.csv', ''));
      toast.success(`Parsed ${data.length} data points with ${columns.length} channels`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to parse CSV');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = () => {
    if (!previewData || previewColumns.length === 0) {
      toast.error('No data to import');
      return;
    }

    const dataset: CSVDataset = {
      id: `dataset-${Date.now()}`,
      name: datasetName || 'Imported Data',
      type: datasetType,
      columns: previewColumns,
      data: previewData,
      visible: true,
      color: DATASET_COLORS[datasets.length % DATASET_COLORS.length]
    };

    onImport(dataset);
    setPreviewData(null);
    setPreviewColumns([]);
    setDatasetName('');
    toast.success('Dataset imported successfully');
  };

  const generateCSV = (data: CSVDataPoint[], columns: string[]): string => {
    const headers = ['time', ...columns].join(',');
    const rows = data.map(point => 
      [point.time, ...columns.map(col => point[col] ?? 0)].join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const handleExportSimulation = () => {
    if (!simulationData || simulationData.length === 0) {
      toast.error('No simulation data to export');
      return;
    }

    const columns = Object.keys(simulationData[0]).filter(k => k !== 'time');
    const csv = generateCSV(simulationData, columns);
    downloadCSV(csv, 'simulation_results.csv');
    toast.success('Simulation data exported');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Database className="w-4 h-4 mr-2" />
          Data Manager
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            CSV Data Manager
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="import">Import Data</TabsTrigger>
            <TabsTrigger value="datasets">Datasets ({datasets.length})</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          {/* Import Tab */}
          <TabsContent value="import" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Upload a CSV file with test data to overlay on simulation results
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Select CSV File
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                CSV must include a "time" or "t" column. Other columns will be treated as data channels.
              </p>
            </div>

            {previewData && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label className="text-sm">Dataset Name</Label>
                    <input
                      type="text"
                      value={datasetName}
                      onChange={(e) => setDatasetName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-sm"
                      placeholder="Enter dataset name"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Type</Label>
                    <Select value={datasetType} onValueChange={(v) => setDatasetType(v as 'simulation' | 'test')}>
                      <SelectTrigger className="w-32 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="test">Test Data</SelectItem>
                        <SelectItem value="simulation">Simulation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm font-medium mb-2">Preview ({previewData.length} rows)</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {previewColumns.map(col => (
                      <span key={col} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {col}
                      </span>
                    ))}
                  </div>
                  <ScrollArea className="h-40">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Time</TableHead>
                          {previewColumns.slice(0, 5).map(col => (
                            <TableHead key={col} className="text-xs">{col}</TableHead>
                          ))}
                          {previewColumns.length > 5 && (
                            <TableHead className="text-xs">...</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.slice(0, 10).map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-xs font-mono">{row.time.toFixed(3)}</TableCell>
                            {previewColumns.slice(0, 5).map(col => (
                              <TableCell key={col} className="text-xs font-mono">
                                {(row[col] ?? 0).toFixed(3)}
                              </TableCell>
                            ))}
                            {previewColumns.length > 5 && (
                              <TableCell className="text-xs">...</TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>

                <Button onClick={handleImport} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Dataset
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Datasets Tab */}
          <TabsContent value="datasets" className="space-y-4">
            {datasets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No datasets imported yet</p>
                <p className="text-sm">Import CSV files to overlay on simulation</p>
              </div>
            ) : (
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {datasets.map(dataset => (
                    <div
                      key={dataset.id}
                      className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: dataset.color }}
                        />
                        <div>
                          <p className="font-medium text-sm">{dataset.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {dataset.type === 'test' ? 'Test Data' : 'Simulation'} • 
                            {dataset.data.length} points • 
                            {dataset.columns.length} channels
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          <Switch
                            checked={dataset.visible}
                            onCheckedChange={() => onToggleVisibility(dataset.id)}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const csv = generateCSV(dataset.data, dataset.columns);
                            downloadCSV(csv, `${dataset.name}.csv`);
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(dataset.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Simulation Results</p>
                    <p className="text-sm text-muted-foreground">
                      Export current simulation data as CSV
                    </p>
                  </div>
                  <Button onClick={handleExportSimulation} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {datasets.filter(d => d.type === 'test').length > 0 && (
                <div className="p-4 bg-card border border-border rounded-lg">
                  <p className="font-medium mb-3">Test Datasets</p>
                  <div className="space-y-2">
                    {datasets.filter(d => d.type === 'test').map(dataset => (
                      <div key={dataset.id} className="flex items-center justify-between py-2">
                        <span className="text-sm">{dataset.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const csv = generateCSV(dataset.data, dataset.columns);
                            downloadCSV(csv, `${dataset.name}.csv`);
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

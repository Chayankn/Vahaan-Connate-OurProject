// Sample CSV data for UAV Test-Bed demonstrations
export interface TestDataPoint {
  timestamp: string;
  motor_id: string;
  rpm: number;
  thrust_N: number;
  torque_Nm: number;
  voltage_V: number;
  current_A: number;
  power_W: number;
  noise_dB: number;
  vibration_g: number;
  temperature_C: number;
}

// Generate 100 rows of sample test data
export const generateSampleData = (motorId: string = "M1"): TestDataPoint[] => {
  const data: TestDataPoint[] = [];
  const baseTime = new Date("2024-01-15T10:00:00");
  
  for (let i = 0; i < 100; i++) {
    const time = new Date(baseTime.getTime() + i * 1000);
    const rpm = 2000 + Math.sin(i * 0.1) * 500 + i * 40 + Math.random() * 100;
    const thrust = rpm * 0.0015 + Math.random() * 0.5;
    const torque = thrust * 0.08 + Math.random() * 0.02;
    const voltage = 22.2 - (i * 0.01) + Math.random() * 0.3;
    const current = (rpm * 0.005) + Math.random() * 2;
    const power = voltage * current;
    const noise = 60 + (rpm / 100) + Math.random() * 5;
    const vibration = 0.5 + (rpm / 5000) + Math.random() * 0.3;
    const temperature = 25 + (i * 0.15) + Math.random() * 2;

    data.push({
      timestamp: time.toISOString(),
      motor_id: motorId,
      rpm: Math.round(rpm),
      thrust_N: Number(thrust.toFixed(2)),
      torque_Nm: Number(torque.toFixed(3)),
      voltage_V: Number(voltage.toFixed(2)),
      current_A: Number(current.toFixed(2)),
      power_W: Number(power.toFixed(1)),
      noise_dB: Number(noise.toFixed(1)),
      vibration_g: Number(vibration.toFixed(2)),
      temperature_C: Number(temperature.toFixed(1)),
    });
  }
  
  return data;
};

export const sampleTestData = generateSampleData("M1");

// Mini sparkline data for node cards
export const generateSparklineData = (length: number = 20): number[] => {
  const data: number[] = [];
  let value = 50;
  for (let i = 0; i < length; i++) {
    value += (Math.random() - 0.5) * 20;
    value = Math.max(10, Math.min(90, value));
    data.push(value);
  }
  return data;
};

// Product types
export type ProductType = 'unimount' | 'quadmount' | 'motion' | 'gyro' | 'atmos';

export interface ProductNode {
  id: string;
  type: ProductType;
  name: string;
  x: number;
  y: number;
  status: 'idle' | 'live' | 'simulating' | 'error';
  config?: Record<string, any>;
  sparklineData: number[];
}

// Initial product definitions
export const productDefinitions: Record<ProductType, { label: string; description: string; icon: string }> = {
  unimount: {
    label: 'UNIMOUNT',
    description: 'Single motor thrust measurement',
    icon: '🔄',
  },
  quadmount: {
    label: 'QUADMOUNT',
    description: 'Multi-motor synchronized testing',
    icon: '✦',
  },
  motion: {
    label: 'MOTION',
    description: '6DOF rotorcraft dynamics',
    icon: '↻',
  },
  gyro: {
    label: 'GYRO',
    description: 'Fixed wing / VTOL testing',
    icon: '➤',
  },
  atmos: {
    label: 'ATMOS',
    description: 'Environmental wind tunnel',
    icon: '🌀',
  },
};

// Sample connected devices
export interface ConnectedDevice {
  id: string;
  name: string;
  type: ProductType;
  signalStrength: number;
  firmwareVersion: string;
  status: 'connected' | 'disconnected' | 'pairing';
  ipAddress: string;
}

export const sampleDevices: ConnectedDevice[] = [
  {
    id: 'dev-001',
    name: 'UNIMOUNT-A1',
    type: 'unimount',
    signalStrength: 95,
    firmwareVersion: '2.4.1',
    status: 'connected',
    ipAddress: '192.168.1.101',
  },
  {
    id: 'dev-002',
    name: 'QUADMOUNT-B1',
    type: 'quadmount',
    signalStrength: 87,
    firmwareVersion: '2.4.0',
    status: 'connected',
    ipAddress: '192.168.1.102',
  },
  {
    id: 'dev-003',
    name: 'ATMOS-C1',
    type: 'atmos',
    signalStrength: 72,
    firmwareVersion: '2.3.8',
    status: 'disconnected',
    ipAddress: '192.168.1.103',
  },
];

// Sample projects
export interface Project {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  status: 'active' | 'completed' | 'archived';
  nodeCount: number;
}

export const sampleProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'Motor Efficiency Study',
    description: 'Comparative analysis of T-Motor vs Sunnysky motors',
    lastModified: '2024-01-15T14:30:00',
    status: 'active',
    nodeCount: 4,
  },
  {
    id: 'proj-002',
    name: 'Propeller CFD Validation',
    description: 'CFD simulation vs live thrust measurements',
    lastModified: '2024-01-14T09:15:00',
    status: 'active',
    nodeCount: 2,
  },
  {
    id: 'proj-003',
    name: 'Quadcopter Endurance Test',
    description: 'Long-duration battery and thermal analysis',
    lastModified: '2024-01-10T16:45:00',
    status: 'completed',
    nodeCount: 5,
  },
];

// AI Copilot sample messages
export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const sampleCopilotMessages: CopilotMessage[] = [
  {
    id: 'msg-001',
    role: 'assistant',
    content: "Welcome to UAV Test-Bed Suite! I'm your AI Copilot. I can help you plan tests, analyze results, and optimize your configurations. What would you like to work on today?",
    timestamp: new Date().toISOString(),
  },
];

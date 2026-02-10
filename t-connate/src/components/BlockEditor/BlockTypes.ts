export interface BlockType {
  id: string;
  type: 'motor' | 'esc' | 'battery' | 'imu' | 'controller' | 'actuator' | 'filter' | 'logger';
  name: string;
  icon: string;
  color: string;
  inputs: string[];
  outputs: string[];
  params: Record<string, number | string>;
}

export interface PlacedBlock extends BlockType {
  instanceId: string;
  x: number;
  y: number;
}

export interface Connection {
  id: string;
  fromBlock: string;
  fromPort: string;
  toBlock: string;
  toPort: string;
}

export const BLOCK_DEFINITIONS: Omit<BlockType, 'id'>[] = [
  {
    type: 'motor',
    name: 'Motor',
    icon: 'Cog',
    color: 'hsl(var(--product-unimount))',
    inputs: ['PWM', 'Enable'],
    outputs: ['RPM', 'Torque', 'Temp'],
    params: { kv: 920, maxRPM: 8000, resistance: 0.05 }
  },
  {
    type: 'esc',
    name: 'ESC',
    icon: 'Zap',
    color: 'hsl(var(--product-quadmount))',
    inputs: ['Signal', 'Battery+', 'Battery-'],
    outputs: ['PWM', 'Telemetry'],
    params: { maxCurrent: 40, pwmFreq: 48000, protocol: 'DShot600' }
  },
  {
    type: 'battery',
    name: 'Battery',
    icon: 'Battery',
    color: 'hsl(var(--success))',
    inputs: [],
    outputs: ['V+', 'V-', 'SoC'],
    params: { voltage: 22.2, capacity: 5000, cells: 6 }
  },
  {
    type: 'imu',
    name: 'IMU',
    icon: 'Compass',
    color: 'hsl(var(--product-gyro))',
    inputs: ['Power'],
    outputs: ['AccelX', 'AccelY', 'AccelZ', 'GyroX', 'GyroY', 'GyroZ'],
    params: { sampleRate: 1000, accelRange: 16, gyroRange: 2000 }
  },
  {
    type: 'controller',
    name: 'Controller',
    icon: 'Cpu',
    color: 'hsl(var(--accent))',
    inputs: ['Setpoint', 'Feedback'],
    outputs: ['Control'],
    params: { kp: 1.0, ki: 0.1, kd: 0.05, loopRate: 400 }
  },
  {
    type: 'actuator',
    name: 'Actuator',
    icon: 'Move',
    color: 'hsl(var(--product-motion))',
    inputs: ['Command'],
    outputs: ['Position', 'Force'],
    params: { stroke: 50, maxForce: 100, speed: 10 }
  },
  {
    type: 'filter',
    name: 'Filter',
    icon: 'Filter',
    color: 'hsl(var(--muted-foreground))',
    inputs: ['In'],
    outputs: ['Out'],
    params: { type: 'lowpass', cutoff: 100, order: 2 }
  },
  {
    type: 'logger',
    name: 'Logger',
    icon: 'FileText',
    color: 'hsl(var(--product-atmos))',
    inputs: ['Data1', 'Data2', 'Data3', 'Data4'],
    outputs: [],
    params: { sampleRate: 100, format: 'CSV', bufferSize: 1000 }
  }
];


export interface SystemModule {
  id: string;
  name: string;
  description: string;
  responsibilities: string[];
  codeSnippet: string;
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum PerformanceMode {
  WALKING = 'WALKING',
  STATIONARY = 'STATIONARY',
  IDLE = 'IDLE',
  THERMAL_THROTTLING = 'THERMAL_THROTTLING'
}

export interface UXRule {
  title: string;
  rule: string;
  rationale: string;
}

export interface PerformanceTarget {
  metric: string;
  value: string;
  description: string;
}

export interface ModelMetadata {
  version: string;
  accuracy: string;
  size: string;
  date: string;
}

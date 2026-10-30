export interface MetricDataPoint {
  timestamp: string;
  time: string;
  cpu: number;
  memory: number;
  network?: number;
}

export interface ActivityEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
  type: 'ai' | 'k8s' | 'incident' | 'system';
  severity?: 'info' | 'warning' | 'critical';
}

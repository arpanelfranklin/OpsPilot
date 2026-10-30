export type HealthStatus = 'Healthy' | 'Degraded' | 'Critical';
export type Environment = 'Development' | 'Staging' | 'Production';

export interface ClusterInfo {
  id: string;
  name: string;
  environment: Environment;
  status: HealthStatus;
  k8sVersion: string;
  namespacesCount: number;
  nodeCount: number;
  podCount: {
    running: number;
    total: number;
  };
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  networkThroughput: string;
  uptime: string;
}

export interface NodeItem {
  id: string;
  name: string;
  status: 'Ready' | 'NotReady' | 'SchedulingDisabled';
  roles: string[];
  cpuUsagePercent: number;
  cpuCores: number;
  memoryUsagePercent: number;
  memoryCapacityGiB: number;
  podCount: number;
  podCapacity: number;
  kubeletVersion: string;
  ipAddress: string;
  zone: string;
}

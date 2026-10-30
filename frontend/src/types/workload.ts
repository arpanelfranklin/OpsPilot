import { HealthStatus } from './cluster';

export interface WorkloadEvent {
  id: string;
  type: 'Normal' | 'Warning';
  reason: string;
  message: string;
  timestamp: string;
  count: number;
}

export interface DeploymentItem {
  id: string;
  name: string;
  namespace: string;
  desiredReplicas: number;
  readyReplicas: number;
  status: HealthStatus;
  image: string;
  version: string;
  restarts: number;
  cpuRequest: string;
  cpuLimit: string;
  memoryRequest: string;
  memoryLimit: string;
  createdAt: string;
  strategy: string;
  events: WorkloadEvent[];
}

export interface PodItem {
  id: string;
  name: string;
  namespace: string;
  node: string;
  status: 'Running' | 'CrashLoopBackOff' | 'Pending' | 'Error' | 'Completed' | 'Terminating';
  readyContainers: string; // e.g. "1/1"
  restarts: number;
  cpu: string;
  memory: string;
  ip: string;
  age: string;
  events: WorkloadEvent[];
}

export interface ServicePort {
  name: string;
  protocol: string;
  port: number;
  targetPort: number | string;
  nodePort?: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  namespace: string;
  type: 'ClusterIP' | 'NodePort' | 'LoadBalancer';
  clusterIP: string;
  externalIP?: string;
  ports: ServicePort[];
  endpointsCount: number;
  selector: Record<string, string>;
  age: string;
}

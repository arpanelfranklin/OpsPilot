// TypeScript interfaces for the Kubernetes Live Cluster Explorer

export interface K8sConnection {
  connected: boolean;
  clusterName?: string;
  kubernetesVersion?: string;
  dataSource: 'LIVE' | 'UNAVAILABLE';
  message: string;
}

export interface K8sNamespace {
  name: string;
  status: string;
  creationTimestamp?: string;
}

export interface K8sNode {
  name: string;
  status: string;
  roles: string;
  kubeletVersion?: string;
  operatingSystem?: string;
  architecture?: string;
  capacity: Record<string, string>;
  allocatable: Record<string, string>;
  creationTimestamp?: string;
}

export interface K8sContainer {
  name: string;
  image: string;
  state: 'Running' | 'Waiting' | 'Terminated' | 'Unknown';
  waitingReason?: string;
  ready: boolean;
  restartCount: number;
  resourceRequests: Record<string, string>;
  resourceLimits: Record<string, string>;
}

export interface K8sPod {
  name: string;
  namespace: string;
  phase: string;
  displayStatus: string;
  podIP?: string;
  nodeName?: string;
  restartCount: number;
  creationTimestamp?: string;
  labels: Record<string, string>;
  containers: K8sContainer[];
  ready: boolean;
}

export interface K8sDeployment {
  name: string;
  namespace: string;
  desiredReplicas: number;
  readyReplicas: number;
  availableReplicas: number;
  updatedReplicas: number;
  images: string[];
  creationTimestamp?: string;
  condition?: string;
}

export interface K8sService {
  name: string;
  namespace: string;
  type: string;
  clusterIP?: string;
  externalIPs: string[];
  ports: string[];
  selector: Record<string, string>;
  creationTimestamp?: string;
}

export interface K8sEvent {
  name: string;
  namespace: string;
  involvedObject?: string;
  reason?: string;
  message?: string;
  type: 'Normal' | 'Warning';
  count: number;
  firstTimestamp?: string;
  lastTimestamp?: string;
  reportingComponent?: string;
}

export interface PodLog {
  namespace: string;
  podName: string;
  containerName: string;
  previous: boolean;
  logs: string[];
  retrievedAt: string;
  dataSource: string;
}

export interface PodLogOptions {
  container?: string;
  tailLines?: number;
  previous?: boolean;
}

export type K8sStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

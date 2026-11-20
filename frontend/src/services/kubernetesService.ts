import api from './api';
import type {
  K8sConnection, K8sNamespace, K8sNode, K8sPod,
  K8sDeployment, K8sService, K8sEvent, PodLog, PodLogOptions
} from '../types/kubernetes';

const BASE = '/kubernetes';

export const kubernetesService = {
  /** Check cluster connectivity */
  getConnection: (): Promise<K8sConnection> =>
    api.get(`${BASE}/connection`).then(r => r.data),

  /** List all namespaces */
  getNamespaces: (): Promise<K8sNamespace[]> =>
    api.get(`${BASE}/namespaces`).then(r => r.data),

  /** List all nodes */
  getNodes: (): Promise<K8sNode[]> =>
    api.get(`${BASE}/nodes`).then(r => r.data),

  /** List pods — optionally filter by namespace */
  getPods: (namespace?: string): Promise<K8sPod[]> =>
    api.get(`${BASE}/pods`, { params: namespace ? { namespace } : {} }).then(r => r.data),

  /** Get details for a single pod */
  getPodDetails: (namespace: string, podName: string): Promise<K8sPod> =>
    api.get(`${BASE}/pods/${encodeURIComponent(namespace)}/${encodeURIComponent(podName)}`).then(r => r.data),

  /** List deployments — optionally filter by namespace */
  getDeployments: (namespace?: string): Promise<K8sDeployment[]> =>
    api.get(`${BASE}/deployments`, { params: namespace ? { namespace } : {} }).then(r => r.data),

  /** List services — optionally filter by namespace */
  getServices: (namespace?: string): Promise<K8sService[]> =>
    api.get(`${BASE}/services`, { params: namespace ? { namespace } : {} }).then(r => r.data),

  /** Get pod logs */
  getPodLogs: (namespace: string, podName: string, options: PodLogOptions = {}): Promise<PodLog> =>
    api.get(`${BASE}/pods/${encodeURIComponent(namespace)}/${encodeURIComponent(podName)}/logs`, {
      params: {
        ...(options.container ? { container: options.container } : {}),
        tailLines: options.tailLines ?? 100,
        previous: options.previous ?? false,
      }
    }).then(r => r.data),

  /** List events — optionally filter by namespace */
  getEvents: (namespace?: string): Promise<K8sEvent[]> =>
    api.get(`${BASE}/events`, { params: namespace ? { namespace } : {} }).then(r => r.data),

  /** List events for a specific pod */
  getPodEvents: (namespace: string, podName: string): Promise<K8sEvent[]> =>
    api.get(`${BASE}/pods/${encodeURIComponent(namespace)}/${encodeURIComponent(podName)}/events`).then(r => r.data),
};

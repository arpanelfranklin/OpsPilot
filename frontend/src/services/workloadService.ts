import { DeploymentItem, PodItem, ServiceItem } from '../types/workload';
import api from './api';

export const workloadService = {
  async getDeployments(namespace?: string): Promise<DeploymentItem[]> {
    const params: Record<string, string> = {};
    if (namespace && namespace !== 'all') params.namespace = namespace;
    const response = await api.get<DeploymentItem[]>('/workloads/deployments', { params });
    return response.data;
  },

  async getPods(namespace?: string): Promise<PodItem[]> {
    const params: Record<string, string> = {};
    if (namespace && namespace !== 'all') params.namespace = namespace;
    const response = await api.get<PodItem[]>('/workloads/pods', { params });
    return response.data;
  },

  async getServices(namespace?: string): Promise<ServiceItem[]> {
    const params: Record<string, string> = {};
    if (namespace && namespace !== 'all') params.namespace = namespace;
    const response = await api.get<ServiceItem[]>('/workloads/services', { params });
    return response.data;
  },

  async getWorkloadSummary(): Promise<{
    deployments: { total: number; healthy: number; degraded: number };
    pods: { total: number; running: number; crashloop: number };
    services: { total: number };
  }> {
    const response = await api.get('/workloads/summary');
    return response.data;
  },
};

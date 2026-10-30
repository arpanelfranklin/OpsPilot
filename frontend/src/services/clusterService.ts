import { ClusterInfo, NodeItem } from '../types/cluster';
import { MetricDataPoint, ActivityEvent } from '../types/metric';
import api from './api';

export const clusterService = {
  async getClusterOverview(clusterKey: string = 'production-us-east'): Promise<ClusterInfo> {
    const response = await api.get<ClusterInfo>('/cluster/overview', { params: { clusterKey } });
    return response.data;
  },

  async getAllClusters(): Promise<{ id: string; name: string; environment: string }[]> {
    const response = await api.get<{ id: string; name: string; environment: string }[]>('/cluster/all');
    return response.data;
  },

  async getClusterNodes(): Promise<NodeItem[]> {
    const response = await api.get<NodeItem[]>('/cluster/nodes');
    return response.data;
  },

  async getResourceMetrics(): Promise<MetricDataPoint[]> {
    const response = await api.get<MetricDataPoint[]>('/cluster/metrics');
    return response.data;
  },

  async getRecentActivities(): Promise<ActivityEvent[]> {
    const response = await api.get<ActivityEvent[]>('/cluster/activities');
    return response.data;
  },
};

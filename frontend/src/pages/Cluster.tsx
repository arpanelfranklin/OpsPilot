import React, { useEffect, useState } from 'react';
import { useCluster } from '../context/ClusterContext';
import { clusterService } from '../services/clusterService';
import { NodeItem } from '../types/cluster';
import { MetricDataPoint } from '../types/metric';
import { ClusterSummaryCard } from '../components/cluster/ClusterSummaryCard';
import { NodeTable } from '../components/cluster/NodeTable';
import { ResourceGauge } from '../components/cluster/ResourceGauge';
import { ResourceUsageChart } from '../components/dashboard/ResourceUsageChart';
import { LoadingState } from '../components/common/LoadingState';

export const Cluster: React.FC = () => {
  const { cluster, isLoading: clusterLoading } = useCluster();
  const [nodes, setNodes] = useState<NodeItem[]>([]);
  const [metrics, setMetrics] = useState<MetricDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClusterDetails = async () => {
      try {
        const [nodeList, metricData] = await Promise.all([
          clusterService.getClusterNodes(),
          clusterService.getResourceMetrics(),
        ]);
        setNodes(nodeList);
        setMetrics(metricData);
      } catch (err) {
        console.error('Error fetching cluster page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClusterDetails();
  }, []);

  if (loading || clusterLoading || !cluster) {
    return <LoadingState message="Loading cluster infrastructure & node states..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold font-mono text-white tracking-tight">
            Kubernetes Cluster Topology
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Node-level metrics, capacity allocations, and physical infrastructure health.
          </p>
        </div>
      </div>

      {/* Cluster Summary Header Box */}
      <ClusterSummaryCard cluster={cluster} />

      {/* Nodes Table */}
      <NodeTable nodes={nodes} />

      {/* Resource Gauges & Utilization Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceGauge nodes={nodes} />
        <ResourceUsageChart data={metrics} />
      </div>
    </div>
  );
};

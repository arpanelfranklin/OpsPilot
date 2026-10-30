import React, { useEffect, useState } from 'react';
import {
  Activity,
  Layers,
  AlertOctagon,
  Cpu,
  Database,
  RefreshCw,
} from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ResourceUsageChart } from '../components/dashboard/ResourceUsageChart';
import { WorkloadHealthTable } from '../components/dashboard/WorkloadHealthTable';
import { RecentIncidentsCard } from '../components/dashboard/RecentIncidentsCard';
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline';
import { LoadingState } from '../components/common/LoadingState';
import { useCluster } from '../context/ClusterContext';
import { clusterService } from '../services/clusterService';
import { incidentService } from '../services/incidentService';
import { workloadService } from '../services/workloadService';
import { MetricDataPoint, ActivityEvent } from '../types/metric';
import { Incident } from '../types/incident';
import { DeploymentItem } from '../types/workload';

export const Dashboard: React.FC = () => {
  const { cluster, isLoading: clusterLoading } = useCluster();
  const [metrics, setMetrics] = useState<MetricDataPoint[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [metricData, actData, incData, depData] = await Promise.all([
          clusterService.getResourceMetrics(),
          clusterService.getRecentActivities(),
          incidentService.getIncidents(),
          workloadService.getDeployments(),
        ]);
        setMetrics(metricData);
        setActivities(actData);
        setIncidents(incData);
        setDeployments(depData);
      } catch (err) {
        console.error('Failed to load dashboard telemetry:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading || clusterLoading || !cluster) {
    return <LoadingState message="Loading cluster dashboard..." />;
  }

  const activeIncidentsCount = incidents.filter((i) => i.status !== 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Top Header / Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold font-mono text-white tracking-tight">
            Cluster Overview & Telemetry
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time Kubernetes health assessment, anomaly detection, and cluster utilization.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Polling Cycle: 5s</span>
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Cluster Health"
          value={cluster.status}
          subtitle="GKE Alpha (us-east)"
          icon={Activity}
          badge={{
            text: cluster.status === 'Healthy' ? 'Optimal' : 'Action Required',
            variant: cluster.status === 'Healthy' ? 'success' : 'warning',
          }}
        />

        <MetricCard
          title="Running Pods"
          value={`${cluster.podCount.running} / ${cluster.podCount.total}`}
          subtitle="1 Pod CrashLooping"
          icon={Layers}
          badge={{
            text: `${Math.round((cluster.podCount.running / cluster.podCount.total) * 100)}% Avail`,
            variant: cluster.podCount.running === cluster.podCount.total ? 'success' : 'warning',
          }}
        />

        <MetricCard
          title="Active Incidents"
          value={activeIncidentsCount}
          subtitle="1 High, 0 Critical"
          icon={AlertOctagon}
          badge={{
            text: activeIncidentsCount > 0 ? 'Active RCA' : 'Clear',
            variant: activeIncidentsCount > 0 ? 'danger' : 'success',
          }}
        />

        <MetricCard
          title="CPU Usage"
          value={`${cluster.cpuUsagePercent}%`}
          subtitle="24 Cores Allocated"
          icon={Cpu}
          trend={{ value: '+3.2% 15m', isUp: false }}
        />

        <MetricCard
          title="Memory Usage"
          value={`${cluster.memoryUsagePercent}%`}
          subtitle="96 GiB Total Mem"
          icon={Database}
          trend={{ value: 'Spike to 98%', isUp: true }}
        />
      </div>

      {/* Resource Usage Charts Section */}
      <ResourceUsageChart data={metrics} />

      {/* Two Column Grid: Workload Health & Recent Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkloadHealthTable deployments={deployments} />
        <RecentIncidentsCard incidents={incidents} />
      </div>

      {/* Activity Stream */}
      <ActivityTimeline activities={activities} />
    </div>
  );
};

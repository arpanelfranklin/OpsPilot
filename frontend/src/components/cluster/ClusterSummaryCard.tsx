import React from 'react';
import { ClusterInfo } from '../../types/cluster';
import { StatusBadge } from '../common/StatusBadge';

interface ClusterSummaryCardProps {
  cluster: ClusterInfo;
}

export const ClusterSummaryCard: React.FC<ClusterSummaryCardProps> = ({ cluster }) => {
  return (
    <div className="tech-card p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-devops-border">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-mono text-white">{cluster.name}</h2>
            <StatusBadge status={cluster.status} />
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Cluster UID: <span className="text-slate-300">{cluster.id}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            K8s {cluster.k8sVersion}
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            Region: us-east-1
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            Uptime: {cluster.uptime}
          </span>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-5">
        <div className="bg-slate-900/60 p-3 rounded-md border border-slate-800">
          <span className="text-slate-400 text-xs font-mono block">Nodes</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">
            {cluster.nodeCount}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">All Ready</span>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-md border border-slate-800">
          <span className="text-slate-400 text-xs font-mono block">Namespaces</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">
            {cluster.namespacesCount}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Active</span>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-md border border-slate-800">
          <span className="text-slate-400 text-xs font-mono block">Total Pods</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">
            {cluster.podCount.running}/{cluster.podCount.total}
          </span>
          <span className="text-[10px] text-amber-400 font-mono">1 CrashLoop</span>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-md border border-slate-800">
          <span className="text-slate-400 text-xs font-mono block">CPU Alloc</span>
          <span className="text-xl font-bold font-mono text-blue-400 mt-1 block">
            {cluster.cpuUsagePercent}%
          </span>
          <span className="text-[10px] text-slate-400 font-mono">24 Cores total</span>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-md border border-slate-800">
          <span className="text-slate-400 text-xs font-mono block">Memory Alloc</span>
          <span className="text-xl font-bold font-mono text-purple-400 mt-1 block">
            {cluster.memoryUsagePercent}%
          </span>
          <span className="text-[10px] text-slate-400 font-mono">96 GiB total</span>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-md border border-slate-800">
          <span className="text-slate-400 text-xs font-mono block">Throughput</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
            {cluster.networkThroughput}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Traffic In/Out</span>
        </div>
      </div>
    </div>
  );
};

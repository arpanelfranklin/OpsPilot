import React from 'react';
import { Server, Activity, ChevronDown, RefreshCw, Cpu, Layers } from 'lucide-react';
import { useCluster } from '../../context/ClusterContext';
import { Environment } from '../../types/cluster';
import { StatusBadge } from '../common/StatusBadge';
import { NotificationDropdown } from './NotificationDropdown';
import { useToast } from '../../context/ToastContext';

export const Topbar: React.FC = () => {
  const { cluster, environment, setEnvironment, currentClusterKey, refreshCluster, isLoading } =
    useCluster();
  const { addToast } = useToast();

  const handleRefresh = async () => {
    await refreshCluster();
    addToast({
      type: 'info',
      title: 'Telemetry Refreshed',
      description: 'Cluster metrics and workload states updated.',
      duration: 2500,
    });
  };

  return (
    <header className="h-14 border-b border-devops-border bg-devops-card px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left side: Cluster info & Environment Switcher */}
      <div className="flex items-center gap-4">
        {/* Cluster Selector / Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs">
          <Server className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400 font-mono">Cluster:</span>
          <span className="font-mono font-medium text-slate-200">
            {cluster?.name || 'prod-cluster-alpha'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
            {cluster?.k8sVersion || 'v1.29.2'}
          </span>
        </div>

        {/* Environment Selector */}
        <div className="relative flex items-center">
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as Environment)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono rounded-md pl-3 pr-8 py-1.5 appearance-none cursor-pointer focus:outline-none focus:border-blue-500 transition"
          >
            <option value="Production">Production</option>
            <option value="Staging">Staging</option>
            <option value="Development">Development</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
        </div>

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          title="Refresh metrics"
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
        </button>
      </div>

      {/* Right side: Overall Health, Live Telemetry Mini-Badges, Notifications, User */}
      <div className="flex items-center gap-4">
        {/* Cluster Health indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Cluster Health:</span>
          <StatusBadge status={cluster?.status || 'Degraded'} size="sm" />
        </div>

        <div className="h-4 w-px bg-devops-border" />

        {/* Pods quick gauge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>Pods:</span>
          <span className="text-slate-200 font-medium">
            {cluster?.podCount.running ?? 11}/{cluster?.podCount.total ?? 12}
          </span>
        </div>

        {/* CPU Quick gauge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-slate-400" />
          <span>CPU:</span>
          <span className="text-slate-200 font-medium">{cluster?.cpuUsagePercent ?? 42}%</span>
        </div>

        <div className="h-4 w-px bg-devops-border" />

        {/* Notifications */}
        <NotificationDropdown />

        {/* User profile avatar */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/40 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            OP
          </div>
        </div>
      </div>
    </header>
  );
};

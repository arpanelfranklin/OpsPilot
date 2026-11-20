import React from 'react';
import { RefreshCw, Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';
import type { K8sConnection, K8sStatus } from '../../types/kubernetes';

interface Props {
  connection: K8sConnection | null;
  status: K8sStatus;
  lastRefreshed: Date | null;
  onRefresh: () => void;
}

export const ClusterConnectionCard: React.FC<Props> = ({ connection, status, lastRefreshed, onRefresh }) => {
  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  const statusConfig = {
    connected:    { icon: Wifi,      color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', dot: 'bg-emerald-400 animate-pulse', label: 'Connected' },
    disconnected: { icon: WifiOff,   color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/30',       dot: 'bg-rose-400',                  label: 'Disconnected' },
    connecting:   { icon: Loader2,   color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/30',        dot: 'bg-blue-400 animate-pulse',    label: 'Connecting…' },
    error:        { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30',     dot: 'bg-amber-400',                 label: 'Error' },
  }[status];

  const StatusIcon = statusConfig.icon;

  return (
    <div className={`rounded-xl border p-5 ${statusConfig.bg} backdrop-blur-sm`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-slate-800/60 flex items-center justify-center ${statusConfig.color}`}>
            <StatusIcon className={`w-5 h-5 ${isConnecting ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
              <span className={`text-sm font-semibold ${statusConfig.color}`}>{statusConfig.label}</span>
              {connection?.dataSource && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {connection.dataSource}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {connection?.message ?? 'Checking cluster connection…'}
            </p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={isConnecting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {isConnected && connection && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-800">
            <p className="text-[10px] font-mono uppercase text-slate-500 mb-1">Cluster</p>
            <p className="text-sm font-semibold text-white truncate">{connection.clusterName ?? '—'}</p>
          </div>
          <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-800">
            <p className="text-[10px] font-mono uppercase text-slate-500 mb-1">K8s Version</p>
            <p className="text-sm font-semibold text-white">{connection.kubernetesVersion ?? '—'}</p>
          </div>
          {lastRefreshed && (
            <div className="col-span-2 bg-slate-900/60 rounded-lg p-3 border border-slate-800">
              <p className="text-[10px] font-mono uppercase text-slate-500 mb-1">Last Refreshed</p>
              <p className="text-sm text-slate-300">{lastRefreshed.toLocaleTimeString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

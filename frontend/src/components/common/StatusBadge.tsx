import React from 'react';
import { HealthStatus } from '../../types/cluster';

interface StatusBadgeProps {
  status: HealthStatus | 'Ready' | 'NotReady' | 'Running' | 'CrashLoopBackOff' | 'Pending' | 'Error' | 'Completed' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';

  if (['healthy', 'ready', 'running'].includes(normalized)) {
    colorClasses = 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60';
    dotColor = 'bg-emerald-400';
  } else if (['degraded', 'pending', 'investigating', 'awaiting approval'].includes(normalized)) {
    colorClasses = 'bg-amber-950/60 text-amber-400 border-amber-800/60';
    dotColor = 'bg-amber-400 animate-pulse';
  } else if (['critical', 'crashloopbackoff', 'notready', 'error'].includes(normalized)) {
    colorClasses = 'bg-rose-950/60 text-rose-400 border-rose-800/60';
    dotColor = 'bg-rose-400 animate-pulse';
  } else if (['resolved', 'completed', 'mitigated'].includes(normalized)) {
    colorClasses = 'bg-blue-950/60 text-blue-400 border-blue-800/60';
    dotColor = 'bg-blue-400';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-mono tracking-wide ${sizeClasses} ${colorClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};

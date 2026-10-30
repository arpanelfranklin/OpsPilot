import React from 'react';
import { IncidentSeverity } from '../../types/incident';

interface SeverityBadgeProps {
  severity: IncidentSeverity;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const sev = severity.toUpperCase();

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  if (sev === 'CRITICAL') {
    colorClasses = 'bg-red-950 text-red-400 border-red-800 font-semibold';
  } else if (sev === 'HIGH') {
    colorClasses = 'bg-orange-950/80 text-orange-400 border-orange-800/80 font-semibold';
  } else if (sev === 'MEDIUM') {
    colorClasses = 'bg-yellow-950/70 text-yellow-400 border-yellow-800/70';
  } else if (sev === 'LOW') {
    colorClasses = 'bg-blue-950/60 text-blue-400 border-blue-800/60';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs font-mono';

  return (
    <span className={`inline-flex items-center rounded border tracking-wider uppercase ${sizeClasses} ${colorClasses}`}>
      {sev}
    </span>
  );
};

import React from 'react';
import { History, Bot, Terminal, AlertTriangle, CheckCircle } from 'lucide-react';
import { ActivityEvent } from '../../types/metric';

interface ActivityTimelineProps {
  activities: ActivityEvent[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const getIcon = (type: ActivityEvent['type'], severity?: ActivityEvent['severity']) => {
    if (severity === 'critical') return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
    if (type === 'ai') return <Bot className="w-3.5 h-3.5 text-blue-400" />;
    if (type === 'k8s') return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
    return <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />;
  };

  return (
    <div className="tech-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-slate-100">Live Agent & Cluster Activity</h3>
      </div>

      <div className="relative pl-5 border-l border-devops-border space-y-4 font-mono text-xs">
        {activities.map((act) => (
          <div key={act.id} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              {getIcon(act.type, act.severity)}
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <span className="font-semibold text-slate-200">{act.title}</span>
              <span className="text-[11px] text-slate-400 shrink-0">{act.time}</span>
            </div>

            {act.description && (
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                {act.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

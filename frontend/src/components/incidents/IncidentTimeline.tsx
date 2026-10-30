import React from 'react';
import { Clock, AlertCircle, FileSearch, Sparkles, CheckCircle, ShieldAlert } from 'lucide-react';
import { IncidentTimelineEvent } from '../../types/incident';

interface IncidentTimelineProps {
  timeline: IncidentTimelineEvent[];
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ timeline }) => {
  const getIcon = (type: IncidentTimelineEvent['type']) => {
    switch (type) {
      case 'detection':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-400" />;
      case 'log_collected':
        return <FileSearch className="w-3.5 h-3.5 text-blue-400" />;
      case 'diagnosis':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      case 'recommendation':
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />;
      case 'approval':
      case 'action':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="tech-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-100">Incident Event Timeline</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Chronological RCA Trail</span>
      </div>

      <div className="relative pl-6 border-l border-devops-border space-y-6 font-mono text-xs">
        {timeline.map((event) => (
          <div key={event.id} className="relative group">
            {/* Dot/icon */}
            <div className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              {getIcon(event.type)}
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <span className="font-semibold text-slate-200 text-xs">{event.title}</span>
              <span className="text-[11px] text-slate-400 shrink-0 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {event.time}
              </span>
            </div>

            {event.description && (
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed bg-slate-900/40 p-2.5 rounded border border-slate-800/60">
                {event.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

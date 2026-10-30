import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, ArrowUpRight, ChevronRight } from 'lucide-react';
import { Incident } from '../../types/incident';
import { SeverityBadge } from '../common/SeverityBadge';
import { StatusBadge } from '../common/StatusBadge';

interface RecentIncidentsCardProps {
  incidents: Incident[];
}

export const RecentIncidentsCard: React.FC<RecentIncidentsCardProps> = ({ incidents }) => {
  return (
    <div className="tech-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-semibold text-slate-100">Recent Incidents</h3>
        </div>
        <Link
          to="/incidents"
          className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
        >
          All Incidents <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {incidents.slice(0, 3).map((inc) => (
          <Link
            key={inc.id}
            to={`/incidents/${inc.id}`}
            className="block p-3 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 transition group"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-slate-100 group-hover:text-blue-400 transition">
                  {inc.id}
                </span>
                <span className="text-xs text-slate-400 font-mono">({inc.service})</span>
              </div>
              <SeverityBadge severity={inc.severity} size="sm" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <p className="text-slate-300 font-medium truncate max-w-[200px]">{inc.problem}</p>
              <div className="flex items-center gap-2">
                <StatusBadge status={inc.status} size="sm" />
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

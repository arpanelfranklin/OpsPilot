import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowUpRight, Bot } from 'lucide-react';
import { Incident } from '../../types/incident';
import { SeverityBadge } from '../common/SeverityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';

interface IncidentTableProps {
  incidents: Incident[];
}

export const IncidentTable: React.FC<IncidentTableProps> = ({ incidents }) => {
  const navigate = useNavigate();

  return (
    <div className="tech-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-devops-border bg-slate-900/80 text-slate-400 font-mono">
              <th className="py-3 px-4 font-medium">Incident ID</th>
              <th className="py-3 px-4 font-medium">Service</th>
              <th className="py-3 px-4 font-medium">Problem / Anomaly</th>
              <th className="py-3 px-4 font-medium">Severity</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Detected</th>
              <th className="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-devops-border/60 font-mono">
            {incidents.map((incident) => (
              <tr
                key={incident.id}
                onClick={() => navigate(`/incidents/${incident.id}`)}
                className="hover:bg-slate-800/50 cursor-pointer transition group"
              >
                <td className="py-3.5 px-4 font-semibold text-blue-400 group-hover:text-blue-300">
                  <div className="flex items-center gap-1.5">
                    <span>{incident.id}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-200 font-medium">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {incident.service}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  <div className="font-semibold text-slate-100">{incident.problem}</div>
                  <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                    {incident.diagnosis.summary}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <SeverityBadge severity={incident.severity} size="sm" />
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={incident.status} size="sm" />
                </td>
                <td className="py-3.5 px-4 text-slate-400">{incident.detectedAt}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/incidents/${incident.id}`)}
                    >
                      Investigate <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

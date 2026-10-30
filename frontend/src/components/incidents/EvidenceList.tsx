import React from 'react';
import { Database, AlertCircle, FileText, Cpu, CheckSquare } from 'lucide-react';
import { IncidentEvidence } from '../../types/incident';

interface EvidenceListProps {
  evidence: IncidentEvidence[];
}

export const EvidenceList: React.FC<EvidenceListProps> = ({ evidence }) => {
  const getIcon = (type: IncidentEvidence['type']) => {
    switch (type) {
      case 'metric':
        return <Cpu className="w-4 h-4 text-blue-400" />;
      case 'event':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case 'log':
        return <FileText className="w-4 h-4 text-amber-400" />;
      default:
        return <Database className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="tech-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-blue-400" />
          Corroborating Telemetry & Evidence
        </h3>
        <span className="text-xs font-mono text-slate-400">{evidence.length} Indicators</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
        {evidence.map((item, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-3"
          >
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700/60 mt-0.5 shrink-0">
              {getIcon(item.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-slate-400 text-[11px] uppercase tracking-wider">{item.label}</div>
              <div className="text-slate-100 font-semibold mt-0.5 text-xs">{item.value}</div>
              {item.detail && (
                <div className="text-[10px] text-slate-400 mt-1 truncate">{item.detail}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

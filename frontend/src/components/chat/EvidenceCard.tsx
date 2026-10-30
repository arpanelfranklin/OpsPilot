import React, { useState } from 'react';
import { Layers, Activity, FileText, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { ChatEvidenceGroup } from '../../types/chat';

interface EvidenceCardProps {
  evidence: ChatEvidenceGroup;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence }) => {
  const [activeTab, setActiveTab] = useState<'pods' | 'events' | 'metrics' | 'logs'>('pods');
  const [isExpanded, setIsExpanded] = useState(true);

  const availableTabs: Array<{ id: 'pods' | 'events' | 'metrics' | 'logs'; label: string; icon: any; count: number }> = [];

  if (evidence.pods && evidence.pods.length > 0) {
    availableTabs.push({ id: 'pods', label: 'Pods', icon: Layers, count: evidence.pods.length });
  }
  if (evidence.metrics && evidence.metrics.length > 0) {
    availableTabs.push({ id: 'metrics', label: 'Metrics', icon: Activity, count: evidence.metrics.length });
  }
  if (evidence.events && evidence.events.length > 0) {
    availableTabs.push({ id: 'events', label: 'Events', icon: AlertTriangle, count: evidence.events.length });
  }
  if (evidence.logs && evidence.logs.length > 0) {
    availableTabs.push({ id: 'logs', label: 'Logs', icon: FileText, count: evidence.logs.length });
  }

  if (availableTabs.length === 0) return null;

  return (
    <div className="mt-3 tech-card overflow-hidden bg-slate-950/70 border border-slate-800">
      {/* Evidence Header */}
      <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Correlated Evidence:
          </span>
          <div className="flex items-center gap-1">
            {availableTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsExpanded(true);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 transition ${
                    activeTab === tab.id && isExpanded
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                  <span className="text-[10px] opacity-75">({tab.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-slate-200 p-1"
        >
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-3 text-xs font-mono">
          {activeTab === 'pods' && evidence.pods && (
            <div className="space-y-1.5">
              {evidence.pods.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800/80"
                >
                  <div>
                    <span className="font-semibold text-slate-200">{p.name}</span>
                    <span className="text-slate-400 text-[11px] block">Restarts: {p.restarts}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 text-[10px] font-semibold border border-rose-800/60">
                      {p.status}
                    </span>
                    <span className="text-slate-400 text-[10px] block mt-0.5">{p.memory}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'metrics' && evidence.metrics && (
            <div className="grid grid-cols-2 gap-2">
              {evidence.metrics.map((m, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800/80">
                  <div className="text-slate-400 text-[10px] uppercase">{m.metric}</div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-bold text-slate-100">{m.current}</span>
                    <span className="text-[11px] text-rose-400">{m.utilization}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Limit: {m.limit}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'events' && evidence.events && (
            <div className="space-y-1.5">
              {evidence.events.map((ev, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800/80 text-[11px]">
                  <div className="flex justify-between font-semibold text-amber-400">
                    <span>{ev.reason}</span>
                    <span className="text-slate-400 text-[10px]">{ev.time}</span>
                  </div>
                  <div className="text-slate-300 mt-0.5">{ev.message}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'logs' && evidence.logs && (
            <div className="bg-slate-950 p-2.5 rounded border border-slate-900 font-mono text-[11px] space-y-1 overflow-x-auto max-h-40">
              {evidence.logs.map((log, idx) => (
                <div key={idx} className="leading-tight">
                  <span className="text-slate-500">{log.timestamp} </span>
                  <span
                    className={
                      log.level === 'FATAL' || log.level === 'ERROR'
                        ? 'text-rose-400 font-bold'
                        : 'text-amber-400'
                    }
                  >
                    [{log.level}]{' '}
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

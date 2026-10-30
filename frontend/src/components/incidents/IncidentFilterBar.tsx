import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { IncidentSeverity, IncidentStatus } from '../../types/incident';

interface IncidentFilterBarProps {
  severity: IncidentSeverity | 'ALL';
  onSeverityChange: (sev: IncidentSeverity | 'ALL') => void;
  status: IncidentStatus | 'ALL';
  onStatusChange: (status: IncidentStatus | 'ALL') => void;
  service: string;
  onServiceChange: (service: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onReset: () => void;
}

export const IncidentFilterBar: React.FC<IncidentFilterBarProps> = ({
  severity,
  onSeverityChange,
  status,
  onStatusChange,
  service,
  onServiceChange,
  search,
  onSearchChange,
  onReset,
}) => {
  return (
    <div className="tech-card p-4 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search incident ID, service, root cause, or error..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-md pl-9 pr-4 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500 transition placeholder:text-slate-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Severity selector */}
          <select
            value={severity}
            onChange={(e) => onSeverityChange(e.target.value as IncidentSeverity | 'ALL')}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono rounded-md px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">Severity: All</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status selector */}
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as IncidentStatus | 'ALL')}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono rounded-md px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">Status: All</option>
            <option value="Investigating">Investigating</option>
            <option value="Awaiting Approval">Awaiting Approval</option>
            <option value="Resolved">Resolved</option>
            <option value="Mitigated">Mitigated</option>
          </select>

          {/* Service selector */}
          <select
            value={service}
            onChange={(e) => onServiceChange(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono rounded-md px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">Service: All</option>
            <option value="chat-backend">chat-backend</option>
            <option value="auth-service">auth-service</option>
            <option value="mongodb">mongodb</option>
          </select>

          {/* Reset Filters button */}
          {(severity !== 'ALL' || status !== 'ALL' || service !== 'ALL' || search) && (
            <button
              onClick={onReset}
              className="p-1.5 text-xs text-slate-400 hover:text-white rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 font-mono transition"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

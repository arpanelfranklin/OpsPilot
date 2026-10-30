import React from 'react';
import { X, Layers, Cpu, Database, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { DeploymentItem } from '../../types/workload';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';

interface WorkloadDetailsDrawerProps {
  deployment: DeploymentItem | null;
  onClose: () => void;
  onSimulateRestart: (name: string) => void;
  onSimulateScale: (name: string) => void;
}

export const WorkloadDetailsDrawer: React.FC<WorkloadDetailsDrawerProps> = ({
  deployment,
  onClose,
  onSimulateRestart,
  onSimulateScale,
}) => {
  if (!deployment) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-devops-card border-l border-devops-border shadow-2xl z-50 flex flex-col animate-slideLeft">
      {/* Header */}
      <div className="p-5 border-b border-devops-border flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-blue-950/80 border border-blue-800 text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold font-mono text-slate-100">{deployment.name}</h3>
            <p className="text-xs text-slate-400 font-mono">
              Namespace: <span className="text-slate-200">{deployment.namespace}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-xs">
        {/* Status & Replicas Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Health</span>
            <div className="mt-1">
              <StatusBadge status={deployment.status} size="sm" />
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Replicas (Ready/Desired)</span>
            <div className="mt-1 text-sm font-bold text-slate-100">
              {deployment.readyReplicas} / {deployment.desiredReplicas}
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Restarts (24h)</span>
            <div className="mt-1 text-sm font-bold text-rose-400">{deployment.restarts}</div>
          </div>
        </div>

        {/* Container Image & Specs */}
        <div className="space-y-3 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Container Specification
          </h4>

          <div>
            <span className="text-slate-400 block text-[11px]">Image Tag</span>
            <div className="text-slate-200 bg-slate-950 p-2 rounded border border-slate-800 break-all mt-1">
              {deployment.image}:{deployment.version}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Rollout Strategy</span>
            <div className="text-slate-300 mt-0.5">{deployment.strategy}</div>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Created</span>
            <div className="text-slate-300 mt-0.5">{deployment.createdAt}</div>
          </div>
        </div>

        {/* Resource Allocation */}
        <div className="space-y-3 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Resource Requests & Limits
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950 rounded border border-slate-800">
              <div className="flex items-center gap-1.5 text-blue-400 mb-1 font-semibold">
                <Cpu className="w-3.5 h-3.5" /> CPU
              </div>
              <div className="text-slate-300 text-[11px]">Request: {deployment.cpuRequest}</div>
              <div className="text-slate-300 text-[11px]">Limit: {deployment.cpuLimit}</div>
            </div>

            <div className="p-3 bg-slate-950 rounded border border-slate-800">
              <div className="flex items-center gap-1.5 text-purple-400 mb-1 font-semibold">
                <Database className="w-3.5 h-3.5" /> Memory
              </div>
              <div className="text-slate-300 text-[11px]">Request: {deployment.memoryRequest}</div>
              <div className="text-slate-300 text-[11px]">Limit: {deployment.memoryLimit}</div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Kubernetes Event Stream ({deployment.events.length})
          </h4>

          {deployment.events.length === 0 ? (
            <div className="p-4 bg-slate-900/40 rounded border border-slate-800 text-center text-slate-400">
              No warning events recorded in the last 1 hour.
            </div>
          ) : (
            <div className="space-y-2">
              {deployment.events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5"
                >
                  {ev.type === 'Warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{ev.reason}</span>
                      <span className="text-[10px] text-slate-400">{ev.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{ev.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Simulation Controls */}
      <div className="p-4 border-t border-devops-border bg-slate-900/90 flex items-center justify-end gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSimulateScale(deployment.name)}
        >
          Scale Replicas
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onSimulateRestart(deployment.name)}
        >
          Restart Deployment
        </Button>
      </div>
    </div>
  );
};

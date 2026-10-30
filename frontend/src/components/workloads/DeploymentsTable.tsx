import React from 'react';
import { Layers, ChevronRight, AlertCircle } from 'lucide-react';
import { DeploymentItem } from '../../types/workload';
import { StatusBadge } from '../common/StatusBadge';

interface DeploymentsTableProps {
  deployments: DeploymentItem[];
  onSelectDeployment: (dep: DeploymentItem) => void;
  selectedId?: string;
}

export const DeploymentsTable: React.FC<DeploymentsTableProps> = ({
  deployments,
  onSelectDeployment,
  selectedId,
}) => {
  return (
    <div className="tech-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-devops-border bg-slate-900/80 text-slate-400 font-mono">
              <th className="py-3 px-4 font-medium">Deployment Name</th>
              <th className="py-3 px-4 font-medium">Namespace</th>
              <th className="py-3 px-4 font-medium">Desired</th>
              <th className="py-3 px-4 font-medium">Ready</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Version / Image Tag</th>
              <th className="py-3 px-4 font-medium">Restarts</th>
              <th className="py-3 px-4 font-medium text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-devops-border/60 font-mono">
            {deployments.map((dep) => {
              const isSelected = selectedId === dep.id;
              return (
                <tr
                  key={dep.id}
                  onClick={() => onSelectDeployment(dep)}
                  className={`cursor-pointer transition ${
                    isSelected ? 'bg-blue-950/40 border-l-2 border-l-blue-500' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 px-4 font-semibold text-slate-100 flex items-center gap-2">
                    <span>{dep.name}</span>
                    {dep.status !== 'Healthy' && (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{dep.namespace}</td>
                  <td className="py-3 px-4 text-slate-300">{dep.desiredReplicas}</td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        dep.readyReplicas < dep.desiredReplicas
                          ? 'text-amber-400 font-bold'
                          : 'text-emerald-400'
                      }
                    >
                      {dep.readyReplicas}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={dep.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                      {dep.version}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        dep.restarts > 0 ? 'text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-800/50' : 'text-slate-400'
                      }
                    >
                      {dep.restarts}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-slate-400 hover:text-blue-400 p-1">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

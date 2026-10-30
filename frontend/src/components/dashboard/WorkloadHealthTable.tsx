import React from 'react';
import { Link } from 'react-router-dom';
import { Boxes, ArrowUpRight } from 'lucide-react';
import { DeploymentItem } from '../../types/workload';
import { StatusBadge } from '../common/StatusBadge';

interface WorkloadHealthTableProps {
  deployments: DeploymentItem[];
}

export const WorkloadHealthTable: React.FC<WorkloadHealthTableProps> = ({ deployments }) => {
  return (
    <div className="tech-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Boxes className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-100">Workload Health</h3>
        </div>
        <Link
          to="/workloads"
          className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
        >
          View all <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-devops-border text-slate-400 font-mono">
              <th className="pb-2.5 font-medium">Application</th>
              <th className="pb-2.5 font-medium">Namespace</th>
              <th className="pb-2.5 font-medium">Status</th>
              <th className="pb-2.5 font-medium">Pods</th>
              <th className="pb-2.5 font-medium">Restarts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-devops-border/60 font-mono">
            {deployments.slice(0, 5).map((dep) => (
              <tr key={dep.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3 font-medium text-slate-200">
                  <Link
                    to={`/workloads?highlight=${dep.name}`}
                    className="hover:text-blue-400 transition"
                  >
                    {dep.name}
                  </Link>
                </td>
                <td className="py-3 text-slate-400">{dep.namespace}</td>
                <td className="py-3">
                  <StatusBadge status={dep.status} size="sm" />
                </td>
                <td className="py-3 text-slate-300">
                  <span
                    className={
                      dep.readyReplicas < dep.desiredReplicas ? 'text-amber-400 font-semibold' : ''
                    }
                  >
                    {dep.readyReplicas}/{dep.desiredReplicas}
                  </span>
                </td>
                <td className="py-3">
                  <span
                    className={
                      dep.restarts > 0 ? 'text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-800/50' : 'text-slate-400'
                    }
                  >
                    {dep.restarts}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

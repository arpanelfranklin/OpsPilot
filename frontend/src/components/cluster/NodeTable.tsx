import React from 'react';
import { Server, HardDrive, Cpu, Layers } from 'lucide-react';
import { NodeItem } from '../../types/cluster';
import { StatusBadge } from '../common/StatusBadge';

interface NodeTableProps {
  nodes: NodeItem[];
}

export const NodeTable: React.FC<NodeTableProps> = ({ nodes }) => {
  return (
    <div className="tech-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-100">Kubernetes Nodes</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">{nodes.length} Nodes in Cluster</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-devops-border text-slate-400 font-mono">
              <th className="pb-3 font-medium">Node Name</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Roles</th>
              <th className="pb-3 font-medium">CPU Usage</th>
              <th className="pb-3 font-medium">Memory Usage</th>
              <th className="pb-3 font-medium">Pods</th>
              <th className="pb-3 font-medium">IP Address</th>
              <th className="pb-3 font-medium">Zone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-devops-border/60 font-mono">
            {nodes.map((node) => (
              <tr key={node.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3.5 font-medium text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100">{node.id}</span>
                    <span className="text-[11px] text-slate-400 hidden xl:inline">({node.name})</span>
                  </div>
                </td>
                <td className="py-3.5">
                  <StatusBadge status={node.status} size="sm" />
                </td>
                <td className="py-3.5 text-slate-400">
                  {node.roles.map((r) => (
                    <span
                      key={r}
                      className="px-1.5 py-0.5 mr-1 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700"
                    >
                      {r}
                    </span>
                  ))}
                </td>
                {/* CPU bar & % */}
                <td className="py-3.5">
                  <div className="w-32">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300 font-semibold">{node.cpuUsagePercent}%</span>
                      <span className="text-slate-400">({node.cpuCores} cores)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${node.cpuUsagePercent}%` }}
                      />
                    </div>
                  </div>
                </td>
                {/* Memory bar & % */}
                <td className="py-3.5">
                  <div className="w-32">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300 font-semibold">{node.memoryUsagePercent}%</span>
                      <span className="text-slate-400">({node.memoryCapacityGiB} GiB)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          node.memoryUsagePercent > 65 ? 'bg-amber-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${node.memoryUsagePercent}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 text-slate-300">
                  <span className="font-semibold">{node.podCount}</span>
                  <span className="text-slate-400 text-[11px]">/{node.podCapacity}</span>
                </td>
                <td className="py-3.5 text-slate-400">{node.ipAddress}</td>
                <td className="py-3.5 text-slate-400">{node.zone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

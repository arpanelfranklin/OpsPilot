import React from 'react';
import { PodItem } from '../../types/workload';
import { StatusBadge } from '../common/StatusBadge';
import { ChevronRight } from 'lucide-react';

interface PodsTableProps {
  pods: PodItem[];
  onSelectPod?: (pod: PodItem) => void;
  selectedId?: string;
}

export const PodsTable: React.FC<PodsTableProps> = ({ pods, onSelectPod, selectedId }) => {
  return (
    <div className="tech-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-devops-border bg-slate-900/80 text-slate-400 font-mono">
              <th className="py-3 px-4 font-medium">Pod Name</th>
              <th className="py-3 px-4 font-medium">Namespace</th>
              <th className="py-3 px-4 font-medium">Node</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Containers Ready</th>
              <th className="py-3 px-4 font-medium">Restarts</th>
              <th className="py-3 px-4 font-medium">Memory</th>
              <th className="py-3 px-4 font-medium">Age</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-devops-border/60 font-mono">
            {pods.map((pod) => {
              const isSelected = selectedId === pod.id;
              return (
                <tr
                  key={pod.id}
                  onClick={() => onSelectPod && onSelectPod(pod)}
                  className={`cursor-pointer transition ${
                    isSelected ? 'bg-blue-950/40 border-l-2 border-l-blue-500' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-slate-100">{pod.name}</td>
                  <td className="py-3 px-4 text-slate-400">{pod.namespace}</td>
                  <td className="py-3 px-4 text-slate-300">{pod.node}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={pod.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-slate-300">{pod.readyContainers}</td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        pod.restarts > 0 ? 'text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-800/50' : 'text-slate-400'
                      }
                    >
                      {pod.restarts}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={pod.memory.includes('OOM') ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                      {pod.memory}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{pod.age}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

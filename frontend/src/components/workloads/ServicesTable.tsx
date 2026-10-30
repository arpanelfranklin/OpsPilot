import React from 'react';
import { ServiceItem } from '../../types/workload';

interface ServicesTableProps {
  services: ServiceItem[];
}

export const ServicesTable: React.FC<ServicesTableProps> = ({ services }) => {
  return (
    <div className="tech-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-devops-border bg-slate-900/80 text-slate-400 font-mono">
              <th className="py-3 px-4 font-medium">Service Name</th>
              <th className="py-3 px-4 font-medium">Namespace</th>
              <th className="py-3 px-4 font-medium">Type</th>
              <th className="py-3 px-4 font-medium">Cluster IP</th>
              <th className="py-3 px-4 font-medium">External IP</th>
              <th className="py-3 px-4 font-medium">Ports</th>
              <th className="py-3 px-4 font-medium">Endpoints</th>
              <th className="py-3 px-4 font-medium">Age</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-devops-border/60 font-mono">
            {services.map((svc) => (
              <tr key={svc.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-medium text-slate-100">{svc.name}</td>
                <td className="py-3 px-4 text-slate-400">{svc.namespace}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-400">
                    {svc.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-300">{svc.clusterIP}</td>
                <td className="py-3 px-4 text-slate-300">{svc.externalIP || '—'}</td>
                <td className="py-3 px-4 text-slate-300">
                  {svc.ports.map((p) => `${p.port}/${p.protocol}`).join(', ')}
                </td>
                <td className="py-3 px-4 text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400">
                    {svc.endpointsCount}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">{svc.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

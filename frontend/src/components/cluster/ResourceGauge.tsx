import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { NodeItem } from '../../types/cluster';

interface ResourceGaugeProps {
  nodes: NodeItem[];
}

export const ResourceGauge: React.FC<ResourceGaugeProps> = ({ nodes }) => {
  const chartData = nodes.map((node) => ({
    name: node.id,
    CPU: node.cpuUsagePercent,
    Memory: node.memoryUsagePercent,
    Pods: Math.round((node.podCount / node.podCapacity) * 100),
  }));

  return (
    <div className="tech-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Node Utilization Comparison</h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Resource saturation % per cluster node
          </p>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          Capacity Metric
        </span>
      </div>

      <div className="h-56 w-full font-mono text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis
              stroke="#6B7280"
              domain={[0, 100]}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                borderColor: '#374151',
                borderRadius: '0.375rem',
                color: '#F3F4F6',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
              formatter={(value: any, name: string) => [`${value}%`, `${name} Saturation`]}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontFamily: 'monospace' }}
            />
            <Bar dataKey="CPU" fill="#3B82F6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Memory" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Pods" fill="#10B981" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

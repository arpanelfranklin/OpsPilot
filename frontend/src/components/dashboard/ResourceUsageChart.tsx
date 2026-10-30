import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { MetricDataPoint } from '../../types/metric';
import { Activity, Cpu, Database } from 'lucide-react';

interface ResourceUsageChartProps {
  data: MetricDataPoint[];
}

export const ResourceUsageChart: React.FC<ResourceUsageChartProps> = ({ data }) => {
  const [metricView, setMetricView] = useState<'both' | 'cpu' | 'memory'>('both');

  return (
    <div className="tech-card p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-100">Cluster Resource Telemetry</h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Aggregated CPU and Memory usage across worker nodes (Last 45 minutes)
          </p>
        </div>

        {/* View toggle filters */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-md text-xs font-mono">
          <button
            onClick={() => setMetricView('both')}
            className={`px-2.5 py-1 rounded transition ${
              metricView === 'both' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setMetricView('cpu')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
              metricView === 'cpu' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3 h-3" /> CPU
          </button>
          <button
            onClick={() => setMetricView('memory')}
            className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
              metricView === 'memory'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3 h-3" /> Mem
          </button>
        </div>
      </div>

      <div className="h-64 w-full font-mono text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis dataKey="time" stroke="#6B7280" tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 11 }}
              domain={[0, 100]}
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
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
              }}
              formatter={(value: any, name: string) => [
                `${value}%`,
                name === 'cpu' ? 'CPU Utilization' : 'Memory Utilization',
              ]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontFamily: 'monospace' }}
            />
            {(metricView === 'both' || metricView === 'cpu') && (
              <Area
                type="monotone"
                dataKey="cpu"
                name="CPU Usage"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#cpuGradient)"
              />
            )}
            {(metricView === 'both' || metricView === 'memory') && (
              <Area
                type="monotone"
                dataKey="memory"
                name="Memory Usage"
                stroke="#8B5CF6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#memoryGradient)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-devops-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Current CPU</span>
          <span className="text-blue-400 font-bold text-sm">42%</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Current Memory</span>
          <span className="text-purple-400 font-bold text-sm">61%</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Peak Memory (10:42)</span>
          <span className="text-rose-400 font-bold text-sm">98% (OOM)</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Network I/O</span>
          <span className="text-emerald-400 font-bold text-sm">310 MB/s</span>
        </div>
      </div>
    </div>
  );
};

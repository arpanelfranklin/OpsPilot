import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  };
  trend?: {
    value: string;
    isUp: boolean;
    isNeutral?: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  trend,
}) => {
  const badgeColors = {
    success: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
    warning: 'bg-amber-950/60 text-amber-400 border-amber-800/60',
    danger: 'bg-rose-950/60 text-rose-400 border-rose-800/60',
    info: 'bg-blue-950/60 text-blue-400 border-blue-800/60',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <div className="tech-card p-4 transition-all duration-150 hover:border-slate-700 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">{title}</span>
        <div className="p-2 rounded-md bg-slate-800/80 text-slate-400 border border-slate-800">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold font-mono text-white tracking-tight">{value}</div>
        {badge && (
          <span
            className={`text-xs font-mono px-2 py-0.5 rounded border ${badgeColors[badge.variant]}`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2 text-xs font-mono text-slate-400 flex items-center justify-between pt-2 border-t border-devops-border/60">
          <span>{subtitle}</span>
          {trend && (
            <span
              className={
                trend.isNeutral
                  ? 'text-slate-400'
                  : trend.isUp
                  ? 'text-rose-400'
                  : 'text-emerald-400'
              }
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

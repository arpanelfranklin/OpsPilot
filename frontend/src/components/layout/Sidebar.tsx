import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Server,
  AlertOctagon,
  Boxes,
  Bot,
  Settings,
  ShieldCheck,
  CircleDot,
  User,
} from 'lucide-react';
import { useCluster } from '../../context/ClusterContext';

export const Sidebar: React.FC = () => {
  const { environment, cluster } = useCluster();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Cluster', path: '/cluster', icon: Server },
    { name: 'Incidents', path: '/incidents', icon: AlertOctagon, badge: '2' },
    { name: 'Workloads', path: '/workloads', icon: Boxes },
    { name: 'AI Assistant', path: '/assistant', icon: Bot, isAIBadge: true },
  ];

  const bottomNavItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const envColors = {
    Production: 'text-rose-400 bg-rose-950/40 border-rose-800/40',
    Staging: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
    Development: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
  }[environment];

  return (
    <aside className="w-64 bg-devops-card border-r border-devops-border flex flex-col justify-between shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-devops-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">OpsPilot</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                Agent v0.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
              K8s Operations AI
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Operations
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-xs font-mono font-semibold bg-rose-950 text-rose-400 border border-rose-800/80">
                    {item.badge}
                  </span>
                )}
                {item.isAIBadge && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-indigo-950/80 text-indigo-300 border border-indigo-700/40">
                    Live
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Preferences
          </div>
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: User, Environment, System Status */}
      <div className="p-3 border-t border-devops-border space-y-2.5 bg-slate-900/40">
        {/* Environment & Status Indicator */}
        <div className="flex items-center justify-between text-xs px-2 py-1.5 rounded bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-mono text-[11px]">Agent Status:</span>
          </div>
          <span className="text-emerald-400 font-mono text-[11px] font-medium">Active</span>
        </div>

        <div className="flex items-center justify-between text-xs px-2">
          <span className="text-slate-400 text-[11px] font-mono">Environment:</span>
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${envColors}`}>
            {environment}
          </span>
        </div>

        {/* Current User */}
        <div className="pt-2 border-t border-devops-border/60 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="leading-none">
              <div className="text-xs font-semibold text-slate-200">sre-admin</div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">Cluster Admin</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
        </div>
      </div>
    </aside>
  );
};

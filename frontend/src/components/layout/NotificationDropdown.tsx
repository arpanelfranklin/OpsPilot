import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle2, Bot, Info, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const notifications = [
    {
      id: 'n1',
      title: 'CrashLoopBackOff Detected',
      desc: 'chat-backend restarted 7 times (OOMKilled)',
      time: '10:42',
      type: 'critical',
      link: '/incidents/INC-102',
    },
    {
      id: 'n2',
      title: 'AI Remediation Recommendation',
      desc: 'Proposal to bump memory limit to 1024Mi ready for review',
      time: '10:45',
      type: 'ai',
      link: '/incidents/INC-102',
    },
    {
      id: 'n3',
      title: 'Incident Resolved',
      desc: 'INC-101 (High memory usage) auto-mitigated',
      time: '08:54',
      type: 'success',
      link: '/incidents/INC-101',
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenNotification = (link: string) => {
    setIsOpen(false);
    navigate(link);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasUnread(false);
        }}
        className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition relative border border-slate-700/60"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {hasUnread && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-devops-card" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-devops-card border border-devops-border rounded-lg shadow-2xl z-50 overflow-hidden animate-fadeIn">
          <div className="px-4 py-3 border-b border-devops-border flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">System Alerts</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                3 Total
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-devops-border max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleOpenNotification(n.link)}
                className="p-3 hover:bg-slate-800/60 transition cursor-pointer flex items-start gap-2.5"
              >
                {n.type === 'critical' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : n.type === 'ai' ? (
                  <Bot className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-medium text-slate-200 truncate">{n.title}</h5>
                    <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-devops-border bg-slate-900/60 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/incidents');
              }}
              className="text-xs text-blue-400 hover:text-blue-300 font-mono transition"
            >
              View all incident history →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

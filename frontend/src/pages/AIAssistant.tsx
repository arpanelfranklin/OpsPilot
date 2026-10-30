import React from 'react';
import { Bot, Sparkles, Terminal, Info } from 'lucide-react';
import { ChatWindow } from '../components/chat/ChatWindow';

export const AIAssistant: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono text-white tracking-tight">
              OpsPilot AI Operations Assistant
            </h1>
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-mono border border-blue-800">
              Autonomous SRE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Query pod states, diagnose OOM / CrashLoop anomalies, and generate Kubernetes remediation strategies.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Diagnostic Mode: SRE Copilot</span>
        </div>
      </div>

      {/* Chat Window Component */}
      <ChatWindow />
    </div>
  );
};

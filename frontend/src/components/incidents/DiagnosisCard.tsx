import React from 'react';
import { Bot, Sparkles, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Incident } from '../../types/incident';

interface DiagnosisCardProps {
  diagnosis: Incident['diagnosis'];
}

export const DiagnosisCard: React.FC<DiagnosisCardProps> = ({ diagnosis }) => {
  return (
    <div className="tech-card p-6 border-l-4 border-l-blue-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              AI Incident Diagnosis & Root Cause
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-mono border border-blue-800">
                Automated RCA
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Inferred from correlated Prometheus metrics, K8s events & container logs
            </p>
          </div>
        </div>

        {/* Confidence metric score */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs text-slate-400">Confidence:</span>
          <span className="text-sm font-bold text-emerald-400">{diagnosis.confidence}%</span>
        </div>
      </div>

      {/* Diagnosis Text Box */}
      <div className="space-y-4 text-xs font-mono">
        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 leading-relaxed text-slate-200">
          <span className="text-blue-400 font-semibold block mb-1">Executive Summary:</span>
          "{diagnosis.summary}"
        </div>

        {/* Root cause and Recommendation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Identified Root Cause:</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">{diagnosis.rootCause}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Recommended Action:</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {diagnosis.recommendedAction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

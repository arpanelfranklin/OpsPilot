import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../../types/common';

interface ToastProps {
  toast: ToastMessage;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const { type, title, description } = toast;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-700/50 bg-slate-900/95',
    warning: 'border-amber-700/50 bg-slate-900/95',
    error: 'border-rose-700/50 bg-slate-900/95',
    info: 'border-blue-700/50 bg-slate-900/95',
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-xl backdrop-blur-sm transition-all duration-200 ${borderColors[type]}`}
      role="alert"
    >
      {icons[type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
        {description && <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

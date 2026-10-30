import React from 'react';
import { Terminal } from 'lucide-react';

interface SuggestedPromptProps {
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
}

export const SuggestedPrompt: React.FC<SuggestedPromptProps> = ({
  prompts,
  onSelectPrompt,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
        <Terminal className="w-3.5 h-3.5 text-blue-400" />
        Suggested:
      </span>
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(prompt)}
          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-mono transition-all"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};

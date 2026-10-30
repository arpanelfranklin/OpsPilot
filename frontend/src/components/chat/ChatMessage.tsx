import React, { useState } from 'react';
import { Bot, User, Sparkles, Copy, Check, Terminal } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types/chat';
import { EvidenceCard } from './EvidenceCard';

interface ChatMessageProps {
  message: ChatMessageType;
  onSelectFollowUp?: (prompt: string) => void;
}

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'bash' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2.5 rounded-lg border border-slate-800 bg-slate-950/90 overflow-hidden text-xs font-mono shadow-sm">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300 uppercase tracking-wider">
          <Terminal className="w-3 h-3 text-blue-400" />
          <span>{language || 'code'}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[10px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-slate-200 leading-relaxed font-mono selection:bg-blue-600/30">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSelectFollowUp }) => {
  const isAssistant = message.sender === 'assistant';

  const renderInline = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-300">$1</em>')
      .replace(
        /`([^`]+)`/g,
        '<code class="px-1.5 py-0.5 rounded bg-slate-900 text-blue-300 font-mono text-[11px] border border-slate-800">$1</code>'
      );
  };

  // Parses content handling fenced code blocks, tables, headers, and lists
  const renderFormattedContent = (content: string) => {
    // Split text by fenced code blocks: ```lang ... ```
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts: Array<{ type: 'code' | 'text'; code?: string; lang?: string; text?: string }> = [];

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          text: content.substring(lastIndex, match.index),
        });
      }
      parts.push({
        type: 'code',
        lang: match[1] || 'bash',
        code: match[2].trimEnd(),
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        text: content.substring(lastIndex),
      });
    }

    return parts.map((part, partIdx) => {
      if (part.type === 'code' && part.code) {
        return <CodeBlock key={partIdx} code={part.code} language={part.lang} />;
      }

      if (!part.text) return null;

      // Split the text part into paragraphs
      const paragraphs = part.text.split('\n\n');

      return (
        <div key={partIdx} className="space-y-2">
          {paragraphs.map((p, pIdx) => {
            const trimmed = p.trim();
            if (!trimmed) return null;

            // Header 3
            if (trimmed.startsWith('### ')) {
              return (
                <h4
                  key={pIdx}
                  className="text-xs font-bold text-slate-100 uppercase tracking-wider mt-3 mb-1.5 flex items-center gap-1.5 border-b border-slate-800/60 pb-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                  {trimmed.replace('### ', '')}
                </h4>
              );
            }

            // Header 4
            if (trimmed.startsWith('#### ')) {
              return (
                <h5 key={pIdx} className="text-xs font-semibold text-slate-200 mt-2 mb-1">
                  {trimmed.replace('#### ', '')}
                </h5>
              );
            }

            // Markdown Table Detection
            if (trimmed.includes('|') && trimmed.split('\n').length >= 2) {
              const lines = trimmed
                .split('\n')
                .map((l) => l.trim())
                .filter((l) => l.startsWith('|') && l.endsWith('|'));

              if (lines.length >= 2) {
                const headerLine = lines[0];
                const headers = headerLine
                  .split('|')
                  .slice(1, -1)
                  .map((h) => h.trim());
                // Skip separator line (|---|---|)
                const bodyLines = lines.slice(2);

                return (
                  <div key={pIdx} className="my-2 overflow-x-auto rounded border border-slate-800 bg-slate-950/60">
                    <table className="w-full text-left text-[11px] font-mono border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300">
                          {headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-2 font-semibold" dangerouslySetInnerHTML={{ __html: renderInline(h) }} />
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {bodyLines.map((row, rIdx) => {
                          const cells = row
                            .split('|')
                            .slice(1, -1)
                            .map((c) => c.trim());
                          return (
                            <tr key={rIdx} className="hover:bg-slate-900/40 text-slate-200">
                              {cells.map((c, cIdx) => (
                                <td key={cIdx} className="p-2" dangerouslySetInnerHTML={{ __html: renderInline(c) }} />
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }
            }

            // Bullet list
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              const items = trimmed.split('\n').filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));
              return (
                <ul key={pIdx} className="list-disc list-inside space-y-1 text-xs text-slate-300 pl-1">
                  {items.map((it, iIdx) => (
                    <li
                      key={iIdx}
                      dangerouslySetInnerHTML={{
                        __html: renderInline(it.replace(/^[-*]\s*/, '')),
                      }}
                    />
                  ))}
                </ul>
              );
            }

            // Numbered list
            if (/^\d+\.\s/.test(trimmed)) {
              const items = trimmed.split('\n').filter((l) => /^\d+\.\s/.test(l.trim()));
              return (
                <ol key={pIdx} className="list-decimal list-inside space-y-1 text-xs text-slate-300 pl-1">
                  {items.map((it, iIdx) => (
                    <li
                      key={iIdx}
                      dangerouslySetInnerHTML={{
                        __html: renderInline(it.replace(/^\d+\.\s*/, '')),
                      }}
                    />
                  ))}
                </ol>
              );
            }

            return (
              <p
                key={pIdx}
                className="text-xs leading-relaxed text-slate-200"
                dangerouslySetInnerHTML={{ __html: renderInline(trimmed) }}
              />
            );
          })}
        </div>
      );
    });
  };

  return (
    <div
      className={`flex items-start gap-3.5 py-4 ${
        isAssistant ? 'bg-slate-900/30 -mx-4 px-4 rounded-xl border border-slate-800/60' : ''
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isAssistant
            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
            : 'bg-slate-800 text-slate-300 border border-slate-700'
        }`}
      >
        {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 font-mono">
          <span className="text-xs font-semibold text-slate-100">
            {isAssistant ? 'OpsPilot AI Agent' : 'sre-admin'}
          </span>
          <span className="text-[10px] text-slate-500">{message.timestamp}</span>
          {message.confidence && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              <Sparkles className="w-2.5 h-2.5" />
              {message.confidence}% confidence
            </span>
          )}
        </div>

        <div className="space-y-2 font-mono">{renderFormattedContent(message.text)}</div>

        {/* Evidence card if available */}
        {message.evidence && <EvidenceCard evidence={message.evidence} />}

        {/* Suggested follow-up prompts */}
        {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
          <div className="mt-3.5 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Follow-up:</span>
            {message.suggestedFollowUps.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onSelectFollowUp && onSelectFollowUp(p)}
                className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-blue-600/20 text-slate-300 hover:text-blue-300 border border-slate-700 hover:border-blue-500/50 transition cursor-pointer flex items-center gap-1"
              >
                <span>{p}</span>
                <span className="text-blue-400 text-xs">→</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

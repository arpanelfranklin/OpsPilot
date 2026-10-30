import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  Sparkles,
  Loader2,
  RotateCcw,
  Settings,
  Download,
  Trash2,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types/chat';
import { ChatMessage } from './ChatMessage';
import { SuggestedPrompt } from './SuggestedPrompt';
import { AISettingsModal } from './AISettingsModal';
import { aiService } from '../../services/aiService';
import { getAISettings, AISettings } from '../../services/aiLiveProvider';

export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings>(getAISettings());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const defaultPrompts = [
    'Why is the backend unhealthy?',
    'How to resolve INC-102?',
    'Which workloads are using the most memory?',
    'Show all pods in cluster',
    'Write a deployment YAML',
    'What is exit code 137?',
  ];

  useEffect(() => {
    const loadInitial = async () => {
      const history = await aiService.getInitialHistory();
      setMessages(history);
    };
    loadInitial();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessageType = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.sendQuery(query, updatedMessages);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error('Error fetching AI response:', err);
      // Fallback message so user is never left without an answer
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `### System Notice\n\nI encountered an unexpected issue processing that query. Please try asking again or switch AI engine in settings.`,
          confidence: 50,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = async () => {
    const history = await aiService.getInitialHistory();
    setMessages(history);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleExportTranscript = () => {
    if (messages.length === 0) return;
    const content = messages
      .map((m) => `### [${m.timestamp}] ${m.sender.toUpperCase()}\n\n${m.text}\n\n---\n`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `opspilot-chat-session-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getProviderBadge = () => {
    switch (aiSettings.provider) {
      case 'gemini':
        return {
          label: 'Gemini Flash (Live)',
          color: 'bg-indigo-950 text-indigo-300 border-indigo-800',
          icon: Cpu,
        };
      case 'groq':
        return {
          label: 'Groq Llama (Live)',
          color: 'bg-amber-950 text-amber-300 border-amber-800',
          icon: Cpu,
        };
      case 'openai':
        return {
          label: 'OpenAI (Live)',
          color: 'bg-emerald-950 text-emerald-300 border-emerald-800',
          icon: Cpu,
        };
      default:
        return {
          label: 'Autonomous SRE Engine',
          color: 'bg-blue-950 text-blue-300 border-blue-800',
          icon: Sparkles,
        };
    }
  };

  const badge = getProviderBadge();
  const BadgeIcon = badge.icon;

  return (
    <div className="tech-card flex flex-col h-[calc(100vh-140px)] max-h-[850px]">
      {/* Chat header */}
      <div className="p-4 border-b border-devops-border bg-slate-900/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-slate-100 font-mono">
                OpsPilot Diagnostic Assistant
              </h3>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono border flex items-center gap-1 ${badge.color}`}
              >
                <BadgeIcon className="w-3 h-3" />
                <span>{badge.label}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Target: <span className="text-slate-300">prod-cluster-alpha</span> (Kubernetes v1.29.2 • SRE Autonomous Agent)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* AI Settings Config */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 px-2.5 rounded-md text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition flex items-center gap-1.5 text-xs font-mono"
            title="Configure AI Engine (Gemini / OpenAI / Groq / Local)"
          >
            <Settings className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">AI Engine</span>
          </button>

          {/* Export Transcript */}
          <button
            onClick={handleExportTranscript}
            disabled={messages.length === 0}
            className="p-1.5 px-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition flex items-center gap-1 text-xs font-mono disabled:opacity-40"
            title="Export session transcript (.md)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Reset / Clear */}
          <button
            onClick={handleResetChat}
            className="p-1.5 px-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition flex items-center gap-1 text-xs font-mono"
            title="Reset conversation to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-slate-800 transition"
            title="Clear all messages"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 font-mono space-y-3">
            <Bot className="w-12 h-12 text-slate-600 mb-1" />
            <p className="text-sm font-semibold text-slate-300">OpsPilot AI SRE Assistant is Ready</p>
            <p className="text-xs text-slate-400 max-w-md">
              Ask anything about your cluster, pod restarts, OOM crashes, Kubernetes architecture, Docker, Linux, or code generation.
            </p>
            <div className="pt-2">
              <SuggestedPrompt prompts={defaultPrompts.slice(0, 4)} onSelectPrompt={(p) => handleSend(p)} />
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onSelectFollowUp={(prompt) => handleSend(prompt)}
            />
          ))
        )}

        {isLoading && (
          <div className="flex items-start gap-3 py-3 font-mono text-xs text-slate-400">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 pt-1.5">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>
                {aiSettings.provider !== 'autonomous' && Boolean(aiSettings.apiKey?.trim())
                  ? `Querying ${aiSettings.provider.toUpperCase()} (${aiSettings.model})...`
                  : 'OpsPilot is analyzing cluster telemetry, logs, and diagnostic knowledge...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts bar */}
      <div className="px-6 py-2.5 border-t border-devops-border bg-slate-900/40">
        <SuggestedPrompt prompts={defaultPrompts} onSelectPrompt={(p) => handleSend(p)} />
      </div>

      {/* Input box */}
      <div className="p-4 border-t border-devops-border bg-slate-900/80">
        <div className="relative flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything: pod crashes, exit code 137, OOM fixes, Dockerfiles, YAML manifests, or general programming..."
            rows={2}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none transition"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="h-11 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs font-mono flex items-center gap-2 transition shadow-md shadow-blue-600/20"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-slate-500">
          <span>Press Enter to send, Shift+Enter for newline</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>AI Ready • Answers any DevOps or coding query</span>
          </span>
        </div>
      </div>

      {/* AI Engine Settings Modal */}
      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={(updated) => setAiSettings(updated)}
      />
    </div>
  );
};

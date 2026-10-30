import React, { useState } from 'react';
import { Settings, Key, Cpu, CheckCircle2, AlertCircle, Loader2, ExternalLink, Sparkles } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import {
  AISettings,
  AIProvider,
  getAISettings,
  saveAISettings,
  testAIConnection,
} from '../../services/aiLiveProvider';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (settings: AISettings) => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [settings, setSettings] = useState<AISettings>(getAISettings());
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleProviderChange = (provider: AIProvider) => {
    let defaultModel = settings.model;
    if (provider === 'gemini') defaultModel = 'gemini-1.5-flash';
    else if (provider === 'groq') defaultModel = 'llama-3.3-70b-versatile';
    else if (provider === 'openai') defaultModel = 'gpt-4o-mini';

    setSettings((prev) => ({
      ...prev,
      provider,
      model: defaultModel,
    }));
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testAIConnection(settings);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Connection test failed',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    saveAISettings(settings);
    onSaved(settings);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Engine Configuration"
      subtitle="Choose between the built-in autonomous SRE engine or connect a live cloud LLM"
      maxWidth="lg"
    >
      <div className="space-y-5 font-mono text-xs">
        {/* Provider Selector Cards */}
        <div>
          <label className="block text-slate-300 font-semibold mb-2">Select AI Engine:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Autonomous Engine */}
            <div
              onClick={() => handleProviderChange('autonomous')}
              className={`p-3 rounded-lg border cursor-pointer transition flex flex-col justify-between ${
                settings.provider === 'autonomous'
                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    Autonomous SRE (Built-in)
                  </span>
                  {settings.provider === 'autonomous' && (
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Zero setup. 100% offline. Instant answers for any Kubernetes, incident, or coding question.
                </p>
              </div>
              <span className="mt-2 text-[10px] text-emerald-400 font-semibold">Active by default</span>
            </div>

            {/* Google Gemini */}
            <div
              onClick={() => handleProviderChange('gemini')}
              className={`p-3 rounded-lg border cursor-pointer transition flex flex-col justify-between ${
                settings.provider === 'gemini'
                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    Google Gemini API
                  </span>
                  {settings.provider === 'gemini' && (
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Gemini 1.5/2.0 Flash. Free tier available with Google AI Studio key.
                </p>
              </div>
              <span className="mt-2 text-[10px] text-blue-400 font-semibold">Live Cloud LLM</span>
            </div>

            {/* Groq */}
            <div
              onClick={() => handleProviderChange('groq')}
              className={`p-3 rounded-lg border cursor-pointer transition flex flex-col justify-between ${
                settings.provider === 'groq'
                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-amber-400" />
                    Groq Cloud (Llama 3.3)
                  </span>
                  {settings.provider === 'groq' && (
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Ultra-low latency inference with Llama-3.3-70b.
                </p>
              </div>
              <span className="mt-2 text-[10px] text-amber-400 font-semibold">High Speed</span>
            </div>

            {/* OpenAI */}
            <div
              onClick={() => handleProviderChange('openai')}
              className={`p-3 rounded-lg border cursor-pointer transition flex flex-col justify-between ${
                settings.provider === 'openai'
                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    OpenAI API
                  </span>
                  {settings.provider === 'openai' && (
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Direct connection with GPT-4o or GPT-4o-mini.
                </p>
              </div>
              <span className="mt-2 text-[10px] text-emerald-400 font-semibold">OpenAI Compatible</span>
            </div>
          </div>
        </div>

        {/* Live LLM Configuration Fields */}
        {settings.provider !== 'autonomous' && (
          <div className="space-y-4 p-4 rounded-lg bg-slate-900/70 border border-slate-800">
            {/* API Key */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-400" />
                  API Key
                </label>
                {settings.provider === 'gemini' && (
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Get free Gemini API Key</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  placeholder={
                    settings.provider === 'gemini'
                      ? 'AIzaSy...'
                      : settings.provider === 'groq'
                      ? 'gsk_...'
                      : 'sk-...'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 pl-3 pr-16 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-2 px-2 py-0.5 text-[10px] text-slate-400 hover:text-slate-200 bg-slate-800 rounded"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Stored locally in your browser session. Never shared or sent to any other third party.
              </p>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Target Model:</label>
              <select
                value={settings.model}
                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {settings.provider === 'gemini' && (
                  <>
                    <option value="gemini-1.5-flash">gemini-1.5-flash (Fast & Recommended)</option>
                    <option value="gemini-2.0-flash">gemini-2.0-flash (Latest)</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro (High Reasoning)</option>
                  </>
                )}
                {settings.provider === 'groq' && (
                  <>
                    <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile</option>
                    <option value="llama-3.1-8b-instant">llama-3.1-8b-instant</option>
                  </>
                )}
                {settings.provider === 'openai' && (
                  <>
                    <option value="gpt-4o-mini">gpt-4o-mini</option>
                    <option value="gpt-4o">gpt-4o</option>
                  </>
                )}
              </select>
            </div>

            {/* Connection Test Result */}
            {testResult && (
              <div
                className={`p-2.5 rounded border text-[11px] flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-800 text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className="truncate">{testResult.message}</span>
              </div>
            )}

            {/* Test Connection Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !settings.apiKey.trim()}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Test Connection</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-[10px] text-slate-500">
            {settings.provider === 'autonomous'
              ? 'Autonomous engine requires no external API keys.'
              : 'Requests are routed securely directly to the AI provider.'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-slate-400 hover:text-slate-200 text-xs hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <Button onClick={handleSave} variant="primary">
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

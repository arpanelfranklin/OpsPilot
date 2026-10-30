import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Bot, Shield, Save, CheckCircle2, Server } from 'lucide-react';
import { useCluster } from '../context/ClusterContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

export const Settings: React.FC = () => {
  const { environment, setEnvironment, cluster } = useCluster();
  const { addToast } = useToast();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [autoDiagnosis, setAutoDiagnosis] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('60m');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Settings Saved (Simulation)',
      description: 'Configuration preferences updated locally for Week 1 demonstration.',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-mono text-white tracking-tight">
            OpsPilot System Settings
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Manage cluster connections, alerting parameters, AI confidence levels, and RBAC credentials.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="tech-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-devops-border">
            <Server className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-100">General & Cluster Preferences</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Default Cluster</label>
              <input
                type="text"
                disabled
                value={cluster?.name || 'prod-cluster-alpha'}
                className="w-full bg-slate-900 border border-slate-800 rounded-md p-2.5 text-slate-300 font-mono opacity-80"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Active Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-md p-2.5 text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              >
                <option value="Production">Production</option>
                <option value="Staging">Staging</option>
                <option value="Development">Development</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="tech-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-devops-border">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">Notification & Incident Alerts</h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-200 block">Email Incident Alerts</span>
                <span className="text-[11px] text-slate-400">
                  Send critical CrashLoopBackOff & OOM notification emails to on-call engineers
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-200 block">Slack Webhook Broadcasts</span>
                <span className="text-[11px] text-slate-400">
                  Stream high & critical severity incident summaries to #devops-ops channel
                </span>
              </div>
              <input
                type="checkbox"
                checked={slackAlerts}
                onChange={(e) => setSlackAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* AI Operations Intelligence Settings */}
        <div className="tech-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-devops-border">
            <Bot className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-100">AI Diagnostic Parameters</h3>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-400 font-medium">AI Confidence Threshold for Automated Recommendations</label>
                <span className="text-blue-400 font-bold">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Recommendations with confidence below this score require manual verification.
              </p>
            </div>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-200 block">Autonomous Log Correlation</span>
                <span className="text-[11px] text-slate-400">
                  Automatically fetch and analyze pod container logs on CrashLoopBackOff detection
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoDiagnosis}
                onChange={(e) => setAutoDiagnosis(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Security & Session Info */}
        <div className="tech-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-devops-border">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">Security & RBAC Scope</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-3 bg-slate-900/60 rounded border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Active Role</span>
              <span className="text-slate-200 font-semibold mt-0.5 block">
                ClusterAdmin (sre-admin)
              </span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Authentication Engine</span>
              <span className="text-slate-200 font-semibold mt-0.5 block">
                Simulated Mock OAuth2 / JWT (Week 1)
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" icon={Save}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};

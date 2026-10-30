import { MetricDataPoint, ActivityEvent } from '../types/metric';

export const mockResourceMetrics: MetricDataPoint[] = [
  { timestamp: '10:15', time: '10:15', cpu: 32, memory: 54, network: 120 },
  { timestamp: '10:20', time: '10:20', cpu: 35, memory: 55, network: 140 },
  { timestamp: '10:25', time: '10:25', cpu: 34, memory: 56, network: 135 },
  { timestamp: '10:30', time: '10:30', cpu: 38, memory: 58, network: 180 },
  { timestamp: '10:35', time: '10:35', cpu: 45, memory: 64, network: 290 },
  { timestamp: '10:40', time: '10:40', cpu: 58, memory: 78, network: 410 },
  { timestamp: '10:41', time: '10:41', cpu: 67, memory: 92, network: 550 },
  { timestamp: '10:42', time: '10:42', cpu: 44, memory: 98, network: 480 }, // OOM & restart spike
  { timestamp: '10:45', time: '10:45', cpu: 42, memory: 61, network: 320 },
  { timestamp: '10:50', time: '10:50', cpu: 40, memory: 60, network: 280 },
  { timestamp: '10:55', time: '10:55', cpu: 42, memory: 61, network: 310 },
];

export const mockRecentActivities: ActivityEvent[] = [
  {
    id: 'act-1',
    time: '10:45',
    title: 'Remediation awaiting approval',
    description: 'AI proposed memory limit increase for chat-backend',
    type: 'ai',
    severity: 'warning',
  },
  {
    id: 'act-2',
    time: '10:44',
    title: 'Diagnosis generated',
    description: 'Root cause identified: OOMKilled on container termination',
    type: 'ai',
    severity: 'info',
  },
  {
    id: 'act-3',
    time: '10:43',
    title: 'Kubernetes logs collected',
    description: '1500 log lines retrieved from namespace chat-app',
    type: 'k8s',
    severity: 'info',
  },
  {
    id: 'act-4',
    time: '10:42',
    title: 'AI detected CrashLoopBackOff',
    description: 'chat-backend pod restarted with exit code 137',
    type: 'incident',
    severity: 'critical',
  },
  {
    id: 'act-5',
    time: '08:54',
    title: 'Incident INC-101 resolved',
    description: 'Memory usage normalized on chat-backend',
    type: 'incident',
    severity: 'info',
  },
];

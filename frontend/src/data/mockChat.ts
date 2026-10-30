import { ChatMessage } from '../types/chat';

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    timestamp: '10:40',
    text: `Hello, I am OpsPilot, your Kubernetes Operations Assistant.

I am monitoring **prod-cluster-alpha**. I have currently identified **1 degraded deployment** and **1 active incident (INC-102)** requiring your attention.

How can I assist you with cluster operations or root cause investigation today?`,
    suggestedFollowUps: [
      'Why is the backend unhealthy?',
      'Show recent incidents',
      'Which workloads are using the most memory?',
      'Analyze backend deployment',
      'What changed recently?',
    ],
  },
  {
    id: 'msg-demo-q',
    sender: 'user',
    timestamp: '10:42',
    text: 'Why is the backend unhealthy?',
  },
  {
    id: 'msg-demo-a',
    sender: 'assistant',
    timestamp: '10:42',
    confidence: 94,
    text: `I found an issue with the **chat-backend** deployment in namespace \`chat-app\`.

The deployment currently has **1 of 2 replicas available**. The unhealthy pod has restarted **7 times**. The latest container termination reason is **OOMKilled** (Exit Code 137).

### Most Likely Cause
The container exceeded its configured memory limit of **512Mi** during a sudden burst of WebSocket reconnection requests.

### Recommended Next Step
Inspect memory usage and either increase the limit to **1024Mi** or investigate memory growth in the connection handler.`,
    evidence: {
      pods: [
        { name: 'chat-backend-7c9b846-9xk2p', status: 'CrashLoopBackOff', restarts: 7, cpu: '18m', memory: '502Mi (Limit 512Mi)' },
        { name: 'chat-backend-7c9b846-t5wmq', status: 'Running', restarts: 0, cpu: '120m', memory: '310Mi' },
      ],
      metrics: [
        { metric: 'Memory Peak', current: '502Mi', limit: '512Mi', utilization: '98.0%' },
        { metric: 'CPU Usage', current: '18m', limit: '1000m', utilization: '1.8%' },
      ],
      events: [
        { time: '10:43:02', type: 'Warning', reason: 'BackOff', message: 'Back-off 5m0s restarting failed container chat-backend' },
        { time: '10:41:45', type: 'Warning', reason: 'OOMKilled', message: 'Container chat-backend exceeded cgroup memory limit' },
      ],
      logs: [
        { timestamp: '10:41:44.821', level: 'WARN', message: 'ConnectionPool saturated: 1,420 active socket sessions' },
        { timestamp: '10:41:45.102', level: 'FATAL', message: 'Killed process 412 (node) total-vm:894212kB, anon-rss:524288kB, file-rss:0kB' },
      ],
    },
    suggestedFollowUps: [
      'Increase memory limit to 1024Mi',
      'Show logs for chat-backend-7c9b846-9xk2p',
      'Explain exit code 137',
    ],
  },
];

export const mockChatKnowledgeBase: Record<string, Partial<ChatMessage>> = {
  'why is the backend unhealthy?': {
    text: `I found an issue with the **chat-backend** deployment in namespace \`chat-app\`.

The deployment currently has **1 of 2 replicas available**. The unhealthy pod has restarted **7 times**. The latest container termination reason is **OOMKilled**.

### Most Likely Cause
The container exceeded its configured memory limit of **512Mi**.

### Recommended Next Step
Inspect memory usage and either increase the limit or investigate memory growth in the socket session buffer.`,
    confidence: 94,
    evidence: {
      pods: [
        { name: 'chat-backend-7c9b846-9xk2p', status: 'CrashLoopBackOff', restarts: 7, cpu: '18m', memory: '502Mi' },
        { name: 'chat-backend-7c9b846-t5wmq', status: 'Running', restarts: 0, cpu: '120m', memory: '310Mi' },
      ],
      events: [
        { time: '10:43:02', type: 'Warning', reason: 'BackOff', message: 'Back-off restarting failed container' },
        { time: '10:41:45', type: 'Warning', reason: 'OOMKilled', message: 'Container terminated due to memory limit' },
      ],
      metrics: [
        { metric: 'Memory Peak', current: '502Mi', limit: '512Mi', utilization: '98.0%' },
      ],
      logs: [
        { timestamp: '10:41:45', level: 'FATAL', message: 'oom-kill:constraint=CONSTRAINT_MEMCG,target_memcg=/kubepods/chat-backend' },
      ],
    },
  },
  'show recent incidents': {
    text: `Here is the current incident report for **prod-cluster-alpha**:

- **INC-102 (HIGH)**: \`chat-backend\` — *CrashLoopBackOff* (Investigating / Awaiting Approval)
- **INC-101 (MEDIUM)**: \`chat-backend\` — *High memory usage* (Resolved at 08:54)
- **INC-099 (LOW)**: \`auth-service\` — *Readiness Probe Failed* (Resolved yesterday)

Would you like to drill into INC-102 or simulate remediation?`,
    confidence: 98,
    suggestedFollowUps: ['Open incident INC-102', 'How to resolve INC-102?', 'What caused INC-101?'],
  },
  'which workloads are using the most memory?': {
    text: `Top workloads ranked by memory consumption in **prod-cluster-alpha**:

1. **mongodb** (\`chat-app\`): **780Mi / 2Gi** (38% of limit)
2. **chat-backend** (\`chat-app\`): **502Mi / 512Mi** (98% of limit — **CRITICAL**)
3. **prometheus-k8s** (\`monitoring\`): **420Mi / 4Gi** (10.5% of limit)
4. **auth-service** (\`security\`): **190Mi / 512Mi** (37% of limit)
5. **chat-frontend** (\`chat-app\`): **48Mi / 256Mi** (18.7% of limit)`,
    confidence: 96,
    suggestedFollowUps: ['Analyze backend deployment', 'Is mongodb at risk?', 'Show node memory distribution'],
  },
  'analyze backend deployment': {
    text: `### Full Diagnostic Report: \`chat-backend\`

- **Namespace**: \`chat-app\`
- **Desired Replicas**: 2 | **Ready**: 1 (Degraded)
- **Container Image**: \`ghcr.io/opspilot/chat-backend:v1.2.4\`
- **Total Restarts (24h)**: 7
- **Crash Pod**: \`chat-backend-7c9b846-9xk2p\` on \`node-02\`

### AI Root Cause Synthesis
Heap profile traces indicate a socket leak in \`/ws/connect\`. Each client reconnect appends an uncleaned event listener buffer (~350KB), reaching the 512Mi limit under reconnect storms.`,
    confidence: 92,
    suggestedFollowUps: ['Rollback to v1.2.3', 'Scale replicas to 3', 'Restart deployment'],
  },
  'what changed recently?': {
    text: `Recent changes recorded across the cluster in the last 24 hours:

- **10:45**: Remediation recommendation drafted by OpsPilot AI.
- **10:42**: Pod \`chat-backend-7c9b846-9xk2p\` restarted with Exit Code 137.
- **08:21**: Inbound WebSocket traffic spiked by +4,200 connections.
- **Yesterday 16:30**: Deployment \`chat-backend\` updated from \`v1.2.3\` to \`v1.2.4\`.`,
    confidence: 95,
    suggestedFollowUps: ['Compare v1.2.3 and v1.2.4', 'Why is backend unhealthy?', 'Rollback to v1.2.3'],
  },
};

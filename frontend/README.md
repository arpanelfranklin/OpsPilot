# OpsPilot

> **"AI-powered Kubernetes operations and incident intelligence."**

OpsPilot is an AI-powered Kubernetes Operations Agent and SRE dashboard designed to monitor cluster health, diagnose real-time anomalies (such as `CrashLoopBackOff` and `OOMKilled`), correlate telemetry across logs and Prometheus metrics, and streamline incident mitigation.

---

## 🛠 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (SRE / Dark-First Theme)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Charts & Telemetry**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) (Configured for future Spring Boot REST API integration)

---

## 📁 Architecture & Directory Structure

```text
src/
├── types/                 # TypeScript interfaces for Cluster, Workloads, Incidents, Telemetry, and Chat
│   ├── cluster.ts
│   ├── incident.ts
│   ├── workload.ts
│   ├── metric.ts
│   ├── chat.ts
│   └── common.ts
├── data/                  # High-fidelity, isolated mock datasets for Week 1
│   ├── mockCluster.ts     # Multi-cluster and worker node telemetry
│   ├── mockWorkloads.ts   # Deployments, pods (CrashLoopBackOff), and services
│   ├── mockIncidents.ts   # INC-102 (OOMKilled RCA), INC-101, INC-099
│   ├── mockMetrics.ts     # Real-time resource usage curves & activity feed
│   └── mockChat.ts        # Pre-trained DevOps assistant diagnostic knowledge
├── services/              # API Abstraction Layer (Mock-backed in Week 1, Spring Boot ready for Week 2)
│   ├── api.ts             # Central Axios instance with base URL and interceptors
│   ├── clusterService.ts  # Cluster topology and node telemetry methods
│   ├── incidentService.ts # Incident filtering and dry-run remediation endpoints
│   ├── workloadService.ts # Deployment and container state queries
│   └── aiService.ts       # Diagnostic copilot conversation engine
├── context/
│   ├── ClusterContext.tsx # Global active cluster & environment state
│   └── ToastContext.tsx   # System notification engine
├── components/
│   ├── layout/            # Sidebar, Topbar, AppLayout, NotificationDropdown
│   ├── common/            # StatusBadge, SeverityBadge, Modal, ActionConfirmModal, Button, Toast
│   ├── dashboard/         # MetricCard, ResourceUsageChart, WorkloadHealthTable, RecentIncidentsCard, ActivityTimeline
│   ├── cluster/           # ClusterSummaryCard, NodeTable, ResourceGauge
│   ├── incidents/         # IncidentTable, IncidentFilterBar, DiagnosisCard, EvidenceList, IncidentTimeline
│   ├── workloads/         # DeploymentsTable, PodsTable, ServicesTable, WorkloadDetailsDrawer
│   └── chat/              # ChatWindow, ChatMessage, EvidenceCard, SuggestedPrompt
└── pages/
    ├── Dashboard.tsx      # Overview with top 5 KPI cards, time-series graphs, and health tables
    ├── Cluster.tsx        # Physical node topology and resource distribution
    ├── Incidents.tsx      # Filterable incident directory (Severity, Status, Service, Search)
    ├── IncidentDetails.tsx# Comprehensive AI Root Cause Analysis (RCA) & Simulation Actions
    ├── Workloads.tsx      # Microservices drawer with Deployments, Pods, and Services
    ├── AIAssistant.tsx    # Autonomous SRE Copilot interface with evidence tabs
    ├── Settings.tsx       # System parameters, AI confidence thresholds, and alerts
    └── NotFound.tsx       # 404 handler
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Execution
```bash
# 1. Clone repository & navigate to directory
cd "DEVOPS FRONTEND"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The application will be accessible at: `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

---

## 🧩 Week 1 Features Implemented

1. **Top Metric KPI Cards**: Real-time cluster status, pod availability (`11/12`), active incident count, CPU (`42%`), and Memory (`61%`).
2. **Interactive Resource Telemetry**: Area charts with view toggles for CPU, Memory, and aggregated metrics.
3. **Cluster & Node Topology**: Multi-node status breakdown with capacity gauges and IP/Zone allocation.
4. **Incident Intelligence (RCA)**:
   - Filter by severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), status, or microservice.
   - Deep-dive into incident **INC-102** (`CrashLoopBackOff` due to `OOMKilled`).
   - Corroborated evidence breakdown with container memory limits, probe logs, and exit codes.
   - Action confirmation modals for simulated remediation (`Restart Deployment`, `Scale`, `Rollback`, `Analyze Again`).
5. **Workloads & Microservices**: Tabbed inspection for Deployments, Pods, and Services with slide-over detail drawer.
6. **DevOps AI Assistant**:
   - Conversational assistant with pre-populated prompt chips (`Why is the backend unhealthy?`, `Which workloads are using the most memory?`).
   - Diagnostic responses containing expandable **Evidence Cards** (Pods, Metrics, Events, Logs).
7. **Simulation Notice Protection**: All dangerous cluster mutation triggers feature dry-run simulation notices to guarantee Week 1 isolation from live clusters.

---

## 🔌 Future Spring Boot Integration (Week 2 Roadmap)

The frontend uses an abstraction layer located in `src/services/`. Connecting to the Spring Boot REST API in Week 2 simply requires replacing the mock data returns with HTTP calls:

```typescript
// Example: src/services/incidentService.ts
import api from './api';

export const incidentService = {
  async getIncidents(filters) {
    // Week 2 Integration:
    const response = await api.get('/incidents', { params: filters });
    return response.data;
  },
  
  async getIncidentById(id: string) {
    const response = await api.get(`/incidents/${id}`);
    return response.data;
  }
};
```

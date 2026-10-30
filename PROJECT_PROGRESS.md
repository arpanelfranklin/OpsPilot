# OpsPilot — Project Progress

> Kubernetes Operations Intelligence Platform — AI-powered incident detection, workload monitoring, and autonomous SRE assistance.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite + Tailwind CSS |
| **Backend** | Spring Boot 4.1.1 (Java 21) |
| **Database** | PostgreSQL (JPA / Hibernate) |
| **AI Layer** | Built-in Autonomous SRE Engine + Live LLM support (Gemini / OpenAI / Groq) |
| **Build** | Maven (mvnw wrapper) |
| **Container** | Docker + compose.yaml |
| **Kubernetes** | k8s/ manifest directory |

---

## Completed Work

### Frontend

#### Pages

| Page | Route | Status |
|------|-------|--------|
| Dashboard | `/dashboard` | Done |
| Cluster Overview | `/cluster` | Done |
| Incidents List | `/incidents` | Done |
| Incident Details | `/incidents/:id` | Done |
| Workloads | `/workloads` | Done |
| AI Assistant | `/assistant` | Done |
| Settings | `/settings` | Done |
| Not Found | `*` | Done |

#### Component Structure
```
frontend/src/
├── components/
│   ├── chat/         — AI chat bubble components
│   ├── cluster/      — cluster cards, node list
│   ├── common/       — shared UI elements
│   ├── dashboard/    — metric charts, activity feed
│   ├── incidents/    — incident list, filters, evidence panels
│   ├── layout/       — AppLayout, sidebar navigation
│   └── workloads/    — deployment, pod, and service tables
├── context/
│   ├── ClusterContext.tsx   — global cluster selector state
│   └── ToastContext.tsx     — notification toast system
├── pages/            — page-level components
├── services/         — API service layer
├── types/            — TypeScript interfaces
└── data/             — original mock data files (kept as reference)
```

#### TypeScript Types Defined
- `Incident`, `IncidentEvidence`, `IncidentTimelineEvent` — `types/incident.ts`
- `ClusterInfo`, `NodeItem`, `HealthStatus`, `Environment` — `types/cluster.ts`
- `DeploymentItem`, `PodItem`, `ServiceItem`, `WorkloadEvent`, `ServicePort` — `types/workload.ts`
- `MetricDataPoint`, `ActivityEvent` — `types/metric.ts`
- `ChatMessage`, `ChatEvidenceGroup` and sub-types — `types/chat.ts`

#### AI Assistant Engine
- **Autonomous SRE Engine** (`services/aiEngine.ts`) — keyword-based offline reasoning with Kubernetes domain knowledge, confidence scoring, and evidence assembly
- **Live LLM Provider** (`services/aiLiveProvider.ts`) — pluggable provider supporting Gemini, OpenAI (GPT-4o), and Groq; activated when an API key is configured in Settings
- **AI Service** (`services/aiService.ts`) — routes queries between live LLM and autonomous engine with seamless fallback

#### Frontend to Backend Integration (Completed)

| Service File | Endpoints Called |
|---|---|
| `services/incidentService.ts` | `GET /api/v1/incidents`, `GET /api/v1/incidents/:key`, `POST /api/v1/incidents/:key/actions` |
| `services/clusterService.ts` | `GET /api/v1/cluster/overview`, `/cluster/all`, `/cluster/nodes`, `/cluster/metrics`, `/cluster/activities` |
| `services/workloadService.ts` | `GET /api/v1/workloads/deployments`, `/workloads/pods`, `/workloads/services`, `/workloads/summary` |

#### Vite Dev Proxy
- Proxy configured in `vite.config.ts` — all `/api/*` requests from the dev server (port 5173) automatically forward to `http://localhost:8080`, avoiding CORS issues in development.

---

### Backend (Spring Boot)

#### Package Structure
```
src/main/java/com/example/OpsPilot/
├── OpsPilotApplication.java
├── config/
│   └── CorsConfig.java              — CORS rules for localhost:5173 and 3000
├── controller/
│   ├── IncidentController.java      — /api/v1/incidents/**
│   ├── WorkloadController.java      — /api/v1/workloads/**
│   └── ClusterController.java       — /api/v1/cluster/**
├── dto/
│   ├── IncidentDTO.java             — nested: DiagnosisDTO, EvidenceDTO, TimelineEventDTO
│   ├── WorkloadDTO.java             — nested: DeploymentDTO, PodDTO, ServiceDTO, WorkloadSummaryDTO
│   ├── ClusterDTO.java              — nested: ClusterInfoDTO, NodeDTO, ClusterSummaryDTO
│   ├── MetricDTO.java
│   └── ActivityEventDTO.java
├── entity/
│   ├── Incident.java                — evidenceJson + timelineJson stored as TEXT
│   ├── Deployment.java
│   ├── Pod.java
│   ├── K8sService.java
│   ├── ClusterInfo.java
│   ├── Node.java
│   ├── MetricDataPoint.java
│   ├── ActivityEvent.java
│   └── User.java
├── enums/
│   ├── Severity.java                — LOW, MEDIUM, HIGH, CRITICAL
│   └── IncidentStatus.java          — OPEN, INVESTIGATING, RESOLVED, CLOSED
├── repository/
│   ├── IncidentRepository.java
│   ├── DeploymentRepository.java    — findByNamespace()
│   ├── PodRepository.java           — findByNamespace()
│   ├── K8sServiceRepository.java    — findByNamespace()
│   ├── ClusterInfoRepository.java   — findByClusterKey()
│   ├── NodeRepository.java
│   ├── MetricRepository.java
│   └── ActivityEventRepository.java
├── service/
│   ├── IncidentService.java         — CRUD + DTO mapping + filtering
│   ├── WorkloadService.java         — deployments/pods/services + summary
│   ├── ClusterService.java          — cluster overview + nodes + metrics + activities
│   └── DataSeederService.java       — seeds DB from mock data on first startup
└── exception/                       — ready for GlobalExceptionHandler
```

#### REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/incidents` | List incidents (filter: severity, status, service) |
| GET | `/api/v1/incidents/{key}` | Get incident by key (INC-102) or numeric ID |
| POST | `/api/v1/incidents/{key}/actions` | Trigger remediation action |
| GET | `/api/v1/workloads/deployments` | List deployments (filter: namespace) |
| GET | `/api/v1/workloads/pods` | List pods (filter: namespace) |
| GET | `/api/v1/workloads/services` | List K8s services (filter: namespace) |
| GET | `/api/v1/workloads/summary` | Aggregate workload health summary |
| GET | `/api/v1/cluster/overview` | Cluster overview (param: clusterKey) |
| GET | `/api/v1/cluster/all` | List all clusters |
| GET | `/api/v1/cluster/nodes` | List cluster nodes |
| GET | `/api/v1/cluster/metrics` | Resource metrics time-series |
| GET | `/api/v1/cluster/activities` | Recent activity feed |

#### Data Seeding
- `DataSeederService` runs at startup via `CommandLineRunner`
- Seeds **3 incidents**, **5 deployments**, **6 pods**, **4 K8s services**, **3 cluster infos**, **3 nodes**, **11 metric data points**, **5 activity events**
- Idempotent — only seeds if tables are empty

---

## Infrastructure

| File | Purpose |
|------|---------|
| `Dockerfile` | Containerise the Spring Boot backend |
| `compose.yaml` | Docker Compose with backend + PostgreSQL |
| `k8s/` | Kubernetes manifests directory |
| `frontend/vite.config.ts` | Vite dev server with /api proxy to backend |

---

## How to Run

### Prerequisites
- Java 21
- Node.js 18+ / npm
- PostgreSQL on localhost:5432 (db: postgres, user: postgres, password: secret)
  OR use `docker compose up` to start PostgreSQL automatically

### Start Backend
```bash
# From project root
./mvnw spring-boot:run
# Backend at http://localhost:8080
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend at http://localhost:5173
```

On first startup the backend auto-seeds all data from the mock files — no manual DB inserts needed.

---

## Things Still To Do

| Item | Priority | Notes |
|------|----------|-------|
| Global Exception Handler | Medium | Return consistent JSON errors on 404/500 |
| Pagination for incidents | Medium | Add page and size query params |
| Authentication / JWT | High | User entity exists, no auth wired yet |
| Real Kubernetes integration | Future | Replace seed data with live K8s API calls |
| Chat history persistence | Future | Save ChatMessages to DB |
| WebSocket live updates | Future | Push incident updates to frontend in real-time |
| Frontend .env file | Low | VITE_API_BASE_URL for production builds |

---

*Generated on 2026-10-30*

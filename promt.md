# OPSPILOT — LIVE KUBERNETES INTEGRATION & CLUSTER EXPLORER

## 1. Project Context

I am developing OpsPilot, a Kubernetes Operations Intelligence Platform, as a Software Engineering + DevOps project.

The existing application consists of:

**Frontend**
- React 18
- TypeScript
- Vite
- Tailwind CSS

**Backend**
- Spring Boot 4.1.1
- Java 21
- Maven
- Spring Data JPA
- PostgreSQL

**Infrastructure**
- Docker
- Docker Compose
- Kubernetes manifests
- kind for local Kubernetes development

The application already contains:
- Dashboard
- Cluster Overview
- Incidents
- Incident Details
- Workloads
- AI Assistant
- Settings

The backend already contains:
- IncidentController
- WorkloadController
- ClusterController
- IncidentService
- WorkloadService
- ClusterService
- DataSeederService
- PostgreSQL entities and repositories
- Existing REST APIs under `/api/v1/`

The frontend already has API service files and a Vite development proxy.

**IMPORTANT: This is an extension of an existing project. Do not create a new application or rewrite the existing architecture.**

## 2. Objective

Implement real Kubernetes integration so OpsPilot can communicate with a running Kubernetes cluster and retrieve actual infrastructure information.

The primary objective is to build a new feature called:

**Live Cluster Explorer**

A faculty member should be able to open OpsPilot, connect to a Kubernetes cluster, select a namespace, inspect pods and deployments, view actual container logs, and inspect Kubernetes events.

The application must retrieve information directly from the Kubernetes API using the official Kubernetes Java Client.

The first implementation must be READ-ONLY.

No Kubernetes resources should be modified by OpsPilot during this phase.

## 3. Required Architecture

Implement the following architecture:

React Frontend
    |
    | HTTP REST API
    |
Spring Boot Backend
    |
    ├── Kubernetes Configuration
    |
    ├── Kubernetes Cluster Service
    |
    ├── Kubernetes Workload Service
    |
    ├── Kubernetes Log Service
    |
    └── Kubernetes Event Service
             |
             |
    Kubernetes Java Client
             |
             |
       Kubernetes API
             |
       Actual Cluster

The Kubernetes integration must be independent of the existing database and mock-data implementation.

Do not directly mix Kubernetes API calls into JPA repositories.

Keep Kubernetes resource retrieval separate from database persistence.

## 4. Inspect the Existing Repository First

Before implementing anything:

1. Inspect the entire existing backend package structure.
2. Inspect pom.xml.
3. Inspect IncidentController, WorkloadController and ClusterController.
4. Inspect WorkloadService and ClusterService.
5. Inspect existing DTOs and entities.
6. Inspect frontend routing and navigation.
7. Inspect existing frontend service files.
8. Inspect compose.yaml, Dockerfile and nginx.conf.
9. Inspect the k8s directory and existing manifests.

Identify existing reusable functionality.

Prepare a short implementation plan before changing files.

Preserve existing API contracts unless there is a clear reason to extend them.

Do not delete existing mock data functionality. It may still be useful for development and offline demonstrations.

## 5. Kubernetes Java Client Integration

Add the official Kubernetes Java Client dependency.

Repository:
https://github.com/kubernetes-client/java

Use a version compatible with the existing Java 21 and Spring Boot project.

Do not introduce an incompatible dependency version.

### Kubernetes configuration

Create:

kubernetes/
├── config/
│   └── KubernetesConfig.java

The configuration should support two environments.

**Local development:**

- Load the developer's kubeconfig.
- Use the current Kubernetes context.
- Connect to the local kind cluster.
- Never commit kubeconfig files or credentials.

**In-cluster deployment:**

- Support ServiceAccount authentication.
- Use the Kubernetes API endpoint and credentials provided by the cluster environment.
- Do not require a developer's local kubeconfig in production.

Make configuration environment-aware.

Expose connection failures clearly instead of silently falling back to mock data.

## 6. Backend Package Structure

Create a dedicated package without disrupting existing packages.

Suggested structure:

kubernetes/
├── config/
│   └── KubernetesConfig.java
│
├── controller/
│   └── KubernetesController.java
│
├── service/
│   ├── KubernetesClusterService.java
│   ├── KubernetesNamespaceService.java
│   ├── KubernetesWorkloadService.java
│   ├── KubernetesLogService.java
│   └── KubernetesEventService.java
│
├── dto/
│   ├── K8sConnectionDTO.java
│   ├── K8sNamespaceDTO.java
│   ├── K8sClusterDTO.java
│   ├── K8sNodeDTO.java
│   ├── K8sPodDTO.java
│   ├── K8sContainerDTO.java
│   ├── K8sDeploymentDTO.java
│   ├── K8sServiceDTO.java
│   ├── K8sEventDTO.java
│   └── PodLogDTO.java
│
├── mapper/
│   ├── PodMapper.java
│   ├── DeploymentMapper.java
│   └── NodeMapper.java
│
└── exception/
    └── KubernetesException.java

Adapt names if existing conventions differ.

Keep controllers thin and business logic inside services.

## 7. Required Backend REST APIs

Base URL:

`/api/v1/kubernetes`

### A. Cluster connection

GET `/connection`

Purpose:
Check whether the backend can communicate with the Kubernetes API server.

Example response:

{
  "connected": true,
  "clusterName": "opspilot-demo",
  "kubernetesVersion": "v1.x",
  "dataSource": "LIVE",
  "message": "Successfully connected to Kubernetes"
}

If connection fails:

{
  "connected": false,
  "dataSource": "UNAVAILABLE",
  "message": "Unable to connect to Kubernetes cluster"
}

Do not expose credentials, kubeconfig contents, tokens or internal secrets.

### B. Namespaces

GET `/namespaces`

Return actual namespaces.

Fields:
- name
- status
- creationTimestamp

Example:

[
  {
    "name": "default",
    "status": "Active",
    "creationTimestamp": "..."
  }
]

### C. Nodes

GET `/nodes`

Return actual cluster nodes.

Fields:
- name
- status
- roles
- kubeletVersion
- operatingSystem
- architecture
- capacity
- allocatable
- creationTimestamp

Node readiness must be determined from Kubernetes node conditions.

Do not confuse node capacity with current resource utilization. Current utilization will be handled through observability integration later.

### D. Pods

GET `/pods`

Optional query parameter:

`namespace`

Examples:

GET `/pods`

GET `/pods?namespace=opspilot-demo`

Return:
- name
- namespace
- phase
- podIP
- nodeName
- restartCount
- creationTimestamp
- labels
- containerStatuses
- readiness
- conditions

Determine display status carefully.

Possible statuses include:
- Running
- Pending
- Succeeded
- Failed
- CrashLoopBackOff
- ImagePullBackOff
- ErrImagePull
- Unknown

Remember that CrashLoopBackOff is generally a container waiting reason, not a Pod phase. Map the container waiting reason into the displayed status when appropriate.

### E. Pod details

GET `/pods/{namespace}/{podName}`

Return detailed information for the selected pod.

Include:
- Pod metadata
- Namespace
- Pod IP
- Node
- Phase
- Restart counts
- Container names
- Container image
- Container states
- Readiness conditions
- Resource requests and limits
- Creation time

Return 404 when the pod does not exist.

### F. Deployments

GET `/deployments`

Optional namespace filter.

Return:
- deployment name
- namespace
- desired replicas
- ready replicas
- available replicas
- updated replicas
- image information
- creation timestamp
- deployment conditions

### G. Services

GET `/services`

Optional namespace filter.

Return:
- name
- namespace
- service type
- cluster IP
- external IPs if available
- ports
- selectors

### H. Pod logs

GET `/pods/{namespace}/{podName}/logs`

Support parameters:

- container
- tailLines
- previous

Example:

GET `/pods/opspilot-demo/demo-backend-123/logs?container=backend&tailLines=200&previous=false`

Requirements:

1. Retrieve actual logs from the Kubernetes API.
2. Support selecting a container.
3. Support retrieving previous container logs.
4. Support a configurable number of lines.
5. Apply a safe maximum of 500 lines.
6. Validate namespace, pod and container names.
7. Return a useful error when the container is not found.
8. Return an appropriate response when logs are unavailable.
9. Do not persist complete logs into PostgreSQL.
10. Do not log sensitive application output into backend logs.

Return a structured response containing:
- namespace
- podName
- containerName
- previous
- logs
- retrievedAt
- dataSource

Do not fabricate log lines.

### I. Kubernetes events

GET `/events`

Optional query parameter:
- namespace

GET `/pods/{namespace}/{podName}/events`

Return:
- event name
- namespace
- involved object
- reason
- message
- type
- count
- firstTimestamp
- lastTimestamp
- source or reporting component

Include both Normal and Warning events.

Sort events by their most relevant occurrence time, newest first.

Do not assume all Kubernetes versions populate the legacy event timestamp fields. Handle newer event fields when available.

## 8. Error Handling

Implement proper exception handling for Kubernetes operations.

Handle:
- Cluster unavailable
- Authentication failure
- Authorization failure
- Namespace not found
- Pod not found
- Container not found
- Invalid request parameters
- Kubernetes API timeout
- Unexpected Kubernetes API errors

Use appropriate HTTP status codes.

Suggested behavior:
- 400 for invalid input.
- 401 or 403 for authentication/authorization failures as appropriate.
- 404 for missing resources.
- 503 when the Kubernetes API is unavailable.
- 500 for unexpected application failures.

Do not return stack traces to the frontend.

Do not silently return seeded mock data when a live API call fails.

Every response should make its source clear.

## 9. Kubernetes RBAC

Create Kubernetes manifests for a dedicated ServiceAccount.

Directory:

k8s/opspilot/
├── serviceaccount.yaml
├── role.yaml
├── rolebinding.yaml

Start with least-privilege read-only permissions.

Example namespace-scoped permissions:

apiGroups:
  - ""
resources:
  - pods
  - pods/log
  - services
  - events
verbs:
  - get
  - list
  - watch

apiGroups:
  - apps
resources:
  - deployments
  - replicasets
verbs:
  - get
  - list
  - watch

For cluster-wide namespace and node discovery, add only the necessary cluster-scoped read permissions.

Use a ClusterRole and ClusterRoleBinding only where necessary.

If faculty should inspect multiple namespaces, design the RBAC scope deliberately.

Do not use:
- cluster-admin
- unrestricted permissions
- wildcard verbs
- wildcard resources

OpsPilot must not have permission to create, delete, update or patch workloads in this phase.

## 10. Frontend: Live Cluster Explorer

Add a new page:

`/live-cluster`

Add a sidebar navigation entry:

Live Cluster

Preserve the existing Dashboard, Cluster, Incidents, Workloads, Assistant and Settings pages.

Suggested frontend structure:

frontend/src/
├── pages/
│   └── LiveClusterPage.tsx
│
├── components/
│   └── kubernetes/
│       ├── ClusterConnectionCard.tsx
│       ├── NamespaceSelector.tsx
│       ├── NodeTable.tsx
│       ├── PodTable.tsx
│       ├── PodDetailsPanel.tsx
│       ├── ContainerSelector.tsx
│       ├── PodLogViewer.tsx
│       ├── KubernetesEvents.tsx
│       └── DeploymentTable.tsx
│
├── services/
│   └── kubernetesService.ts
│
└── types/
    └── kubernetes.ts

Follow existing component and styling conventions.

### A. Connection card

Display:
- Connection status
- Cluster name
- Kubernetes version
- Last successful connection
- Refresh button
- Data source indicator

Show clear states:
- Connected
- Disconnected
- Connecting
- Error

### B. Cluster statistics

Display:
- Total nodes
- Total namespaces
- Total pods
- Running pods
- Unhealthy pods

All statistics must come from live Kubernetes responses.

### C. Namespace selector

Provide a dropdown populated from the namespaces endpoint.

Changing the namespace should refresh:
- Pods
- Deployments
- Services
- Events

### D. Pod table

Display:
- Pod name
- Status
- Namespace
- Node
- Pod IP
- Restart count
- Age or creation time

Allow selecting a pod.

Use status indicators for:
- Running
- Pending
- Failed
- CrashLoopBackOff
- ImagePullBackOff

### E. Pod details panel

When a pod is selected, show:
- Metadata
- Container names
- Images
- Container states
- Restart count
- Readiness
- Resource requests and limits

### F. Log viewer

This is the primary faculty interaction feature.

Create a proper terminal-like log panel.

Features:
- Namespace selection
- Pod selection
- Container selection
- Previous container logs toggle
- Tail line selector
- Refresh button
- Copy logs button
- Scrollable log output
- Loading indicator
- Empty state
- Error state

Provide sensible limits and prevent unbounded log retrieval.

Use a monospaced font and preserve whitespace.

Do not render logs as HTML.

Escape any untrusted log content.

Use clear labels for pod, namespace and container.

### G. Events viewer

Display a timeline or table.

Columns:
- Type
- Reason
- Object
- Message
- Count
- Last occurrence

Highlight Warning events without hiding Normal events.

Allow filtering to the selected pod.

### H. Refresh behavior

Initially implement manual refresh and a configurable polling interval, for example 10–15 seconds.

Avoid unnecessary continuous API requests.

Cancel stale requests when the user switches namespaces or pods.

Display when the data was last refreshed.

Do not claim a static snapshot is a live stream.

## 11. Frontend API Integration

Create `kubernetesService.ts`.

Implement methods for:

- getConnection()
- getNamespaces()
- getNodes()
- getPods(namespace?)
- getPodDetails(namespace, podName)
- getDeployments(namespace?)
- getServices(namespace?)
- getPodLogs(namespace, podName, options)
- getEvents(namespace?)
- getPodEvents(namespace, podName)

Use the existing Axios configuration and API service conventions.

Use the existing Vite proxy in development.

Use the existing Nginx `/api/` reverse proxy in Docker.

Do not introduce a second unrelated API configuration.

Create matching TypeScript interfaces.

## 12. Demo Workload

Create a separate demo namespace:

`opspilot-demo`

Create demo manifests:

k8s/demo/
├── namespace.yaml
├── healthy-frontend.yaml
├── healthy-backend.yaml
├── failed-worker.yaml
└── kustomization.yaml

Include at least:
- One healthy frontend workload.
- One healthy backend workload.
- One deliberately failing worker.

The failing worker should produce meaningful logs and enter CrashLoopBackOff.

Example behavior:

1. Print a startup message.
2. Print a simulated database connection attempt.
3. Print an error message.
4. Exit with a non-zero status.

Use a small, reputable public image with a pinned version.

Do not expose credentials or use a real external database.

The purpose is to simulate an operational failure safely.

Document how to apply and remove the demo manifests.

## 13. Faculty Demonstration Workflow

The final application should support this demonstration:

1. Start the kind cluster.
2. Deploy the demo workloads.
3. Start OpsPilot.
4. Open Live Cluster Explorer.
5. Show the cluster connection status.
6. Select the `opspilot-demo` namespace.
7. Display actual pods.
8. Select the failed worker.
9. Display its actual status and restart count.
10. Open its actual container logs.
11. Show the simulated database connection error.
12. Open Kubernetes events.
13. Explain why the container is restarting.
14. Select a healthy pod and compare its logs.

All displayed infrastructure information must come from Kubernetes.

## 14. Local Development Instructions

Document a complete kind workflow.

Create cluster:

kind create cluster --name opspilot-demo

Verify:

kubectl get nodes
kubectl get namespaces

Deploy demo workloads:

kubectl apply -k k8s/demo/

Apply the read-only RBAC manifests.

Run backend locally using the local kubeconfig.

Run frontend using Vite.

Test:

GET /api/v1/kubernetes/connection

GET /api/v1/kubernetes/namespaces

GET /api/v1/kubernetes/pods?namespace=opspilot-demo

GET /api/v1/kubernetes/events?namespace=opspilot-demo

Then select an actual pod name and test its logs endpoint.

Document cleanup:

kubectl delete -k k8s/demo/

The instructions must explain that a local kind cluster is not automatically accessible from an EC2-hosted backend.

## 15. Docker and Deployment Compatibility

Preserve the existing Docker Compose setup.

Do not break:
- Frontend Dockerfile
- Backend Dockerfile
- compose.yaml
- nginx.conf
- Existing frontend API base URL
- Existing PostgreSQL volume

Support both:

A. Local backend running directly on the developer's machine and connecting to local kind through kubeconfig.

B. Backend running inside Docker with an explicitly configured Kubernetes API connection.

Do not assume localhost inside a container refers to the host machine.

For Docker-based kind access, document the API endpoint and networking requirements. Do not mount a developer's kubeconfig or service-account credentials into containers by default.

For remote deployment, prefer in-cluster ServiceAccount authentication.

## 16. Security Requirements

This phase must remain read-only.

Do not implement:
- Pod deletion
- Deployment restart
- Scaling
- Rollback
- Arbitrary kubectl execution
- Shell execution
- Resource mutation

Validate all path variables and query parameters.

Restrict log retrieval size.

Use least-privilege RBAC.

Never expose Kubernetes credentials.

Do not expose sensitive application logs unnecessarily.

Do not trust frontend controls as a security boundary.

## 17. Testing Requirements

Backend tests:
- Cluster connection success and failure.
- Namespace listing.
- Pod listing by namespace.
- Pod details.
- Deployment listing.
- Service listing.
- Pod logs retrieval.
- Previous container logs.
- Event retrieval.
- Missing namespace.
- Missing pod.
- Missing container.
- Kubernetes authorization failure.
- Kubernetes API unavailable.

Use mocks or a suitable test Kubernetes API fixture for unit tests.

Where practical, add integration tests against a dedicated kind test cluster.

Frontend tests:
- Connection states.
- Namespace selection.
- Pod selection.
- Container selection.
- Log loading and error states.
- Event display.
- Empty states.
- Refresh behavior.

Do not claim a test passed unless it has actually been run.

## 18. Documentation

Update README.md and create `docs/kubernetes-integration.md`.

Document:
- Architecture
- Java client dependency
- Local kubeconfig configuration
- In-cluster authentication
- RBAC
- kind setup
- Demo workload deployment
- API endpoints
- Frontend usage
- Docker networking limitations
- Security decisions
- Known limitations

## 19. Implementation Order

Implement incrementally in the following order.

PHASE A — Backend connectivity:
1. Add Java client dependency.
2. Create KubernetesConfig.
3. Implement connection endpoint.
4. Test local kind connectivity.

PHASE B — Kubernetes resources:
5. Implement namespace listing.
6. Implement node listing.
7. Implement pod listing.
8. Implement pod details.
9. Implement deployment listing.
10. Implement service listing.

PHASE C — Logs and events:
11. Implement pod log retrieval.
12. Implement previous container logs.
13. Implement Kubernetes event retrieval.
14. Test with the deliberately failing workload.

PHASE D — Security:
15. Create ServiceAccount.
16. Create namespace-scoped Role and RoleBinding.
17. Create required cluster-scoped read permissions.
18. Verify forbidden write operations are denied.

PHASE E — Frontend:
19. Create Live Cluster Explorer route.
20. Create connection card.
21. Create namespace selector.
22. Create pod table.
23. Create pod details.
24. Create log viewer.
25. Create events viewer.
26. Integrate all endpoints.

PHASE F — Final verification:
27. Run backend tests.
28. Run frontend tests and build.
29. Test with kind.
30. Verify existing OpsPilot pages still work.
31. Update documentation.

Do not attempt to implement all phases in one unverified code-generation pass.

## 20. Definition of Done

The feature is complete when:

- [ ] Backend connects to a real kind cluster.
- [ ] Connection status is displayed correctly.
- [ ] Real namespaces are displayed.
- [ ] Real nodes are displayed.
- [ ] Real pods are displayed.
- [ ] Real deployments are displayed.
- [ ] Real services are displayed.
- [ ] Pod details are accessible.
- [ ] Actual container logs are displayed.
- [ ] Previous container logs work where available.
- [ ] Kubernetes events are displayed.
- [ ] Namespace filtering works.
- [ ] Pod selection works.
- [ ] Container selection works.
- [ ] Loading and error states work.
- [ ] RBAC is least-privilege and read-only.
- [ ] Demo failure workload works.
- [ ] Faculty can interact with the Live Cluster Explorer.
- [ ] Existing OpsPilot functionality is preserved.
- [ ] Documentation and tests are updated.

## 21. Final Implementation Report

After implementation, provide:

1. Summary of what was implemented.
2. New files created.
3. Existing files modified.
4. Kubernetes API endpoints.
5. RBAC permissions introduced.
6. Commands to run the kind demo.
7. Commands to start OpsPilot.
8. Test results.
9. Screens/pages added.
10. Any incomplete requirements.
11. Confirmation that no real Kubernetes resources can be modified by OpsPilot in this phase.

Prioritize correctness, security, maintainability, and a working faculty demonstration over adding unnecessary features or redesigning the existing application.
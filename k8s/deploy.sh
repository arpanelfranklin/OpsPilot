#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# OpsPilot — Kubernetes Deploy Script
# Usage:
#   ./k8s/deploy.sh           # apply all manifests
#   ./k8s/deploy.sh delete    # tear everything down
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ACTION="${1:-apply}"

# ── 1. Build Docker images and load into kind cluster ──────────────────────
echo "📦  Building Docker images..."
docker build -t opspilot-backend:latest "${SCRIPT_DIR}/.."
docker build -t opspilot-frontend:latest "${SCRIPT_DIR}/../frontend"

echo "📤  Loading images into kind cluster (opspilot-cluster)..."
kind load docker-image opspilot-backend:latest  --name opspilot-cluster
kind load docker-image opspilot-frontend:latest --name opspilot-cluster

if [[ "${ACTION}" == "delete" ]]; then
  echo "🗑️   Deleting all OpsPilot resources..."
  kubectl delete namespace opspilot --ignore-not-found
  echo "✅  Done — namespace 'opspilot' removed."
  exit 0
fi

# ── 2. Base (namespace + secrets) ─────────────────────────────────────────
echo "🔧  Applying base resources..."
kubectl apply -f "${SCRIPT_DIR}/base/namespace.yml"
kubectl apply -f "${SCRIPT_DIR}/base/secrets.yml"

# ── 3. PostgreSQL ──────────────────────────────────────────────────────────
echo "🗄️   Applying PostgreSQL..."
kubectl apply -f "${SCRIPT_DIR}/postgres/pvc.yml"
kubectl apply -f "${SCRIPT_DIR}/postgres/deployment.yml"
kubectl apply -f "${SCRIPT_DIR}/postgres/service.yml"

echo "⏳  Waiting for PostgreSQL to be ready..."
kubectl rollout status deployment/opspilot-postgres -n opspilot --timeout=120s

# ── 4. Backend ─────────────────────────────────────────────────────────────
echo "⚙️   Applying Backend..."
kubectl apply -f "${SCRIPT_DIR}/backend/deployment.yml"
kubectl apply -f "${SCRIPT_DIR}/backend/service.yml"

echo "⏳  Waiting for Backend to be ready..."
kubectl rollout status deployment/opspilot-backend -n opspilot --timeout=180s

# ── 5. Frontend ────────────────────────────────────────────────────────────
echo "🌐  Applying Frontend..."
kubectl apply -f "${SCRIPT_DIR}/frontend/configmap.yml"
kubectl apply -f "${SCRIPT_DIR}/frontend/deployment.yml"
kubectl apply -f "${SCRIPT_DIR}/frontend/service.yml"

echo "⏳  Waiting for Frontend to be ready..."
kubectl rollout status deployment/opspilot-frontend -n opspilot --timeout=60s

# ── 6. Monitoring (Prometheus + Grafana) ───────────────────────────────────
echo "📊  Applying Monitoring stack..."
kubectl apply -f "${SCRIPT_DIR}/monitoring/prometheus-configmap.yml"
kubectl apply -f "${SCRIPT_DIR}/monitoring/prometheus.yml"
kubectl apply -f "${SCRIPT_DIR}/monitoring/grafana.yml"

echo "⏳  Waiting for Prometheus to be ready..."
kubectl rollout status deployment/prometheus -n opspilot --timeout=60s

echo "⏳  Waiting for Grafana to be ready..."
kubectl rollout status deployment/grafana -n opspilot --timeout=60s

# ── 7. Summary ─────────────────────────────────────────────────────────────
echo ""
echo "✅  OpsPilot is running on Kubernetes!"
echo ""
echo "   🌐  Frontend   →  http://localhost:8080"
echo "   📊  Prometheus →  http://localhost:9090"
echo "   📈  Grafana    →  http://localhost:9001  (admin / admin)"
echo ""
kubectl get pods -n opspilot

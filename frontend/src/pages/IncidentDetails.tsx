import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  RotateCcw,
  Maximize2,
  Undo2,
  Bot,
  AlertTriangle,
  Layers,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { incidentService } from '../services/incidentService';
import { Incident } from '../types/incident';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';
import { DiagnosisCard } from '../components/incidents/DiagnosisCard';
import { EvidenceList } from '../components/incidents/EvidenceList';
import { IncidentTimeline } from '../components/incidents/IncidentTimeline';
import { ActionConfirmModal } from '../components/common/ActionConfirmModal';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

export const IncidentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulation Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    type: 'danger' | 'warning' | 'info';
    resource: string;
    description: string;
    actionKey: 'analyze_again' | 'restart_deployment' | 'scale_deployment' | 'rollback';
  }>({
    isOpen: false,
    title: '',
    type: 'info',
    resource: '',
    description: '',
    actionKey: 'analyze_again',
  });

  useEffect(() => {
    const fetchIncident = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await incidentService.getIncidentById(id);
        setIncident(data);
      } catch (err) {
        console.error('Error loading incident details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();
  }, [id]);

  const handleOpenActionModal = (
    title: string,
    type: 'danger' | 'warning' | 'info',
    actionKey: 'analyze_again' | 'restart_deployment' | 'scale_deployment' | 'rollback',
    description: string
  ) => {
    if (!incident) return;
    setModalConfig({
      isOpen: true,
      title,
      type,
      resource: `${incident.service} (namespace: ${incident.namespace})`,
      description,
      actionKey,
    });
  };

  const handleExecuteSimulation = async () => {
    if (!incident) return;
    const res = await incidentService.simulateRemediation(incident.id, modalConfig.actionKey);
    addToast({
      type: 'info',
      title: 'Action Simulation Notice',
      description: res.message,
      duration: 5000,
    });
  };

  if (loading) {
    return <LoadingState message={`Fetching RCA data for incident ${id}...`} />;
  }

  if (!incident) {
    return (
      <EmptyState
        title="Incident Record Not Found"
        description={`The requested incident "${id}" does not exist or has expired from cluster history.`}
        action={{
          label: 'Back to Incidents',
          onClick: () => navigate('/incidents'),
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link to="/incidents" className="hover:text-white flex items-center gap-1 transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Incidents
        </Link>
        <span>/</span>
        <span className="text-slate-200">{incident.id}</span>
      </div>

      {/* Incident Header Box */}
      <div className="tech-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-devops-border">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold font-mono text-white tracking-tight">
                {incident.id}
              </span>
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
            </div>
            <h2 className="text-lg font-semibold text-slate-100 mt-1">{incident.problem}</h2>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mt-1">
              <span>Service: <strong className="text-slate-200">{incident.service}</strong></span>
              <span>Namespace: <strong className="text-slate-200">{incident.namespace}</strong></span>
              <span>Detected: <strong className="text-slate-200">{incident.detectedAt}</strong></span>
            </div>
          </div>

          {/* Action Simulation Buttons Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() =>
                handleOpenActionModal(
                  'Analyze Again',
                  'info',
                  'analyze_again',
                  'Re-query live logs, memory allocation telemetry, and trace signals for fresh root-cause synthesis.'
                )
              }
            >
              Analyze Again
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={RotateCcw}
              onClick={() =>
                handleOpenActionModal(
                  'Restart Deployment',
                  'warning',
                  'restart_deployment',
                  `Execute kubectl rollout restart deployment/${incident.service} -n ${incident.namespace} to flush crashed pods.`
                )
              }
            >
              Restart Deployment
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={Maximize2}
              onClick={() =>
                handleOpenActionModal(
                  'Scale Deployment',
                  'info',
                  'scale_deployment',
                  `Scale deployment/${incident.service} from desired replicas to mitigate traffic pressure.`
                )
              }
            >
              Scale Deployment
            </Button>

            <Button
              variant="danger"
              size="sm"
              icon={Undo2}
              onClick={() =>
                handleOpenActionModal(
                  'Rollback Deployment',
                  'danger',
                  'rollback',
                  `Execute kubectl rollout undo deployment/${incident.service} to revert to the previously healthy image release.`
                )
              }
            >
              Rollback
            </Button>
          </div>
        </div>

        {/* AI Diagnosis Box */}
        <div className="pt-6">
          <DiagnosisCard diagnosis={incident.diagnosis} />
        </div>
      </div>

      {/* Grid: Corroborating Evidence & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EvidenceList evidence={incident.diagnosis.evidence} />
        <IncidentTimeline timeline={incident.timeline} />
      </div>

      {/* Action Simulation Modal */}
      <ActionConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        actionTitle={modalConfig.title}
        actionType={modalConfig.type}
        targetResource={modalConfig.resource}
        description={modalConfig.description}
        onConfirm={handleExecuteSimulation}
      />
    </div>
  );
};

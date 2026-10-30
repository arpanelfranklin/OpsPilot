import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Boxes, Layers, Server, Network, Filter } from 'lucide-react';
import { workloadService } from '../services/workloadService';
import { DeploymentItem, PodItem, ServiceItem } from '../types/workload';
import { DeploymentsTable } from '../components/workloads/DeploymentsTable';
import { PodsTable } from '../components/workloads/PodsTable';
import { ServicesTable } from '../components/workloads/ServicesTable';
import { WorkloadDetailsDrawer } from '../components/workloads/WorkloadDetailsDrawer';
import { ActionConfirmModal } from '../components/common/ActionConfirmModal';
import { LoadingState } from '../components/common/LoadingState';
import { useToast } from '../context/ToastContext';

export const Workloads: React.FC = () => {
  const [searchParams] = useSearchParams();
  const highlightParam = searchParams.get('highlight');
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'deployments' | 'pods' | 'services'>('deployments');
  const [selectedNamespace, setSelectedNamespace] = useState<string>('all');
  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);
  const [pods, setPods] = useState<PodItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedDeployment, setSelectedDeployment] = useState<DeploymentItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulation Modal
  const [simModal, setSimModal] = useState<{
    isOpen: boolean;
    title: string;
    target: string;
    type: 'danger' | 'warning' | 'info';
    desc: string;
  }>({
    isOpen: false,
    title: '',
    target: '',
    type: 'info',
    desc: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [depList, podList, svcList] = await Promise.all([
        workloadService.getDeployments(selectedNamespace),
        workloadService.getPods(selectedNamespace),
        workloadService.getServices(selectedNamespace),
      ]);
      setDeployments(depList);
      setPods(podList);
      setServices(svcList);

      if (highlightParam) {
        const found = depList.find((d) => d.name === highlightParam);
        if (found) setSelectedDeployment(found);
      }
    } catch (err) {
      console.error('Error fetching workloads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedNamespace]);

  const handleSimulateRestart = (name: string) => {
    setSimModal({
      isOpen: true,
      title: 'Restart Deployment',
      target: name,
      type: 'warning',
      desc: `Trigger rolling restart of pods in deployment "${name}". All pods will cycle gracefully.`,
    });
  };

  const handleSimulateScale = (name: string) => {
    setSimModal({
      isOpen: true,
      title: 'Scale Deployment Replicas',
      target: name,
      type: 'info',
      desc: `Update replica count for deployment "${name}" to handle pending traffic surge.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Namespace Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono text-white tracking-tight">
            Kubernetes Workloads & Microservices
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Deployments, ReplicaSets, Pods, and Service Networking across all active namespaces.
          </p>
        </div>

        {/* Namespace selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Namespace:</span>
          <select
            value={selectedNamespace}
            onChange={(e) => setSelectedNamespace(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono rounded-md px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Namespaces</option>
            <option value="chat-app">chat-app</option>
            <option value="security">security</option>
            <option value="monitoring">monitoring</option>
          </select>
        </div>
      </div>

      {/* Workload Category Tabs */}
      <div className="flex items-center gap-2 border-b border-devops-border pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('deployments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
            activeTab === 'deployments'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Deployments</span>
          <span className="px-1.5 py-0.2 rounded bg-black/30 text-[10px]">
            {deployments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pods')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
            activeTab === 'pods'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Pods</span>
          <span className="px-1.5 py-0.2 rounded bg-black/30 text-[10px]">{pods.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
            activeTab === 'services'
              ? 'bg-blue-600 text-white font-medium'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Services & Endpoints</span>
          <span className="px-1.5 py-0.2 rounded bg-black/30 text-[10px]">{services.length}</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {loading ? (
        <LoadingState message="Fetching workload status..." />
      ) : (
        <>
          {activeTab === 'deployments' && (
            <DeploymentsTable
              deployments={deployments}
              onSelectDeployment={(dep) => setSelectedDeployment(dep)}
              selectedId={selectedDeployment?.id}
            />
          )}

          {activeTab === 'pods' && <PodsTable pods={pods} />}

          {activeTab === 'services' && <ServicesTable services={services} />}
        </>
      )}

      {/* Workload Drawer Inspector */}
      <WorkloadDetailsDrawer
        deployment={selectedDeployment}
        onClose={() => setSelectedDeployment(null)}
        onSimulateRestart={handleSimulateRestart}
        onSimulateScale={handleSimulateScale}
      />

      {/* Action Simulation Modal */}
      <ActionConfirmModal
        isOpen={simModal.isOpen}
        onClose={() => setSimModal((prev) => ({ ...prev, isOpen: false }))}
        actionTitle={simModal.title}
        actionType={simModal.type}
        targetResource={simModal.target}
        description={simModal.desc}
        onConfirm={async () => {
          addToast({
            type: 'info',
            title: 'Action Simulation Notice',
            description: `Simulated [${simModal.title}] on ${simModal.target}. Ready for Spring Boot backend integration.`,
          });
        }}
      />
    </div>
  );
};

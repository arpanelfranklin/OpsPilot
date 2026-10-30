import React, { useState, useEffect } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { Incident, IncidentSeverity, IncidentStatus } from '../types/incident';
import { incidentService } from '../services/incidentService';
import { IncidentFilterBar } from '../components/incidents/IncidentFilterBar';
import { IncidentTable } from '../components/incidents/IncidentTable';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';

export const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [severity, setSeverity] = useState<IncidentSeverity | 'ALL'>('ALL');
  const [status, setStatus] = useState<IncidentStatus | 'ALL'>('ALL');
  const [service, setService] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await incidentService.getIncidents({
        severity,
        status,
        service,
        search,
      });
      setIncidents(data);
    } catch (err) {
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [severity, status, service, search]);

  const handleResetFilters = () => {
    setSeverity('ALL');
    setStatus('ALL');
    setService('ALL');
    setSearch('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold font-mono text-white tracking-tight">
            Incident Intelligence & Root Cause Analysis
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            AI-correlated cluster anomalies, automated diagnostic summaries, and remediation queues.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <IncidentFilterBar
        severity={severity}
        onSeverityChange={setSeverity}
        status={status}
        onStatusChange={setStatus}
        service={service}
        onServiceChange={setService}
        search={search}
        onSearchChange={setSearch}
        onReset={handleResetFilters}
      />

      {/* Content */}
      {loading ? (
        <LoadingState message="Filtering incident records..." />
      ) : incidents.length === 0 ? (
        <EmptyState
          title="No Incidents Match Selected Filters"
          description="Try broadening your severity or status filter query to view all historical incident records."
          icon={AlertOctagon}
          action={{
            label: 'Reset Filters',
            onClick: handleResetFilters,
          }}
        />
      ) : (
        <IncidentTable incidents={incidents} />
      )}
    </div>
  );
};

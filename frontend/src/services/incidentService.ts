import { Incident } from '../types/incident';
import api from './api';

export interface IncidentFilterParams {
  severity?: string;
  status?: string;
  service?: string;
  search?: string;
}

export const incidentService = {
  async getIncidents(filters?: IncidentFilterParams): Promise<Incident[]> {
    const params: Record<string, string> = {};
    if (filters?.severity && filters.severity !== 'ALL') params.severity = filters.severity;
    if (filters?.status && filters.status !== 'ALL') params.status = filters.status;
    if (filters?.service && filters.service !== 'ALL') params.service = filters.service;

    const response = await api.get<Incident[]>('/incidents', { params });
    let data = response.data;

    // Client-side search filter (not handled server-side for now)
    if (filters?.search && filters.search.trim()) {
      const query = filters.search.toLowerCase();
      data = data.filter(
        (inc) =>
          inc.id.toLowerCase().includes(query) ||
          inc.service.toLowerCase().includes(query) ||
          inc.problem.toLowerCase().includes(query) ||
          inc.diagnosis.summary.toLowerCase().includes(query)
      );
    }

    return data;
  },

  async getIncidentById(id: string): Promise<Incident | null> {
    try {
      const response = await api.get<Incident>(`/incidents/${id}`);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      throw error;
    }
  },

  /**
   * Trigger a remediation action for an incident.
   * POST /api/v1/incidents/{key}/actions
   */
  async simulateRemediation(
    incidentId: string,
    action: 'analyze_again' | 'restart_deployment' | 'scale_deployment' | 'rollback'
  ): Promise<{ success: boolean; message: string; timestamp: string }> {
    const response = await api.post(`/incidents/${incidentId}/actions`, { action });
    return {
      success: response.data.success,
      message: response.data.message,
      timestamp: response.data.timestamp,
    };
  },
};

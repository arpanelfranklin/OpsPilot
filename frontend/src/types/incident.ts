export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'Investigating' | 'Mitigated' | 'Resolved' | 'Awaiting Approval';

export interface IncidentEvidence {
  label: string;
  value: string;
  type: 'metric' | 'log' | 'event' | 'config';
  detail?: string;
}

export interface IncidentTimelineEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
  type: 'detection' | 'log_collected' | 'diagnosis' | 'recommendation' | 'approval' | 'action';
  author?: string;
}

export interface Incident {
  id: string;
  numericId: number;
  service: string;
  namespace: string;
  problem: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  detectedAt: string;
  resolvedAt?: string;
  diagnosis: {
    summary: string;
    rootCause: string;
    recommendedAction: string;
    confidence: number;
    evidence: IncidentEvidence[];
  };
  timeline: IncidentTimelineEvent[];
}

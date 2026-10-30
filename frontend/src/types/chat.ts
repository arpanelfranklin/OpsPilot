export interface ChatEvidencePod {
  name: string;
  status: string;
  restarts: number;
  cpu: string;
  memory: string;
}

export interface ChatEvidenceEvent {
  time: string;
  type: string;
  reason: string;
  message: string;
}

export interface ChatEvidenceMetric {
  metric: string;
  current: string;
  limit: string;
  utilization: string;
}

export interface ChatEvidenceLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  message: string;
}

export interface ChatEvidenceGroup {
  pods?: ChatEvidencePod[];
  events?: ChatEvidenceEvent[];
  metrics?: ChatEvidenceMetric[];
  logs?: ChatEvidenceLog[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  confidence?: number;
  evidence?: ChatEvidenceGroup;
  suggestedFollowUps?: string[];
}

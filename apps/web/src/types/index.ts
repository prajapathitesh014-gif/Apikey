export interface EndpointModel {
  method: string;
  path: string;
  operationId?: string;
  summary?: string;
  authenticated: boolean;
  parameterNames: string[];
  pathParams: string[];
  hasObjectIdentifier: boolean;
}

export interface FindingItem {
  id: string;
  scan_id: string;
  type: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  confidence: number;
  status: "open" | "verified" | "remediated";
  endpoint_method: string;
  endpoint_path: string;
  summary: string;
  technical_explanation: string;
  impact: string;
  remediation: string;
  code_fix_snippet?: string;
  evidence: {
    requestA: any;
    responseA: any;
    requestB?: any;
    responseB?: any;
    diffSummary: string;
  };
  created_at: string;
}

export interface ScanItem {
  id: string;
  target_id?: string;
  targetUrl: string;
  status: "queued" | "running" | "completed" | "failed";
  progress: number;
  currentPhase: string;
  riskScore: number;
  endpointCount: number;
  counts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  startedAt: string;
  completedAt?: string;
  endpoints: EndpointModel[];
  findings: FindingItem[];
  events: Array<{
    type: string;
    message: string;
    progress: number;
    endpoint?: string;
    timestamp: string;
  }>;
}

export interface TargetItem {
  id: string;
  name: string;
  baseUrl: string;
  environment: string;
  isSandbox: boolean;
  authorizationStatus: string;
  lastScanned?: string;
  riskScore?: number;
}

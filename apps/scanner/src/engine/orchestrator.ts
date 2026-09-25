import { parseOpenApiSpec, ParsedOpenApi, EndpointModel } from "../parser/openapi-parser.js";
import { detectBola, SecurityFindingResult } from "../detectors/bola-detector.js";
import { detectPropertyExposure } from "../detectors/property-exposure.js";
import { detectAuthMisconfig } from "../detectors/auth-misconfig.js";
import { detectRateLimitSignal } from "../detectors/rate-limit-signal.js";
import { explainSecurityFinding } from "../ai/finding-reasoner.js";

export interface ScanTargetInput {
  scanId: string;
  baseUrl: string;
  openApiRaw: string;
  authHeaderUserA?: string;
  authHeaderUserB?: string;
  onEvent?: (event: { type: string; message: string; progress: number; endpoint?: string }) => void;
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
  evidence: any;
  created_at: string;
}

export interface ScanResult {
  scanId: string;
  status: "completed" | "failed";
  progress: number;
  endpointCount: number;
  riskScore: number;
  counts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  endpoints: EndpointModel[];
  findings: FindingItem[];
  events: Array<{ type: string; message: string; progress: number; timestamp: string }>;
}

export async function runSecurityScan(input: ScanTargetInput): Promise<ScanResult> {
  const events: Array<{ type: string; message: string; progress: number; timestamp: string }> = [];
  const emit = (type: string, message: string, progress: number, endpoint?: string) => {
    const item = { type, message, progress, timestamp: new Date().toISOString() };
    events.push(item);
    if (input.onEvent) {
      input.onEvent({ type, message, progress, endpoint });
    }
  };

  emit("PHASE_START", "Starting SentinelAPI security scanner orchestration...", 5);

  // 1. Parse OpenAPI
  let parsed: ParsedOpenApi;
  try {
    emit("PARSER", "Parsing OpenAPI 3.x specification...", 15);
    parsed = parseOpenApiSpec(input.openApiRaw);
    emit(
      "DISCOVERY",
      `Discovered ${parsed.endpoints.length} endpoints and ${Object.keys(parsed.securitySchemes).length} security schemes.`,
      25
    );
  } catch (err: any) {
    emit("ERROR", `OpenAPI Parsing failed: ${err.message}`, 100);
    throw err;
  }

  const findings: FindingItem[] = [];
  const totalEndpoints = parsed.endpoints.length;

  // 2. Iterate endpoints and execute deterministic detectors
  for (let i = 0; i < totalEndpoints; i++) {
    const ep = parsed.endpoints[i];
    const progressPercent = Math.min(85, Math.round(25 + ((i + 1) / totalEndpoints) * 50));

    emit("TESTING_ENDPOINT", `Analyzing ${ep.method} ${ep.path}`, progressPercent, ep.path);

    const detectorPromises: Array<Promise<SecurityFindingResult | null>> = [];

    // Check BOLA
    if (ep.hasObjectIdentifier) {
      detectorPromises.push(
        detectBola({
          baseUrl: input.baseUrl,
          endpoint: ep,
          authHeaderUserA: input.authHeaderUserA,
          authHeaderUserB: input.authHeaderUserB
        })
      );
    }

    // Check Excessive Data Exposure
    detectorPromises.push(
      detectPropertyExposure({
        baseUrl: input.baseUrl,
        endpoint: ep,
        authHeader: input.authHeaderUserA
      })
    );

    // Check Authentication Misconfigurations
    detectorPromises.push(
      detectAuthMisconfig({
        baseUrl: input.baseUrl,
        endpoint: ep
      })
    );

    // Check Rate Limiting Signals
    detectorPromises.push(
      detectRateLimitSignal({
        baseUrl: input.baseUrl,
        endpoint: ep
      })
    );

    const results = await Promise.all(detectorPromises);
    const validResults = results.filter((r): r is SecurityFindingResult => r !== null && r.vulnerable);

    for (const rawFinding of validResults) {
      emit(
        "VULNERABILITY_FOUND",
        `[${rawFinding.severity}] Verified ${rawFinding.type} on ${ep.path}`,
        progressPercent,
        ep.path
      );

      // AI Reasoning & Explanation Synthesis
      const aiExplanation = await explainSecurityFinding({
        findingType: rawFinding.type,
        endpoint: ep.path,
        method: ep.method,
        expected: rawFinding.expectedBehavior,
        observed: rawFinding.observedBehavior,
        evidenceSummary: rawFinding.evidence.diffSummary
      });

      const findingId = `fnd_${Math.random().toString(36).substring(2, 9)}`;
      findings.push({
        id: findingId,
        scan_id: input.scanId,
        type: rawFinding.type,
        title: aiExplanation.title || rawFinding.title,
        severity: rawFinding.severity,
        confidence: aiExplanation.confidence || rawFinding.confidence,
        status: "open",
        endpoint_method: ep.method,
        endpoint_path: ep.path,
        summary: aiExplanation.summary || rawFinding.summary,
        technical_explanation: aiExplanation.technical_explanation,
        impact: aiExplanation.impact,
        remediation: aiExplanation.remediation,
        code_fix_snippet: aiExplanation.code_fix_snippet,
        evidence: rawFinding.evidence,
        created_at: new Date().toISOString()
      });
    }
  }

  // 3. Calculate Risk Score & Severity Counts
  const counts = {
    critical: findings.filter((f) => f.severity === "CRITICAL").length,
    high: findings.filter((f) => f.severity === "HIGH").length,
    medium: findings.filter((f) => f.severity === "MEDIUM").length,
    low: findings.filter((f) => f.severity === "LOW").length
  };

  const riskScore = Math.min(
    100,
    counts.critical * 35 + counts.high * 20 + counts.medium * 10 + counts.low * 5
  );

  emit("COMPLETE", `Scan finished. Found ${findings.length} verified vulnerabilities. Risk Score: ${riskScore}/100`, 100);

  return {
    scanId: input.scanId,
    status: "completed",
    progress: 100,
    endpointCount: totalEndpoints,
    riskScore,
    counts,
    endpoints: parsed.endpoints,
    findings,
    events
  };
}

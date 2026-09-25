import axios from "axios";
import { EndpointModel } from "../parser/openapi-parser.js";

export interface BolaCheckParams {
  baseUrl: string;
  endpoint: EndpointModel;
  authHeaderUserA?: string;
  authHeaderUserB?: string;
  sampleObjectIdA?: string;
}

export interface SecurityFindingResult {
  vulnerable: boolean;
  type: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  confidence: number;
  summary: string;
  expectedBehavior: string;
  observedBehavior: string;
  evidence: {
    requestA: any;
    responseA: any;
    requestB?: any;
    responseB?: any;
    diffSummary: string;
  };
}

export async function detectBola(params: BolaCheckParams): Promise<SecurityFindingResult | null> {
  // BOLA checks require an endpoint with an object identifier (e.g., /orders/{id}) and two test identities
  if (!params.endpoint.hasObjectIdentifier) {
    return null;
  }

  const userAAuth = params.authHeaderUserA || "Bearer demo-token-user-a";
  const userBAuth = params.authHeaderUserB || "Bearer demo-token-user-b";
  const objectIdA = params.sampleObjectIdA || "ord_9841";

  // Form URL with Object ID of User A
  let targetPath = params.endpoint.path;
  if (params.endpoint.pathParams.length > 0) {
    const primaryParam = params.endpoint.pathParams[0];
    targetPath = targetPath.replace(`{${primaryParam}}`, objectIdA).replace(`:${primaryParam}`, objectIdA);
  }

  const fullUrl = `${params.baseUrl.replace(/\/$/, "")}${targetPath}`;

  try {
    // 1. Request by Object Owner (User A)
    const responseA = await axios({
      method: params.endpoint.method,
      url: fullUrl,
      headers: {
        Authorization: userAAuth,
        "X-Sentinel-Scan": "true",
        "Content-Type": "application/json"
      },
      validateStatus: () => true,
      timeout: 5000
    });

    // 2. Cross-Tenant Probe by Unauthorized Identity (User B)
    const responseB = await axios({
      method: params.endpoint.method,
      url: fullUrl,
      headers: {
        Authorization: userBAuth,
        "X-Sentinel-Scan": "true",
        "Content-Type": "application/json"
      },
      validateStatus: () => true,
      timeout: 5000
    });

    // Redaction Helper
    const redact = (data: any) => {
      if (!data) return {};
      const str = typeof data === "string" ? data : JSON.stringify(data);
      return JSON.parse(
        str.replace(/Bearer\s+[a-zA-Z0-9._-]+/gi, "Bearer [REDACTED_SECRET]")
      );
    };

    // If User A gets 200 OK and User B ALSO gets 200 OK for User A's object without authorization check
    if (
      responseA.status === 200 &&
      responseB.status === 200 &&
      responseB.data &&
      (typeof responseB.data === "object" || Array.isArray(responseB.data))
    ) {
      return {
        vulnerable: true,
        type: "BOLA",
        title: `Broken Object Level Authorization on ${params.endpoint.path}`,
        severity: "CRITICAL",
        confidence: 0.96,
        summary: `Endpoint allows Test User B to read/mutate private object '${objectIdA}' belonging to Test User A.`,
        expectedBehavior: `HTTP 403 Forbidden or HTTP 404 Not Found when unauthorized identity (User B) requests object '${objectIdA}'.`,
        observedBehavior: `HTTP 200 OK returned full object payload to unauthorized identity (User B).`,
        evidence: {
          requestA: {
            method: params.endpoint.method,
            url: fullUrl,
            headers: { Authorization: "Bearer [USER_A_TOKEN]" }
          },
          responseA: {
            status: responseA.status,
            body: redact(responseA.data)
          },
          requestB: {
            method: params.endpoint.method,
            url: fullUrl,
            headers: { Authorization: "Bearer [USER_B_TOKEN]" }
          },
          responseB: {
            status: responseB.status,
            body: redact(responseB.data)
          },
          diffSummary: `Authorization validation failed: Cross-tenant identity mismatch was not enforced by server access policies.`
        }
      };
    }
  } catch (error: any) {
    // Sandbox network or unreachable error
    return null;
  }

  return null;
}

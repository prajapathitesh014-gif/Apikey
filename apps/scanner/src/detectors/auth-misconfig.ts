import axios from "axios";
import { EndpointModel } from "../parser/openapi-parser.js";
import { SecurityFindingResult } from "./bola-detector.js";

export async function detectAuthMisconfig(params: {
  baseUrl: string;
  endpoint: EndpointModel;
}): Promise<SecurityFindingResult | null> {
  const fullUrl = `${params.baseUrl.replace(/\/$/, "")}${params.endpoint.path.replace(/{[^}]+}/g, "1")}`;

  // Only test endpoints that are intended to be private/authenticated
  if (!params.endpoint.authenticated && !/admin|users|orders|billing|settings|account/i.test(params.endpoint.path)) {
    return null;
  }

  try {
    // Send unauthenticated request (without Authorization header)
    const response = await axios({
      method: params.endpoint.method,
      url: fullUrl,
      headers: {
        "X-Sentinel-Scan": "true",
        "Content-Type": "application/json"
      },
      validateStatus: () => true,
      timeout: 5000
    });

    // If an authenticated endpoint returns 200 OK without any credentials
    if (response.status === 200 && response.data) {
      return {
        vulnerable: true,
        type: "BROKEN_AUTHENTICATION",
        title: `Unauthenticated Access to Protected Route on ${params.endpoint.path}`,
        severity: "HIGH",
        confidence: 0.92,
        summary: `Endpoint allows unrestricted anonymous access without requiring valid authentication tokens.`,
        expectedBehavior: `HTTP 401 Unauthorized or HTTP 403 Forbidden for unauthenticated requests.`,
        observedBehavior: `HTTP 200 OK returned data without any Authorization header.`,
        evidence: {
          requestA: {
            method: params.endpoint.method,
            url: fullUrl,
            headers: { Authorization: "None (Anonymous)" }
          },
          responseA: {
            status: response.status,
            body: response.data
          },
          diffSummary: `Missing authentication middleware gate on protected route.`
        }
      };
    }
  } catch {
    return null;
  }

  return null;
}

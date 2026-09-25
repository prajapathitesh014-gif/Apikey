import axios from "axios";
import { EndpointModel } from "../parser/openapi-parser.js";
import { SecurityFindingResult } from "./bola-detector.js";

const SENSITIVE_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /api_?key/i,
  /ssn/i,
  /credit_?card/i,
  /cvv/i,
  /admin_?flag/i,
  /is_?admin/i,
  /internal_?note/i,
  /salary/i,
  /tax_?id/i,
  /hash/i,
  /salt/i,
  /jwt/i
];

function extractObjectKeys(obj: any, prefix = ""): string[] {
  let keys: string[] = [];
  if (!obj || typeof obj !== "object") return keys;

  if (Array.isArray(obj)) {
    if (obj.length > 0) {
      keys = keys.concat(extractObjectKeys(obj[0], prefix));
    }
  } else {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      keys.push(fullKey);
      if (value && typeof value === "object") {
        keys = keys.concat(extractObjectKeys(value, fullKey));
      }
    }
  }
  return keys;
}

export async function detectPropertyExposure(params: {
  baseUrl: string;
  endpoint: EndpointModel;
  authHeader?: string;
}): Promise<SecurityFindingResult | null> {
  const fullUrl = `${params.baseUrl.replace(/\/$/, "")}${params.endpoint.path.replace(/{[^}]+}/g, "1")}`;

  try {
    const response = await axios({
      method: params.endpoint.method,
      url: fullUrl,
      headers: {
        Authorization: params.authHeader || "Bearer demo-token-user-a",
        "X-Sentinel-Scan": "true",
        "Content-Type": "application/json"
      },
      validateStatus: () => true,
      timeout: 5000
    });

    if (response.status !== 200 || !response.data || typeof response.data !== "object") {
      return null;
    }

    const observedKeys = extractObjectKeys(response.data);
    const sensitiveKeysFound = observedKeys.filter((k) =>
      SENSITIVE_PATTERNS.some((p) => p.test(k))
    );

    // If sensitive properties are leaked in the response
    if (sensitiveKeysFound.length > 0) {
      return {
        vulnerable: true,
        type: "EXCESSIVE_DATA_EXPOSURE",
        title: `Sensitive Object Property Exposure on ${params.endpoint.path}`,
        severity: "HIGH",
        confidence: 0.94,
        summary: `Endpoint exposes sensitive internal properties (${sensitiveKeysFound.join(", ")}) in response payload.`,
        expectedBehavior: `Response payload should filter internal/sensitive fields before serialization (DTO projection).`,
        observedBehavior: `Received sensitive field(s): ${sensitiveKeysFound.join(", ")} in live HTTP 200 payload.`,
        evidence: {
          requestA: {
            method: params.endpoint.method,
            url: fullUrl
          },
          responseA: {
            status: response.status,
            body: response.data
          },
          diffSummary: `Detected unmasked sensitive properties: [${sensitiveKeysFound.join(", ")}]`
        }
      };
    }
  } catch {
    return null;
  }

  return null;
}

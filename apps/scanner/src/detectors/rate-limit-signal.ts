import axios from "axios";
import { EndpointModel } from "../parser/openapi-parser.js";
import { SecurityFindingResult } from "./bola-detector.js";

export async function detectRateLimitSignal(params: {
  baseUrl: string;
  endpoint: EndpointModel;
}): Promise<SecurityFindingResult | null> {
  const fullUrl = `${params.baseUrl.replace(/\/$/, "")}${params.endpoint.path.replace(/{[^}]+}/g, "1")}`;

  try {
    const res = await axios({
      method: params.endpoint.method,
      url: fullUrl,
      headers: {
        "X-Sentinel-Scan": "true"
      },
      validateStatus: () => true,
      timeout: 5000
    });

    const headers = res.headers;
    const rateLimitHeaders = Object.keys(headers).filter((h) =>
      /ratelimit|retry-after/i.test(h)
    );

    // If no rate-limiting header is advertised on write or auth endpoints
    if (rateLimitHeaders.length === 0 && (params.endpoint.method === "POST" || /login|auth|orders|reset/i.test(params.endpoint.path))) {
      return {
        vulnerable: true,
        type: "UNRESTRICTED_RESOURCE_CONSUMPTION",
        title: `Missing Rate-Limiting Protection on ${params.endpoint.path}`,
        severity: "MEDIUM",
        confidence: 0.85,
        summary: `No rate-limiting headers or throttling defenses detected on high-impact API endpoint.`,
        expectedBehavior: `Endpoint should enforce request throttling and return standard RFC 6585 'RateLimit-*' headers or 429 Too Many Requests.`,
        observedBehavior: `No RateLimit headers present in response metadata.`,
        evidence: {
          requestA: { method: params.endpoint.method, url: fullUrl },
          responseA: { status: res.status, headers: { "content-type": headers["content-type"] } },
          diffSummary: `Missing RateLimit-Limit, RateLimit-Remaining, or 429 responses.`
        }
      };
    }
  } catch {
    return null;
  }

  return null;
}

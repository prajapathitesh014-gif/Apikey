import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

export interface FindingExplanation {
  title: string;
  summary: string;
  technical_explanation: string;
  impact: string;
  remediation: string;
  code_fix_snippet?: string;
  confidence: number;
}

export async function explainSecurityFinding(params: {
  findingType: string;
  endpoint: string;
  method: string;
  expected: string;
  observed: string;
  evidenceSummary: string;
}): Promise<FindingExplanation> {
  // If Gemini API key is configured, use live LLM reasoning
  if (env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json"
        }
      });

      const prompt = `You are a Principal Security Architect at a top application security firm.
Analyze this verified deterministic vulnerability found during a sandbox API scan:

Endpoint: ${params.method} ${params.endpoint}
Vulnerability Category: ${params.findingType}
Expected Behavior: ${params.expected}
Observed Behavior: ${params.observed}
Evidence: ${params.evidenceSummary}

Output a single valid JSON object with the following exact keys:
{
  "title": "Clear concise vulnerability title",
  "summary": "Executive summary of the vulnerability",
  "technical_explanation": "In-depth technical breakdown of the architectural or code flaw",
  "impact": "Real-world business and security impact if exploited in production",
  "remediation": "Exact steps to fix the issue in backend application code",
  "code_fix_snippet": "A short code snippet (Node.js/Express/Fastify/Next.js) showing the secure implementation",
  "confidence": 0.95
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text);
    } catch (err: any) {
      console.warn("AI generation failed, falling back to deterministic explanation:", err.message);
    }
  }

  // Deterministic Expert Security Reasoner Fallback
  if (params.findingType === "BOLA") {
    return {
      title: `Broken Object Level Authorization (BOLA / IDOR) on ${params.endpoint}`,
      summary: `The API failed to validate object ownership. User B was able to access a private record created and owned by User A.`,
      technical_explanation: `The controller queries the database using only the path parameter '${params.endpoint}' without scoping the query to the authenticated session's tenant or user ID (e.g. \`WHERE id = :id\` instead of \`WHERE id = :id AND user_id = :current_user_id\`).`,
      impact: `Critical horizontal privilege escalation. An attacker can enumerate all user IDs and harvest sensitive records across all tenants.`,
      remediation: `Implement tenant-scoped database queries or centralized policy-based authorization (ABAC/RBAC) before returning object data.`,
      code_fix_snippet: `// Secure ownership check\nconst order = await db.orders.findFirst({\n  where: {\n    id: req.params.id,\n    userId: req.user.id // Enforce ownership\n  }\n});\nif (!order) return res.status(404).send({ error: "Order not found" });`,
      confidence: 0.96
    };
  } else if (params.findingType === "EXCESSIVE_DATA_EXPOSURE") {
    return {
      title: `Sensitive Object Property Exposure on ${params.endpoint}`,
      summary: `The endpoint returned raw internal database properties including sensitive fields not intended for public client consumption.`,
      technical_explanation: `The endpoint serializes the full ORM entity directly into the JSON response instead of using a Data Transfer Object (DTO) or selective projection mask.`,
      impact: `Leaked credentials, internal operational flags, or PII can be leveraged by attackers for lateral movement or credential stuffing.`,
      remediation: `Apply explicit output filtering (DTO projection) to exclude sensitive attributes like passwords, tokens, and internal notes.`,
      code_fix_snippet: `// Secure DTO projection\nconst user = await db.user.findUnique({ where: { id } });\n// Only return safe public fields\nconst { passwordHash, internalNotes, ...safeUser } = user;\nreturn res.send(safeUser);`,
      confidence: 0.94
    };
  } else if (params.findingType === "BROKEN_AUTHENTICATION") {
    return {
      title: `Unauthenticated Access to Protected Route on ${params.endpoint}`,
      summary: `The endpoint returned private resources without verifying an Authorization token or active session.`,
      technical_explanation: `The route definition lacks authentication middleware or has an incorrectly configured public route bypass filter.`,
      impact: `Unauthenticated internet actors can access private endpoints and retrieve confidential organizational data.`,
      remediation: `Attach standard JWT/Bearer verification middleware to the route handler and reject unauthenticated requests with HTTP 401.`,
      code_fix_snippet: `// Secure auth middleware\napp.get('/api/protected', { preHandler: [verifyAuthToken] }, async (req, reply) => {\n  return { status: 'success', data: req.user };\n});`,
      confidence: 0.92
    };
  }

  return {
    title: `Unrestricted Resource Consumption on ${params.endpoint}`,
    summary: `The endpoint lacks rate-limiting throttles and headers.`,
    technical_explanation: `No rate-limiting algorithm (token bucket / leaky bucket) is enforced on this endpoint.`,
    impact: `Susceptible to resource exhaustion, automated credential bruteforce, and API denial of service.`,
    remediation: `Apply rate-limiting middleware (e.g., Redis-backed rate limiter) with appropriate limits and standard RFC rate-limit headers.`,
    code_fix_snippet: `// Rate limit middleware\nawait fastify.register(import('@fastify/rate-limit'), {\n  max: 100,\n  timeWindow: '1 minute'\n});`,
    confidence: 0.85
  };
}

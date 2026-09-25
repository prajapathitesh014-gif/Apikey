import { ScanItem, TargetItem, FindingItem } from "@/types";

export const INITIAL_TARGETS: TargetItem[] = [
  {
    id: "tgt_apex_sandbox",
    name: "Apex E-Commerce Sandbox",
    baseUrl: "http://localhost:4000/demo-sandbox",
    environment: "sandbox",
    isSandbox: true,
    authorizationStatus: "Authorized for AST",
    lastScanned: "2 minutes ago",
    riskScore: 78
  },
  {
    id: "tgt_fintech_staging",
    name: "FinPay Core Gateway (Staging)",
    baseUrl: "https://staging-api.finpay.mock",
    environment: "staging",
    isSandbox: true,
    authorizationStatus: "Authorized for AST",
    lastScanned: "1 day ago",
    riskScore: 35
  },
  {
    id: "tgt_healthcare_sandbox",
    name: "MedVault Patient Records Sandbox",
    baseUrl: "https://sandbox-medvault.local",
    environment: "sandbox",
    isSandbox: true,
    authorizationStatus: "Authorized for AST",
    lastScanned: "3 days ago",
    riskScore: 92
  }
];

export const SAMPLE_FINDINGS: FindingItem[] = [
  {
    id: "fnd_bola_9921",
    scan_id: "scan_demo_01",
    type: "BOLA",
    title: "Broken Object Level Authorization on /api/v1/orders/{orderId}",
    severity: "CRITICAL",
    confidence: 0.98,
    status: "open",
    endpoint_method: "GET",
    endpoint_path: "/api/v1/orders/{orderId}",
    summary: "Endpoint allows Test User B to read private order payload belonging to Test User A.",
    technical_explanation: "The query directly selects orders matching only the path parameter ID without validating whether the active JWT subject matches the record's 'ownerUserId'.",
    impact: "Horizontal privilege escalation allowing complete enumeration and exfiltration of all tenant orders.",
    remediation: "Scope database SELECT statements with tenant and user ID filters, or verify ABAC object ownership.",
    code_fix_snippet: `// Secure controller implementation
const order = await prisma.order.findFirst({
  where: {
    id: req.params.orderId,
    ownerUserId: req.user.id // Enforce tenant isolation
  }
});
if (!order) return res.status(404).json({ error: "Order not found" });`,
    evidence: {
      requestA: { method: "GET", url: "/api/v1/orders/ord_9841", auth: "Bearer [USER_A_TOKEN]" },
      responseA: { status: 200, body: { id: "ord_9841", ownerUserId: "usr_alice", total: 1420.50 } },
      requestB: { method: "GET", url: "/api/v1/orders/ord_9841", auth: "Bearer [USER_B_TOKEN]" },
      responseB: { status: 200, body: { id: "ord_9841", ownerUserId: "usr_alice", total: 1420.50 } },
      diffSummary: "User B received HTTP 200 with Alice's order payload. Expected HTTP 403 Forbidden."
    },
    created_at: new Date().toISOString()
  },
  {
    id: "fnd_exp_4412",
    scan_id: "scan_demo_01",
    type: "EXCESSIVE_DATA_EXPOSURE",
    title: "Sensitive Object Property Exposure on /api/v1/users/{userId}/profile",
    severity: "HIGH",
    confidence: 0.94,
    status: "open",
    endpoint_method: "GET",
    endpoint_path: "/api/v1/users/{userId}/profile",
    summary: "Endpoint leaks password_hash, ssn, and internal admin_flags in public JSON payload.",
    technical_explanation: "Direct entity serialization occurred without DTO mapping, exposing internal ORM fields to client callers.",
    impact: "Exposes credential hashes and PII, enabling offline GPU cracking and identity theft.",
    remediation: "Use explicit projection fields or DTO serialization to omit internal sensitive properties.",
    code_fix_snippet: `// DTO projection
const { password_hash, ssn, internal_notes, ...safeUser } = user;
return res.json(safeUser);`,
    evidence: {
      requestA: { method: "GET", url: "/api/v1/users/usr_5501/profile" },
      responseA: {
        status: 200,
        body: {
          username: "alice_vance",
          password_hash: "$2b$12$e8Yy8F41Z9vBw6R4L1q...",
          ssn: "982-12-XXXX",
          admin_flags: { can_impersonate: true }
        }
      },
      diffSummary: "Detected leaked sensitive keys: [password_hash, ssn, admin_flags]"
    },
    created_at: new Date().toISOString()
  },
  {
    id: "fnd_auth_1092",
    scan_id: "scan_demo_01",
    type: "BROKEN_AUTHENTICATION",
    title: "Unauthenticated Access to Protected Route on /api/v1/analytics/export",
    severity: "HIGH",
    confidence: 0.92,
    status: "open",
    endpoint_method: "GET",
    endpoint_path: "/api/v1/analytics/export",
    summary: "Sensitive tenant telemetry and revenue metrics are returned without authentication.",
    technical_explanation: "Route lacks the auth middleware guard in the router definition pipeline.",
    impact: "Unrestricted public data leak of proprietary business metrics.",
    remediation: "Attach JWT verification middleware before invoking handler.",
    code_fix_snippet: `app.get("/api/v1/analytics/export", { preHandler: [requireAuth] }, handler);`,
    evidence: {
      requestA: { method: "GET", url: "/api/v1/analytics/export", headers: { Authorization: "None" } },
      responseA: { status: 200, body: { totalRevenue: 894000, activeTenants: 48 } },
      diffSummary: "Anonymous caller received full analytics payload with HTTP 200."
    },
    created_at: new Date().toISOString()
  }
];

export const INITIAL_SCANS: ScanItem[] = [
  {
    id: "scan_1042",
    targetUrl: "http://localhost:4000/demo-sandbox",
    status: "completed",
    progress: 100,
    currentPhase: "Scan Completed",
    riskScore: 78,
    endpointCount: 4,
    counts: {
      critical: 1,
      high: 2,
      medium: 1,
      low: 0
    },
    startedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    endpoints: [
      { method: "GET", path: "/api/v1/orders/{orderId}", authenticated: true, parameterNames: ["orderId"], pathParams: ["orderId"], hasObjectIdentifier: true },
      { method: "GET", path: "/api/v1/users/{userId}/profile", authenticated: true, parameterNames: ["userId"], pathParams: ["userId"], hasObjectIdentifier: true },
      { method: "GET", path: "/api/v1/analytics/export", authenticated: false, parameterNames: [], pathParams: [], hasObjectIdentifier: false },
      { method: "POST", path: "/api/v1/auth/reset-password", authenticated: false, parameterNames: [], pathParams: [], hasObjectIdentifier: false }
    ],
    findings: SAMPLE_FINDINGS,
    events: [
      { type: "DISCOVERY", message: "Discovered 4 endpoints from OpenAPI 3.0 spec", progress: 25, timestamp: new Date().toISOString() },
      { type: "TESTING", message: "Tested BOLA authorization boundary on /api/v1/orders/{orderId}", progress: 60, timestamp: new Date().toISOString() },
      { type: "VULN", message: "[CRITICAL] Verified BOLA vulnerability on /api/v1/orders/{orderId}", progress: 75, timestamp: new Date().toISOString() },
      { type: "COMPLETE", message: "Scan completed. Risk Score: 78/100", progress: 100, timestamp: new Date().toISOString() }
    ]
  }
];

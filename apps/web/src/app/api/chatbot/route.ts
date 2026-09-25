import { NextResponse } from "next/server";

interface FollowUpPrompt {
  label: string;
  query: string;
}

interface QuickLink {
  label: string;
  href: string;
}

interface KnowledgeItem {
  id: string;
  category: "scanning" | "vulnerabilities" | "remediation" | "navigation" | "sandbox";
  keywords: string[];
  title: string;
  reply: string;
  codeSnippet?: {
    language: string;
    code: string;
    description: string;
  };
  followUps: FollowUpPrompt[];
  quickLinks: QuickLink[];
}

const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: "about-platform",
    category: "navigation",
    keywords: ["what is", "about", "overview", "website", "platform", "sentinelapi", "securemind", "explain", "purpose"],
    title: "About SecureMind AST & SentinelAPI",
    reply: `**SecureMind AST (SentinelAPI)** is a state-of-the-art **Deterministic AST Security Scanner & API Vulnerability Copilot**.

Key Innovations:
• **Abstract Syntax Tree (AST) Spec Traversal**: Parses OpenAPI 3.0 specs and detects missing object authorization boundaries deterministically.
• **Active Security Probe Engine**: Simulates safe, non-destructive BOLA/IDOR, Mass Assignment, and Rate-Limiting attack vectors against sandboxes.
• **Interactive Visual Security Graph**: Maps entities, endpoints, and vulnerability attack surfaces in real-time.
• **Instant Remediation Playbooks**: Generates zero-trust code patches in Node.js, Python, and Go.`,
    followUps: [
      { label: "🚀 How do I start a scan?", query: "How to run an API scan?" },
      { label: "🛡️ What is BOLA/IDOR?", query: "Explain BOLA vulnerability" },
      { label: "🧪 Show Demo Sandbox", query: "Where is the demo sandbox?" }
    ],
    quickLinks: [
      { label: "Go to Dashboard", href: "/dashboard" },
      { label: "Launch New Scan", href: "/scan/new" },
      { label: "Explore Findings", href: "/dashboard/findings" }
    ]
  },
  {
    id: "how-to-scan",
    category: "scanning",
    keywords: ["how to scan", "start scan", "new scan", "run scan", "launch scan", "testing", "openapi", "swagger", "spec"],
    title: "How to Run an AST Security Scan",
    reply: `You can launch a comprehensive security scan in 3 simple steps:

1. Navigate to **[New Scan](/scan/new)**.
2. Select your input format:
   - **Upload OpenAPI Spec**: Drop a \`.json\` or \`.yaml\` file (or click *"Load Apex Sandbox Spec"* for instant demo).
   - **Direct URL**: Enter your target API Base URL.
3. Configure Attack Probes:
   - 🛡️ **BOLA / IDOR Boundary Verification**
   - ⚡ **Mass Assignment & Privileged Field Injection**
   - 🚦 **Rate Limiting & DoS Resistance**
   - 🔑 **Broken Authentication & JWT Parsing**
4. Click **"Launch AST Security Scan"** to watch live telemetry events stream!`,
    followUps: [
      { label: "🔍 How to test BOLA on orders?", query: "How does BOLA testing work on orders?" },
      { label: "📊 Where are past scan results?", query: "Where are scan logs stored?" }
    ],
    quickLinks: [
      { label: "Launch Scan Now", href: "/scan/new" },
      { label: "View Active Scans", href: "/dashboard/scans" }
    ]
  },
  {
    id: "bola-idor",
    category: "vulnerabilities",
    keywords: ["bola", "idor", "broken object", "authorization", "entity", "user id", "orderid"],
    title: "BOLA (Broken Object Level Authorization - API1:2023)",
    reply: `**BOLA** is the **#1 vulnerability in OWASP API Top 10**. It happens when an API exposes object identifiers (like \`/api/v1/orders/{orderId}\` or \`/users/{userId}\`) without verifying that the requesting user owns the object.

### Attack Simulation Example:
User \`user_alice\` logs in, receives token \`token_alice\`, but requests \`/api/v1/orders/ord_9999\` (owned by \`user_bob\`). If the server returns HTTP 200 with Bob's private data instead of HTTP 403 Forbidden, BOLA is confirmed.`,
    codeSnippet: {
      language: "typescript",
      description: "Recommended Remediation (Scoped DB Query)",
      code: `// ❌ VULNERABLE: Direct lookup without owner check
const order = await db.orders.findUnique({ where: { id: orderId } });

// ✅ SECURE: Enforce tenant / user ownership boundary
const order = await db.orders.findFirst({
  where: {
    id: orderId,
    userId: session.user.id // Enforce ownership
  }
});
if (!order) throw new ForbiddenError("Access denied to requested order");`
    },
    followUps: [
      { label: "🛠️ Show Python fix for BOLA", query: "Show Python remediation for BOLA" },
      { label: "🛡️ View BOLA findings in dashboard", query: "Show findings" }
    ],
    quickLinks: [
      { label: "Inspect Findings", href: "/dashboard/findings" },
      { label: "Test Sandbox Target", href: "/dashboard/targets" }
    ]
  },
  {
    id: "mass-assignment",
    category: "vulnerabilities",
    keywords: ["mass assignment", "property injection", "role", "is_admin", "injection", "body"],
    title: "Mass Assignment & Property Injection (API3:2023)",
    reply: `**Mass Assignment** occurs when an API endpoint binds client input directly into internal database models or data structures without strict whitelisting.

### Vulnerability Impact:
An attacker sends \`{ "email": "test@test.com", "role": "superadmin", "credits": 99999 }\` during profile update. If the backend blind-assigns fields, the user escalates privileges to **Admin**!`,
    codeSnippet: {
      language: "typescript",
      description: "Remediation via Zod Schema Whitelisting",
      code: `import { z } from "zod";

// Strict DTO Schema — excludes sensitive fields like 'role' or 'is_admin'
const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).max(50),
  bio: z.string().max(200).optional(),
}).strict(); // Disallow unexpected keys!

export async function updateUser(req: Request) {
  const body = await req.json();
  const safeData = UpdateProfileSchema.parse(body); // Strips unpermitted keys
  await db.users.update({ where: { id: session.user.id }, data: safeData });
}`
    },
    followUps: [
      { label: "🚦 What about Rate Limiting?", query: "How to prevent Rate Limiting issues?" },
      { label: "📊 Go to Reports", query: "How to export security reports?" }
    ],
    quickLinks: [
      { label: "View Finding Details", href: "/dashboard/findings" }
    ]
  },
  {
    id: "rate-limiting",
    category: "vulnerabilities",
    keywords: ["rate limit", "rate-limiting", "ddos", "brute force", "throttling", "429"],
    title: "Rate Limiting & Resource Consumption (API4:2023)",
    reply: `Unrestricted endpoint consumption allows attackers to perform credential stuffing, OTP brute-forcing, and denial of service (DoS).

### SentinelAPI Detection:
The scanner tests sensitive endpoints like \`/api/v1/auth/reset-password\` with burst requests to confirm whether \`429 Too Many Requests\` and \`Retry-After\` headers are properly enforced.`,
    codeSnippet: {
      language: "typescript",
      description: "Fastify / Express Rate Limiter Middleware",
      code: `import rateLimit from "@fastify/rate-limit";

// Rate limit sensitive endpoints to 5 requests per 15 minutes
await fastify.register(rateLimit, {
  max: 5,
  timeWindow: "15 minutes",
  keyGenerator: (req) => req.ip || req.headers["x-forwarded-for"],
  errorResponseBuilder: () => ({
    statusCode: 429,
    error: "Too Many Requests",
    message: "Security rate limit exceeded. Please try again in 15 minutes."
  })
});`
    },
    followUps: [
      { label: "🧪 Test Sandbox Rate Limit", query: "Where is the demo sandbox?" },
      { label: "🚀 Start new scan", query: "How to run an API scan?" }
    ],
    quickLinks: [
      { label: "Target Sandboxes", href: "/dashboard/targets" },
      { label: "Launch Scan", href: "/scan/new" }
    ]
  },
  {
    id: "demo-sandbox",
    category: "sandbox",
    keywords: ["sandbox", "mock", "demo", "localhost:4000", "test api", "target", "local"],
    title: "Live Mock Sandbox Environment",
    reply: `SentinelAPI includes a **Live Mock Sandbox API** running locally on port **4000** (\`http://localhost:4000/demo-sandbox\`):

### Available Testing Endpoints:
• 🔓 \`GET /api/v1/orders/{orderId}\` — *Simulated BOLA vulnerability*
• 👤 \`GET /api/v1/users/{userId}/profile\` — *Object data exposure*
• 📊 \`GET /api/v1/analytics/export\` — *Unauthenticated privileged export*
• 🔑 \`POST /api/v1/auth/reset-password\` — *Missing rate limit testbed*

All requests against this sandbox are safely isolated and pre-authorized for AST security audits.`,
    followUps: [
      { label: "🚀 Scan the Sandbox now", query: "How to run an API scan?" },
      { label: "📑 Export scan report", query: "How to export security reports?" }
    ],
    quickLinks: [
      { label: "View Sandbox Targets", href: "/dashboard/targets" },
      { label: "Inspect OpenAPI Spec", href: "/api/demo/spec" }
    ]
  },
  {
    id: "reports-compliance",
    category: "remediation",
    keywords: ["report", "export", "pdf", "compliance", "download", "summary", "audit"],
    title: "Executive Reports & Compliance Audits",
    reply: `You can generate and export multi-format security reports from the **[Executive Reports](/dashboard/reports)** section:

• 📄 **Executive PDF Summary**: High-level risk score, CVSS breakdown, and executive compliance metrics.
• 📦 **Machine-Readable JSON Spec**: Direct ingestion into CI/CD pipelines, SIEM (Splunk, Datadog), and GitHub Actions.
• 🛠️ **Remediation Patch Bundle**: Ready-to-commit code patches formatted as diffs for developers.`,
    followUps: [
      { label: "📊 Go to Dashboard", query: "Give me a tour of all pages" },
      { label: "🔍 View all vulnerabilities", query: "Explain BOLA vulnerability" }
    ],
    quickLinks: [
      { label: "Download Reports", href: "/dashboard/reports" },
      { label: "Dashboard Overview", href: "/dashboard" }
    ]
  },
  {
    id: "sitemap-tour",
    category: "navigation",
    keywords: ["tour", "pages", "sitemap", "menu", "navigate", "where is", "sections", "help"],
    title: "Interactive Platform Navigation Tour",
    reply: `Here is your complete guide to all sections of **SecureMind AST**:

• 📊 **[Dashboard](/dashboard)**: Central command center with risk metrics, scan trends, and live node graph.
• 🚀 **[New Scan](/scan/new)**: Upload OpenAPI specs or URLs to trigger automated AST scanning.
• 📡 **[Scans Manager](/dashboard/scans)**: Historical audit logs and real-time execution progress.
• 🛡️ **[Security Findings](/dashboard/findings)**: CVSS 3.1 scores, verified cURL proof-of-concepts, and code fixes.
• 🎯 **[Target Sandboxes](/dashboard/targets)**: Manage staging environments and verify zero-trust credentials.
• 📑 **[Executive Reports](/dashboard/reports)**: Generate and export compliance audit reports.`,
    followUps: [
      { label: "🚀 Start a Scan", query: "How to run an API scan?" },
      { label: "🛡️ What is BOLA?", query: "Explain BOLA vulnerability" }
    ],
    quickLinks: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Findings", href: "/dashboard/findings" },
      { label: "Targets", href: "/dashboard/targets" },
      { label: "Reports", href: "/dashboard/reports" }
    ]
  }
];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const cleanQuery = message.toLowerCase().trim();

    // Match query against Knowledge Items
    let bestMatch = KNOWLEDGE_ITEMS.find(item =>
      item.keywords.some(kw => cleanQuery.includes(kw))
    );

    if (!bestMatch) {
      bestMatch = {
        id: "general-copilot",
        category: "navigation",
        keywords: [],
        title: "SecureMind AST AI Copilot",
        reply: `I'm here to help you get the most out of **SecureMind AST**! 

Here are the most popular topics you can explore:
• **Running Security Scans**: Upload OpenAPI 3.0 specs to detect vulnerabilities automatically.
• **BOLA / IDOR Testing**: Learn how object-level authorization flaws are discovered and fixed.
• **Remediation Code**: Get ready-to-use TypeScript, Python, and Go security patches.
• **Demo Sandbox**: Safely test AST attacks against our local testbed API.

Select one of the suggested questions below or ask me anything!`,
        followUps: [
          { label: "🚀 How to run an API scan?", query: "How to run an API scan?" },
          { label: "🛡️ What is BOLA / IDOR?", query: "Explain BOLA vulnerability" },
          { label: "⚡ What is Mass Assignment?", query: "Explain Mass Assignment flaw" },
          { label: "🗺️ Give me a tour of all pages", query: "Give me a tour of all pages" }
        ],
        quickLinks: [
          { label: "🚀 Launch Scan", href: "/scan/new" },
          { label: "📊 Go to Dashboard", href: "/dashboard" },
          { label: "🛡️ View Findings", href: "/dashboard/findings" }
        ]
      };
    }

    return NextResponse.json({
      id: bestMatch.id,
      title: bestMatch.title,
      reply: bestMatch.reply,
      codeSnippet: bestMatch.codeSnippet,
      followUps: bestMatch.followUps,
      quickLinks: bestMatch.quickLinks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

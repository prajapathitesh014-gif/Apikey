import { NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const KNOWLEDGE_BASE = [
  {
    keywords: ["what is", "about", "overview", "website", "platform", "sentinelapi", "purpose", "explain"],
    title: "About SentinelAPI Platform",
    reply: `**SentinelAPI** is an advanced **Automated AST (Abstract Syntax Tree) Security Scanner & API Vulnerability Testing Platform**.

Key Capabilities:
• **Deterministic AST Parser**: Analyzes OpenAPI 3.0 specs and AST code trees to identify parameter risks.
• **Active Security Probe Engine**: Safely tests APIs against OWASP API Security Top 10 vulnerabilities (BOLA/IDOR, Broken Authentication, Mass Assignment, Rate Limiting, SSRF).
• **Interactive Visual Security Graph**: Real-time visual network mapping authorization boundaries and vulnerability paths.
• **Instant Remediation Playbooks**: Copy-paste security patches for Python, Node.js, and Go.`,
    quickLinks: [
      { label: "Go to Dashboard", href: "/dashboard" },
      { label: "Start a New Scan", href: "/scan/new" },
      { label: "View Targets", href: "/dashboard/targets" }
    ]
  },
  {
    keywords: ["how to scan", "start scan", "new scan", "run scan", "testing", "openapi", "swagger"],
    title: "How to Run a Security Scan",
    reply: `To start an automated API security scan:

1. Click **"New Scan"** in the top navigation or go to [/scan/new](/scan/new).
2. Choose your input method:
   - **Upload OpenAPI Spec** (\`.json\` or \`.yaml\`)
   - **Enter Base URL** (e.g., your staging API or the built-in Sandbox)
3. Select AST attack vectors:
   - ✅ **BOLA / IDOR Boundary Testing**
   - ✅ **Mass Assignment & Property Injection**
   - ✅ **Rate Limiting & DoS Signals**
   - ✅ **Broken Authentication & JWT Flaws**
4. Click **"Launch AST Security Scan"** to watch live test execution in real time!`,
    quickLinks: [
      { label: "Launch Scan Now", href: "/scan/new" },
      { label: "Live Scans Dashboard", href: "/dashboard/scans" }
    ]
  },
  {
    keywords: ["bola", "idor", "broken object", "authorization", "vulnerability", "flaws"],
    title: "BOLA / IDOR Detection Guide",
    reply: `**BOLA (Broken Object Level Authorization - API1:2023)** occurs when an endpoint accepts user-supplied IDs without verifying ownership.

How SentinelAPI detects BOLA:
1. **Spec Extraction**: Identifies path variables like \`/api/v1/orders/{orderId}\` or \`/api/v1/users/{userId}\`.
2. **Context Switching**: Issues a request with User A's token accessing User B's entity.
3. **Response Verification**: Confirms if private data was leaked with HTTP 200 instead of HTTP 403/401.

You can view active BOLA findings and code fixes on the Findings page.`,
    quickLinks: [
      { label: "Explore Findings", href: "/dashboard/findings" },
      { label: "View Security Graph", href: "/dashboard" }
    ]
  },
  {
    keywords: ["sandbox", "mock", "demo", "localhost:4000", "test api", "target"],
    title: "Built-in Demo Sandbox",
    reply: `SentinelAPI comes with a pre-configured **Live Mock Sandbox API** running on port 4000 (\`/demo-sandbox\`):

Included Endpoints for Safe Testing:
• \`GET /api/v1/orders/{orderId}\` — *Simulated BOLA flaw*
• \`GET /api/v1/users/{userId}/profile\` — *Object-level exposure*
• \`GET /api/v1/analytics/export\` — *Unauthenticated data dump*
• \`POST /api/v1/auth/reset-password\` — *Rate limit absence test*

You can test these targets safely without exposing production environments!`,
    quickLinks: [
      { label: "View Sandbox Target", href: "/dashboard/targets" },
      { label: "Inspect Spec", href: "/api/demo/spec" }
    ]
  },
  {
    keywords: ["pages", "tour", "navigate", "links", "sections", "where is", "help", "menu"],
    title: "Website Sitemap & Navigation",
    reply: `Here are all the key sections of SentinelAPI:

• 📊 **[Dashboard](/dashboard)**: System risk score, scan analytics, and visual attack graph.
• 🚀 **[New Scan](/scan/new)**: Upload OpenAPI specs and trigger deterministic security scans.
• 📡 **[Scans Manager](/dashboard/scans)**: View ongoing and completed scan logs.
• 🛡️ **[Findings & Fixes](/dashboard/findings)**: Detailed CVSS scores, POC curl commands, and code remediation.
• 🎯 **[Targets & Sandboxes](/dashboard/targets)**: Manage staging environments and verify authorization tokens.
• 📑 **[Reports](/dashboard/reports)**: Download compliance and executive summary PDFs/JSON.`,
    quickLinks: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Findings", href: "/dashboard/findings" },
      { label: "Reports", href: "/dashboard/reports" }
    ]
  },
  {
    keywords: ["report", "export", "pdf", "compliance", "download"],
    title: "Exporting Security Reports",
    reply: `You can generate and export executive reports for security audits:

1. Navigate to **[Reports](/dashboard/reports)**.
2. Select your export format:
   - **Executive PDF Summary** (For leadership & compliance teams)
   - **Full JSON Vulnerability Spec** (For CI/CD and SIEM ingestion)
   - **Remediation Patch Bundle** (Code diffs for engineering teams)
3. Filter by severity (Critical, High, Medium, Low) and download instantly.`,
    quickLinks: [
      { label: "Go to Reports", href: "/dashboard/reports" }
    ]
  }
];

export async function POST(req: Request) {
  try {
    const { message, conversationHistory } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const cleanQuery = message.toLowerCase().trim();

    // Match query against Knowledge Base
    let bestMatch = KNOWLEDGE_BASE.find(item => 
      item.keywords.some(kw => cleanQuery.includes(kw))
    );

    if (!bestMatch) {
      // Default smart conversational fallback
      bestMatch = {
        keywords: [],
        title: "Sentinel Security Copilot",
        reply: `I can help you navigate and explore **SentinelAPI**! Here are the most popular actions you can take:

• **Start a Security Scan**: Upload your API spec to uncover BOLA, IDOR, and authorization flaws.
• **Inspect Active Findings**: View CVSS 9.1 critical issues with ready-to-use patch playbooks.
• **Explore Interactive Graph**: See authorization boundaries visualized as a live node graph.
• **Test the Demo Sandbox**: Try safe security tests against our local mock API.

Ask me any specific question like *"How do I test for BOLA?"* or click one of the quick links below!`,
        quickLinks: [
          { label: "🚀 Start New Scan", href: "/scan/new" },
          { label: "📊 Go to Dashboard", href: "/dashboard" },
          { label: "🛡️ View Vulnerabilities", href: "/dashboard/findings" }
        ]
      };
    }

    return NextResponse.json({
      reply: bestMatch.reply,
      title: bestMatch.title,
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

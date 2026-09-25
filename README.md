# SentinelAPI — API Security Copilot
> **Find the vulnerability before the breach headline does.**

Built for **AmiHacks Problem Statement - 3**.

---

## 🌟 Overview

**SentinelAPI** is an Application Security Testing (AST) platform designed for modern engineering teams. It ingests OpenAPI/Swagger specifications and executes safe, deterministic AST verifications against authorized sandboxes. 

Rather than relying on unverified LLM hallucinations, SentinelAPI couples a **deterministic AST verification engine** with **Google Gemini structured security reasoning** to produce **evidence-first vulnerability reports**, interactive security graphs, and copy-paste code patches.

---

## 🚀 Key Features

1. **Interactive Security Boundary Graph**: Visual React Flow graph mapping attack paths from Unauthorized Identity $\rightarrow$ Auth Scheme $\rightarrow$ API Gateway $\rightarrow$ Object ID $\rightarrow$ Exfiltrated Data.
2. **Deterministic BOLA / IDOR Verification**: Probes cross-tenant boundaries with dual test identities in sandboxes.
3. **Sensitive Property Exposure Detection**: Compares OpenAPI-documented DTOs against live JSON payloads to detect unmasked passwords, SSNs, and internal admin flags.
4. **AI Security Copilot (Google Gemini)**: Analyzes verified evidence traces to generate structured root-cause explanations and copy-paste code remediations.
5. **Live Scan Telemetry Streamer**: Real-time progress gauges and streaming terminal logs via SSE.
6. **Side-by-Side Evidence Inspector**: Displays Request A (Owner) vs Request B (Attacker) and diff summaries.
7. **Built-in Mock Sandbox Testbed**: 1-click evaluation against seeded BOLA, Excessive Exposure, and Auth flaws.
8. **Compliance & Executive Reports**: Instant JSON and Markdown export.

---

## 🏗️ Architecture

```
sentinelapi/
├── apps/
│   ├── web/               # Next.js 16 + React 19 + Tailwind CSS + React Flow + Motion
│   └── scanner/           # Node.js + Fastify + OpenAPI Parser + Gemini Reasoning + Mock Sandbox
├── supabase/
│   └── migrations/        # PostgreSQL Schema + Row Level Security (RLS) + Realtime
└── package.json
```

---

## ⚡ Quick Start

### 1. Start the Scanner Engine & Mock Sandbox (Port 4000)
```bash
cd apps/scanner
npm install
npm run dev
```

### 2. Start the Next.js Web Frontend (Port 3000)
```bash
cd apps/web
npm install
npm run dev
```

### 3. Open in Browser
Visit **[http://localhost:3000](http://localhost:3000)**.
- Click **"Scan a Sandbox API"** or **"New Scan"**.
- Click **"Use Demo Vulnerable API"** to load the seeded sandbox spec in 1 click.
- Click **"LAUNCH AST SECURITY SCAN"** to watch the live telemetry, attack graph, and evidence diffs!

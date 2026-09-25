import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env.js";
import { registerMockSandboxRoutes, DEMO_OPENAPI_SPEC } from "./demo/mock-sandbox-api.js";
import { runSecurityScan, ScanResult } from "./engine/orchestrator.js";

const fastify = Fastify({
  logger: true
});

// In-memory scan store for fast access & real-time streaming
const scansMap = new Map<string, any>();
const sseClientsMap = new Map<string, Set<(data: string) => void>>();

async function buildServer() {
  await fastify.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  });

  // Register Built-in Mock Sandbox API Testbed
  registerMockSandboxRoutes(fastify);

  // Health Check
  fastify.get("/health", async () => {
    return { status: "online", service: "sentinelapi-scanner", timestamp: new Date().toISOString() };
  });

  // Demo OpenAPI Spec
  fastify.get("/api/demo/spec", async () => {
    return DEMO_OPENAPI_SPEC;
  });

  // Initiate a Security Scan
  fastify.post("/api/scans/start", async (req, reply) => {
    const body = req.body as {
      targetUrl: string;
      openApiContent: string;
      authHeaderUserA?: string;
      authHeaderUserB?: string;
    };

    if (!body.targetUrl || !body.openApiContent) {
      return reply.status(400).send({ error: "Missing targetUrl or openApiContent" });
    }

    const scanId = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const initialScanState = {
      id: scanId,
      status: "running",
      progress: 0,
      currentPhase: "Initializing scan...",
      targetUrl: body.targetUrl,
      startedAt: new Date().toISOString(),
      findings: [],
      endpoints: [],
      events: []
    };

    scansMap.set(scanId, initialScanState);

    // Run scan asynchronously
    runSecurityScan({
      scanId,
      baseUrl: body.targetUrl,
      openApiRaw: body.openApiContent,
      authHeaderUserA: body.authHeaderUserA,
      authHeaderUserB: body.authHeaderUserB,
      onEvent: (ev) => {
        const current = scansMap.get(scanId);
        if (current) {
          current.progress = ev.progress;
          current.currentPhase = ev.message;
          current.events.push(ev);
        }

        // Broadcast to SSE clients if any
        const clients = sseClientsMap.get(scanId);
        if (clients) {
          const payload = JSON.stringify(ev);
          clients.forEach((send) => send(payload));
        }
      }
    })
      .then((res: ScanResult) => {
        scansMap.set(scanId, {
          ...scansMap.get(scanId),
          status: "completed",
          progress: 100,
          currentPhase: "Scan Completed",
          completedAt: new Date().toISOString(),
          riskScore: res.riskScore,
          counts: res.counts,
          endpointCount: res.endpointCount,
          endpoints: res.endpoints,
          findings: res.findings,
          events: res.events
        });
      })
      .catch((err: any) => {
        const current = scansMap.get(scanId);
        if (current) {
          current.status = "failed";
          current.error = err.message;
        }
      });

    return reply.send({
      scanId,
      status: "running",
      message: "Security scan initiated successfully."
    });
  });

  // Get Scan Status and Findings
  fastify.get("/api/scans/:scanId", async (req, reply) => {
    const { scanId } = req.params as { scanId: string };
    const scan = scansMap.get(scanId);

    if (!scan) {
      return reply.status(404).send({ error: "Scan not found" });
    }

    return reply.send(scan);
  });

  // SSE Realtime Event Stream for Scan
  fastify.get("/api/scans/:scanId/events", (req, reply) => {
    const { scanId } = req.params as { scanId: string };

    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache");
    reply.raw.setHeader("Connection", "keep-alive");
    reply.raw.setHeader("Access-Control-Allow-Origin", "*");

    if (!sseClientsMap.has(scanId)) {
      sseClientsMap.set(scanId, new Set());
    }

    const sendFn = (data: string) => {
      reply.raw.write(`data: ${data}\n\n`);
    };

    sseClientsMap.get(scanId)!.add(sendFn);

    req.raw.on("close", () => {
      const clients = sseClientsMap.get(scanId);
      if (clients) {
        clients.delete(sendFn);
        if (clients.size === 0) sseClientsMap.delete(scanId);
      }
    });
  });

  return fastify;
}

async function start() {
  try {
    const server = await buildServer();
    const port = parseInt(env.PORT, 10) || 4000;
    await server.listen({ port, host: env.HOST });
    console.log(`🚀 SentinelAPI Scanner Engine running at http://localhost:${port}`);
    console.log(`⚡ Mock Sandbox Testbed available at http://localhost:${port}/demo-sandbox`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();

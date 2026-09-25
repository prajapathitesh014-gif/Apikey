import { FastifyInstance } from "fastify";

export const DEMO_OPENAPI_SPEC = {
  openapi: "3.0.3",
  info: {
    title: "Apex E-Commerce Sandbox API",
    description: "Authorized Sandbox API with intentional testbed vulnerabilities for SentinelAPI demonstration.",
    version: "1.4.0"
  },
  servers: [
    {
      url: "http://localhost:4000/demo-sandbox",
      description: "Local Authorized Test Sandbox"
    }
  ],
  paths: {
    "/api/v1/orders/{orderId}": {
      get: {
        summary: "Get Order by Identifier",
        description: "Retrieves order details for a specific order ID.",
        operationId: "getOrderById",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "orderId",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "ord_9841"
          }
        ],
        responses: {
          "200": {
            description: "Order payload",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    userId: { type: "string" },
                    totalAmount: { type: "number" },
                    items: { type: "array" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/users/{userId}/profile": {
      get: {
        summary: "Get User Profile",
        description: "Retrieves public profile information for a user.",
        operationId: "getUserProfile",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "usr_5501"
          }
        ],
        responses: {
          "200": {
            description: "User Profile object"
          }
        }
      }
    },
    "/api/v1/analytics/export": {
      get: {
        summary: "Export Tenant Analytics",
        description: "Returns confidential revenue and telemetry metrics.",
        operationId: "exportAnalytics",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Analytics data"
          }
        }
      }
    },
    "/api/v1/auth/reset-password": {
      post: {
        summary: "Request Password Reset Token",
        description: "Sends password reset instructions to email.",
        operationId: "resetPassword",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Reset initiated"
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

export function registerMockSandboxRoutes(fastify: FastifyInstance) {
  // 1. Seeded BOLA Endpoint
  fastify.get("/demo-sandbox/api/v1/orders/:orderId", async (req, reply) => {
    const { orderId } = req.params as { orderId: string };
    const auth = req.headers.authorization || "";

    // VULNERABILITY: Even if User B is authenticated, it returns User A's private order 'ord_9841'
    return reply.send({
      id: orderId,
      ownerUserId: "usr_alice_owner_9841",
      customerName: "Alice Vance (Test Account A)",
      totalAmount: 1420.50,
      currency: "USD",
      billingAddress: "742 Evergreen Terrace, Springfield",
      items: [
        { sku: "SKU-9921", description: "Enterprise Security Key", quantity: 2, price: 710.25 }
      ],
      createdAt: "2026-09-24T10:30:00Z",
      status: "CONFIRMED"
    });
  });

  // 2. Seeded Excessive Data Exposure Endpoint
  fastify.get("/demo-sandbox/api/v1/users/:userId/profile", async (req, reply) => {
    const { userId } = req.params as { userId: string };

    // VULNERABILITY: Returns raw internal ORM entity including sensitive hashes and internal flags
    return reply.send({
      id: userId,
      username: "alice_vance",
      email: "alice.vance@sandbox-test.local",
      displayName: "Alice Vance",
      // LEAKED SENSITIVE PROPERTIES
      password_hash: "$2b$12$e8Yy8F41Z9vBw6R4L1q.8uu0sXqL9p3Kj0wU9f/9s.8s9s8d",
      ssn: "982-12-XXXX",
      admin_flags: { is_super_admin: false, can_impersonate: true },
      internal_notes: "High-value enterprise sandbox test profile with bypass flags."
    });
  });

  // 3. Seeded Broken Authentication Route
  fastify.get("/demo-sandbox/api/v1/analytics/export", async (req, reply) => {
    // VULNERABILITY: Returns confidential analytics to anyone even without Authorization header!
    return reply.send({
      totalRevenue: 894000,
      activeTenants: 48,
      privateMetrics: {
        churnRate: "1.2%",
        serverCost: "$12,400"
      }
    });
  });

  // 4. Missing Rate-Limiting Route
  fastify.post("/demo-sandbox/api/v1/auth/reset-password", async (req, reply) => {
    // No rate limiting headers returned
    return reply.send({
      status: "OK",
      message: "Reset email dispatched if account exists."
    });
  });

  // OpenAPI Spec endpoint for easy 1-click discovery
  fastify.get("/demo-sandbox/openapi.json", async (req, reply) => {
    return reply.send(DEMO_OPENAPI_SPEC);
  });
}

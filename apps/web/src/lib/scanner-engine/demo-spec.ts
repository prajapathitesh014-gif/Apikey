export const DEMO_OPENAPI_SPEC = {
  openapi: "3.0.3",
  info: {
    title: "Apex E-Commerce Sandbox API",
    description: "Authorized Sandbox API with intentional testbed vulnerabilities for SentinelAPI demonstration.",
    version: "1.4.0"
  },
  servers: [
    {
      url: "http://localhost:3000/api/mock-sandbox",
      description: "Integrated Authorized Test Sandbox"
    }
  ],
  paths: {
    "/api/mock-sandbox/orders/{orderId}": {
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
    "/api/mock-sandbox/users/{userId}/profile": {
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
    "/api/mock-sandbox/analytics/export": {
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
    "/api/mock-sandbox/auth/reset-password": {
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

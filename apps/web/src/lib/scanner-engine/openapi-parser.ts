import * as yaml from "js-yaml";

export interface EndpointModel {
  method: string;
  path: string;
  operationId?: string;
  summary?: string;
  description?: string;
  authenticated: boolean;
  parameterNames: string[];
  pathParams: string[];
  hasObjectIdentifier: boolean;
  requestSchema?: any;
  responseSchema?: any;
  securitySchemes?: string[];
}

export interface ParsedOpenApi {
  title: string;
  version: string;
  baseUrl?: string;
  endpoints: EndpointModel[];
  securitySchemes: Record<string, any>;
}

export function parseOpenApiSpec(rawContent: string): ParsedOpenApi {
  let doc: any;
  try {
    doc = JSON.parse(rawContent);
  } catch {
    try {
      doc = yaml.load(rawContent);
    } catch (e: any) {
      throw new Error(`Failed to parse OpenAPI document as JSON or YAML: ${e.message}`);
    }
  }

  if (!doc || typeof doc !== "object") {
    throw new Error("Invalid OpenAPI specification format.");
  }

  const title = doc.info?.title || "API Target";
  const version = doc.info?.version || "1.0.0";
  const baseUrl = doc.servers?.[0]?.url || "";

  const securitySchemes = doc.components?.securitySchemes || doc.securityDefinitions || {};
  const globalSecurity = doc.security || [];

  const endpoints: EndpointModel[] = [];
  const paths = doc.paths || {};

  for (const [path, pathItem] of Object.entries(paths)) {
    if (typeof pathItem !== "object" || !pathItem) continue;

    const commonParams = ((pathItem as any).parameters || []) as any[];

    for (const [methodRaw, op] of Object.entries(pathItem)) {
      const method = methodRaw.toUpperCase();
      if (!["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].includes(method)) {
        continue;
      }
      const operation = op as any;
      const opSecurity = operation.security !== undefined ? operation.security : globalSecurity;
      const authenticated = Array.isArray(opSecurity) && opSecurity.length > 0;

      const allParams = [...commonParams, ...(operation.parameters || [])];
      const paramNames: string[] = [];
      const pathParams: string[] = [];

      for (const p of allParams) {
        if (p?.name) {
          paramNames.push(p.name);
          if (p.in === "path") {
            pathParams.push(p.name);
          }
        }
      }

      const pathMatches = path.match(/{([^}]+)}/g) || path.match(/:([a-zA-Z0-9_]+)/g) || [];
      for (const m of pathMatches) {
        const cleanName = m.replace(/[{}:]/g, "");
        if (!pathParams.includes(cleanName)) {
          pathParams.push(cleanName);
          if (!paramNames.includes(cleanName)) paramNames.push(cleanName);
        }
      }

      const hasObjectIdentifier = pathParams.some((p) =>
        /id$|^id$|uuid|guid|order|user|account|invoice|item/i.test(p)
      );

      endpoints.push({
        method,
        path,
        operationId: operation.operationId,
        summary: operation.summary || operation.description,
        description: operation.description,
        authenticated,
        parameterNames: paramNames,
        pathParams,
        hasObjectIdentifier,
        securitySchemes: opSecurity.map((s: any) => Object.keys(s)[0]).filter(Boolean)
      });
    }
  }

  return { title, version, baseUrl, endpoints, securitySchemes };
}

"use client";

import React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  Node,
  Edge,
  MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ShieldAlert, User, Key, Globe, Database, FileText } from "lucide-react";

// Custom Node for graph visualization
function SecurityCustomNode({ data }: { data: any }) {
  return (
    <div
      className={`px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg min-w-[200px] transition-all duration-300 ${
        data.variant === "danger"
          ? "bg-rose-950/50 border-rose-500/60 shadow-rose-950/50 ring-1 ring-rose-500/30"
          : data.variant === "warning"
          ? "bg-amber-950/40 border-amber-500/50 shadow-amber-950/30"
          : data.variant === "accent"
          ? "bg-cyan-950/40 border-cyan-500/50 shadow-cyan-950/30"
          : "bg-slate-900/80 border-slate-700/60 shadow-slate-950/40"
      }`}
    >
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-cyan-400" />
      <div className="flex items-center gap-2.5 mb-1.5">
        <div
          className={`p-1.5 rounded-lg ${
            data.variant === "danger"
              ? "bg-rose-500/20 text-rose-400"
              : data.variant === "warning"
              ? "bg-amber-500/20 text-amber-400"
              : data.variant === "accent"
              ? "bg-cyan-500/20 text-cyan-400"
              : "bg-slate-700/40 text-slate-300"
          }`}
        >
          {data.icon || <Globe className="w-4 h-4" />}
        </div>
        <div className="font-semibold text-xs tracking-wide uppercase text-slate-400">
          {data.label}
        </div>
      </div>
      <div className="text-sm font-medium text-slate-100">{data.title}</div>
      {data.subtitle && (
        <div className="text-xs text-slate-400 mt-1 font-mono">{data.subtitle}</div>
      )}
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-cyan-400" />
    </div>
  );
}

const nodeTypes = {
  securityNode: SecurityCustomNode
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "securityNode",
    position: { x: 20, y: 120 },
    data: {
      label: "Identity (Attacker)",
      title: "Test User B",
      subtitle: "Token: eyJhbGciOi...",
      variant: "warning",
      icon: <User className="w-4 h-4" />
    }
  },
  {
    id: "2",
    type: "securityNode",
    position: { x: 280, y: 40 },
    data: {
      label: "Auth Scheme",
      title: "Bearer JWT",
      subtitle: "Role: Standard User",
      variant: "accent",
      icon: <Key className="w-4 h-4" />
    }
  },
  {
    id: "3",
    type: "securityNode",
    position: { x: 280, y: 200 },
    data: {
      label: "Object Identifier",
      title: "ord_9841",
      subtitle: "Owner: Alice Vance",
      variant: "default",
      icon: <Database className="w-4 h-4" />
    }
  },
  {
    id: "4",
    type: "securityNode",
    position: { x: 560, y: 120 },
    data: {
      label: "API Gateway",
      title: "GET /api/v1/orders/{id}",
      subtitle: "Auth Check: Missing Tenant Filter",
      variant: "danger",
      icon: <ShieldAlert className="w-4 h-4" />
    }
  },
  {
    id: "5",
    type: "securityNode",
    position: { x: 840, y: 60 },
    data: {
      label: "Verified Flaw",
      title: "BOLA / IDOR Breached",
      subtitle: "Severity: CRITICAL (98% Conf)",
      variant: "danger",
      icon: <ShieldAlert className="w-4 h-4" />
    }
  },
  {
    id: "6",
    type: "securityNode",
    position: { x: 840, y: 200 },
    data: {
      label: "Exfiltrated Data",
      title: "Order PII & Total $1,420",
      subtitle: "Alice Vance Private Record",
      variant: "warning",
      icon: <FileText className="w-4 h-4" />
    }
  }
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#38bdf8", strokeWidth: 2 }
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    animated: true,
    style: { stroke: "#fbbf24", strokeWidth: 2 }
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    style: { stroke: "#64748b", strokeWidth: 2 }
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    style: { stroke: "#64748b", strokeWidth: 2 }
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#f43f5e" },
    style: { stroke: "#f43f5e", strokeWidth: 2.5 }
  },
  {
    id: "e4-6",
    source: "4",
    target: "6",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" },
    style: { stroke: "#f59e0b", strokeWidth: 2 }
  }
];

export function SecurityGraph({ height = "450px" }: { height?: string }) {
  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#07090e]/90 relative">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        Live Attack Path & Security Boundary Graph
      </div>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="!bg-slate-900 !border-slate-800 !text-slate-300" />
      </ReactFlow>
    </div>
  );
}

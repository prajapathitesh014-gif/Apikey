"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { INITIAL_SCANS, INITIAL_TARGETS, SAMPLE_FINDINGS } from "@/lib/mock-data";
import { FindingItem } from "@/types";
import { getSeverityBadgeColor, getMethodBadgeColor } from "@/lib/utils";
import { EvidenceModal } from "@/components/findings/EvidenceModal";
import {
  ShieldAlert,
  Activity,
  Layers,
  Flame,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Radio,
  Play,
  CheckCircle2,
  Lock,
  Zap,
  Terminal
} from "lucide-react";
import { toast } from "sonner";
import { BrandIcon } from "@/components/ui/BrandLogo";

export default function DashboardOverviewPage() {
  const [selectedFinding, setSelectedFinding] = useState<FindingItem | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [simPackets, setSimPackets] = useState<Array<{ id: number; method: string; path: string; status: string; result: "BLOCKED" | "DETECTED" | "MITIGATED" }>>([
    { id: 1, method: "GET", path: "/api/v1/orders/ord_9999", status: "HTTP 403", result: "MITIGATED" },
    { id: 2, method: "GET", path: "/api/v1/users/usr_admin/profile", status: "HTTP 401", result: "BLOCKED" },
    { id: 3, method: "POST", path: "/api/v1/auth/reset-password", status: "HTTP 429", result: "BLOCKED" },
    { id: 4, method: "GET", path: "/api/v1/analytics/export", status: "HTTP 403", result: "MITIGATED" },
  ]);

  const totalEndpoints = 38;
  const totalFindings = SAMPLE_FINDINGS.length;
  const criticalCount = SAMPLE_FINDINGS.filter((f) => f.severity === "CRITICAL").length;
  const riskScore = 78;

  const handleRunSimulation = () => {
    setSimulating(true);
    toast.info("🔴 Launching Red-Team AST Attack Probe Simulation...");

    setTimeout(() => {
      setSimPackets(prev => [
        {
          id: Date.now(),
          method: "GET",
          path: `/api/v1/orders/ord_${Math.floor(Math.random() * 9000 + 1000)}`,
          status: "HTTP 403 (AST Rule)",
          result: "BLOCKED"
        },
        ...prev.slice(0, 5)
      ]);
      setSimulating(false);
      toast.success("🛡️ Blue-Team Zero-Trust Boundary successfully contained attack vector!");
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Security Command Center</h1>
          <p className="text-xs text-orange-200/70 font-mono mt-1">
            Realtime AST posture across registered sandbox targets & live telemetry
          </p>
        </div>

        <Link
          href="/scan/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-orange-950/60 transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch New Scan</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-3xl border border-orange-500/20 bg-[#140a06]/90 backdrop-blur-md space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-orange-300">
            <span className="text-xs font-semibold font-mono uppercase">API Endpoints</span>
            <Layers className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{totalEndpoints}</span>
            <span className="text-xs text-emerald-400 font-medium font-mono">+4 active</span>
          </div>
          <p className="text-[11px] text-orange-200/60 font-mono">Parsed via OpenAPI 3.0 AST</p>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-3xl border border-orange-500/20 bg-[#140a06]/90 backdrop-blur-md space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-orange-300">
            <span className="text-xs font-semibold font-mono uppercase">Risk Index Score</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-orange-400 font-mono">{riskScore}/100</span>
            <span className="text-xs text-rose-400 font-mono font-bold">Elevated</span>
          </div>
          <p className="text-[11px] text-orange-200/60 font-mono">BOLA authorization gap present</p>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-3xl border border-orange-500/20 bg-[#140a06]/90 backdrop-blur-md space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-orange-300">
            <span className="text-xs font-semibold font-mono uppercase">Active Findings</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{totalFindings}</span>
            <span className="text-xs text-rose-400 font-mono font-bold">{criticalCount} Critical</span>
          </div>
          <p className="text-[11px] text-orange-200/60 font-mono">Deterministic proof-of-concept</p>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-3xl border border-orange-500/20 bg-[#140a06]/90 backdrop-blur-md space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-orange-300">
            <span className="text-xs font-semibold font-mono uppercase">Sandbox Engine</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-mono">ONLINE</span>
          </div>
          <p className="text-[11px] text-orange-200/60 font-mono">Port 4000 AST Testbed Ready</p>
        </div>
      </div>

      {/* Live Red-Team vs. Blue-Team Visualizer Widget */}
      <div className="p-6 rounded-3xl border border-orange-500/30 bg-[#0f0704] space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Live Red-Team vs. Blue-Team Attack Visualizer</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  SIMULATOR
                </span>
              </h2>
              <p className="text-xs text-orange-300/70 font-mono mt-0.5">
                Real-time cross-tenant packet injection vs. Zero-Trust AST Boundary containment
              </p>
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={simulating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-950/60 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${simulating ? "animate-spin" : ""}`} />
            <span>{simulating ? "Injecting Attack Packets..." : "Simulate Live Attack"}</span>
          </button>
        </div>

        {/* Dual Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Red Team (Attacker Probe) */}
          <div className="p-4 rounded-2xl border border-rose-950/60 bg-rose-950/15 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-400 border-b border-rose-900/30 pb-2">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                <span>RED-TEAM PROBE (Attacker Vector)</span>
              </span>
              <span>TOKEN: user_alice (Forged)</span>
            </div>
            <p className="text-xs text-rose-200/80 leading-relaxed font-mono">
              Replaying authentication bearer tokens across alien tenant object identifiers to trigger cross-boundary data leakage.
            </p>
          </div>

          {/* Blue Team (Zero-Trust Guard) */}
          <div className="p-4 rounded-2xl border border-emerald-950/60 bg-emerald-950/15 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400 border-b border-emerald-900/30 pb-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>BLUE-TEAM SHIELD (AST Guard)</span>
              </span>
              <span>ZERO-TRUST: Active</span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed font-mono">
              Dynamic AST tenant boundary interceptor enforcing strictly scoped owner queries before database resolution.
            </p>
          </div>
        </div>

        {/* Live Packet Stream */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-orange-400/80 uppercase tracking-wider font-bold">
            Live Simulated Telemetry Stream:
          </div>
          <div className="rounded-2xl border border-orange-500/20 bg-black/60 overflow-hidden divide-y divide-orange-500/10 font-mono text-xs">
            {simPackets.map((pkt) => (
              <div key={pkt.id} className="p-3 flex items-center justify-between hover:bg-orange-500/10 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-orange-950/80 text-orange-400 text-[10px] font-bold border border-orange-500/30">
                    {pkt.method}
                  </span>
                  <span className="text-slate-200 font-semibold">{pkt.path}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{pkt.status}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    pkt.result === "BLOCKED"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}>
                    {pkt.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Findings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>High Priority Vulnerabilities</span>
          </h2>
          <Link href="/dashboard/findings" className="text-xs text-orange-400 hover:text-orange-300 font-mono font-bold flex items-center gap-1">
            <span>View All ({SAMPLE_FINDINGS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_FINDINGS.slice(0, 2).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedFinding(item)}
              className="p-5 rounded-3xl border border-orange-500/20 bg-[#140a06]/90 hover:border-orange-500/50 transition-all cursor-pointer space-y-3 shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getSeverityBadgeColor(item.severity)}`}>
                    {item.severity}
                  </span>
                  <span className="text-xs font-mono text-orange-300 font-bold">{item.endpoint_method}</span>
                </div>
                <span className="text-[11px] font-mono text-orange-400/70">Score: {(item.confidence * 10).toFixed(1)}/10</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-orange-200 transition-colors">{item.title}</h3>
                <p className="text-xs text-orange-200/70 line-clamp-2 mt-1 font-mono">{item.summary}</p>
              </div>

              <div className="pt-2 border-t border-orange-500/15 flex items-center justify-between text-[11px] font-mono text-orange-400">
                <span>{item.endpoint_path}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Inspect <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Modal */}
      {selectedFinding && (
        <EvidenceModal
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
        />
      )}
    </div>
  );
}

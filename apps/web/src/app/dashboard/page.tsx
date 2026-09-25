"use client";

import React, { useState } from "react";
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
  ExternalLink
} from "lucide-react";

export default function DashboardOverviewPage() {
  const [selectedFinding, setSelectedFinding] = useState<FindingItem | null>(null);

  const totalEndpoints = 38;
  const totalFindings = SAMPLE_FINDINGS.length;
  const criticalCount = SAMPLE_FINDINGS.filter((f) => f.severity === "CRITICAL").length;
  const riskScore = 78;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Security Overview</h1>
          <p className="text-xs text-slate-400 mt-1">
            Realtime AST posture across registered sandbox targets
          </p>
        </div>

        <Link
          href="/scan/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch New Scan</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0b0e17]/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold font-mono uppercase">API Endpoints</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{totalEndpoints}</span>
            <span className="text-xs text-emerald-400 font-medium">+4 new</span>
          </div>
          <p className="text-[11px] text-slate-500">Across 3 sandbox targets</p>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0b0e17]/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold font-mono uppercase">Total Findings</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{totalFindings}</span>
            <span className="text-xs text-rose-400 font-medium">100% verified</span>
          </div>
          <p className="text-[11px] text-slate-500">Deterministic AST evidence</p>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl border border-rose-950/40 bg-rose-950/10 backdrop-blur-md space-y-3 ring-1 ring-rose-500/20">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-semibold font-mono uppercase">Critical BOLA</span>
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-400 font-mono">{criticalCount}</span>
            <span className="text-xs text-rose-300 font-medium">Immediate Action</span>
          </div>
          <p className="text-[11px] text-rose-300/60">Cross-tenant object leak</p>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-[#0b0e17]/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold font-mono uppercase">Risk Score</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{riskScore}</span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
          <p className="text-[11px] text-amber-400">High Risk Profile</p>
        </div>
      </div>

      {/* Main Grid: Critical Findings & Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Top Findings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Top Actionable Vulnerabilities
            </h2>
            <Link
              href="/dashboard/findings"
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {SAMPLE_FINDINGS.map((finding) => (
              <div
                key={finding.id}
                onClick={() => setSelectedFinding(finding)}
                className="p-4 rounded-xl border border-slate-800 bg-[#0b0e17]/60 hover:bg-[#0f1422] hover:border-slate-700 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadgeColor(
                        finding.severity
                      )}`}
                    >
                      {finding.severity}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${getMethodBadgeColor(
                        finding.endpoint_method
                      )}`}
                    >
                      {finding.endpoint_method}
                    </span>
                    <span className="text-xs font-mono text-slate-300 font-medium">
                      {finding.endpoint_path}
                    </span>
                  </div>

                  <span className="text-[11px] text-cyan-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Inspect Evidence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-1">
                  {finding.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Scans History */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Latest Scan Runs
          </h2>

          <div className="space-y-3">
            {INITIAL_SCANS.map((scan) => (
              <Link
                key={scan.id}
                href={`/dashboard/scans/${scan.id}`}
                className="block p-4 rounded-xl border border-slate-800 bg-[#0b0e17]/60 hover:bg-[#0f1422] hover:border-cyan-500/30 transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-300 font-semibold">{scan.id}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                    COMPLETED
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-mono truncate">{scan.targetUrl}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
                  <span>{scan.endpointCount} endpoints</span>
                  <span className="text-rose-400 font-semibold">
                    {scan.counts.critical} Critical findings
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Evidence Modal */}
      <EvidenceModal finding={selectedFinding} onClose={() => setSelectedFinding(null)} />
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { INITIAL_SCANS } from "@/lib/mock-data";
import {
  Activity,
  PlusCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  GitCompare
} from "lucide-react";

export default function ScansHistoryPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Scans & Regressions</h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical AST security verification runs and posture regression diffs
          </p>
        </div>

        <Link
          href="/scan/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New AST Scan</span>
        </Link>
      </div>

      {/* Regression Diff Card */}
      <div className="p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-bold text-white">Posture Regression Comparison</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            -28% Risk Reduction
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-[#07090e] border border-slate-800 space-y-1">
            <span className="text-slate-500">Scan #1041 (Yesterday)</span>
            <div className="text-sm font-bold text-rose-400">4 Findings (2 Critical)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#07090e] border border-slate-800 space-y-1">
            <span className="text-slate-500">Scan #1042 (Latest)</span>
            <div className="text-sm font-bold text-amber-400">3 Findings (1 Critical)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#07090e] border border-slate-800 space-y-1">
            <span className="text-slate-500">Regression Status</span>
            <div className="text-sm font-bold text-emerald-400">1 Remediated, 0 New Flaws</div>
          </div>
        </div>
      </div>

      {/* Scans List Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0b0e17]/80 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
            <tr>
              <th className="p-4">Scan ID</th>
              <th className="p-4">Target Sandbox</th>
              <th className="p-4">Risk Score</th>
              <th className="p-4">Endpoints</th>
              <th className="p-4">Critical / High</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {INITIAL_SCANS.map((scan) => (
              <tr key={scan.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="p-4 font-bold text-white">{scan.id}</td>
                <td className="p-4 text-slate-300 truncate max-w-xs">{scan.targetUrl}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                    {scan.riskScore}/100
                  </span>
                </td>
                <td className="p-4">{scan.endpointCount} mapped</td>
                <td className="p-4">
                  <span className="text-rose-400 font-bold">{scan.counts.critical} Critical</span>
                  <span className="text-slate-500"> / </span>
                  <span className="text-amber-400 font-bold">{scan.counts.high} High</span>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    COMPLETED
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/dashboard/scans/${scan.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold transition-colors"
                  >
                    <span>View Telemetry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

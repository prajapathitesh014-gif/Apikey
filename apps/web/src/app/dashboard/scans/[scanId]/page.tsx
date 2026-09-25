"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getScanStatus, createScanEventSource } from "@/lib/scanner-api";
import { INITIAL_SCANS } from "@/lib/mock-data";
import { ScanItem, FindingItem } from "@/types";
import { LiveTerminal } from "@/components/scan/LiveTerminal";
import { SecurityGraph } from "@/components/graph/SecurityGraph";
import { EvidenceModal } from "@/components/findings/EvidenceModal";
import { getSeverityBadgeColor, getMethodBadgeColor } from "@/lib/utils";
import {
  ShieldAlert,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  RefreshCw,
  Sparkles
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ScanDetailPage() {
  const params = useParams();
  const scanId = (params?.scanId as string) || "scan_1042";

  const [scan, setScan] = useState<ScanItem | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<FindingItem | null>(null);
  const [activeTab, setActiveTab] = useState<"findings" | "graph" | "endpoints">("findings");

  useEffect(() => {
    // Initial fetch or mock fallback
    getScanStatus(scanId)
      .then((data) => setScan(data))
      .catch(() => {
        const fallback = INITIAL_SCANS.find((s) => s.id === scanId) || INITIAL_SCANS[0];
        setScan(fallback);
      });

    // Subscribe to realtime SSE stream
    const unsubscribe = createScanEventSource(scanId, (ev) => {
      setScan((prev) => {
        if (!prev) return prev;
        const updatedEvents = [...(prev.events || []), ev];
        const isDone = ev.type === "COMPLETE" || ev.progress >= 100;
        if (isDone && prev.progress < 100) {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        }
        return {
          ...prev,
          progress: ev.progress || prev.progress,
          currentPhase: ev.message || prev.currentPhase,
          status: isDone ? "completed" : prev.status,
          events: updatedEvents
        };
      });
    });

    // Polling backup
    const interval = setInterval(() => {
      getScanStatus(scanId)
        .then((data) => {
          setScan(data);
          if (data.status === "completed") clearInterval(interval);
        })
        .catch(() => {});
    }, 2500);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [scanId]);

  if (!scan) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-400 font-mono text-sm">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-cyan-400" />
        Loading scan telemetry...
      </div>
    );
  }

  const isScanning = scan.status === "running";

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#0b0e17]/90 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                AST SCAN TELEMETRY
              </span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-xs text-slate-400">{scan.id}</span>
            </div>
            <h1 className="text-xl font-bold text-white font-mono mt-1">{scan.targetUrl}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                scan.status === "completed"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : scan.status === "running"
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 animate-pulse"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {scan.status}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">{scan.currentPhase || "Executing security checks..."}</span>
            <span className="text-cyan-400 font-bold">{scan.progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-rose-500 transition-all duration-300"
              style={{ width: `${scan.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Live Telemetry Terminal */}
      <LiveTerminal events={scan.events || []} isScanning={isScanning} />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("findings")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "findings"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Verified Findings ({scan.findings?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("graph")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "graph"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Security Attack Graph</span>
        </button>

        <button
          onClick={() => setActiveTab("endpoints")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "endpoints"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Mapped Endpoints ({scan.endpoints?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Findings Matrix */}
      {activeTab === "findings" && (
        <div className="space-y-3">
          {(!scan.findings || scan.findings.length === 0) ? (
            <div className="p-12 text-center rounded-2xl border border-slate-800 bg-[#0b0e17]/50 text-slate-400 font-mono text-xs">
              {isScanning ? "Probing endpoints for security vulnerabilities..." : "No vulnerabilities found."}
            </div>
          ) : (
            scan.findings.map((f) => (
              <div
                key={f.id}
                onClick={() => setSelectedFinding(f)}
                className="p-5 rounded-2xl border border-slate-800 bg-[#0b0e17]/80 hover:bg-[#0f1422] hover:border-slate-700 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadgeColor(
                        f.severity
                      )}`}
                    >
                      {f.severity}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getMethodBadgeColor(
                        f.endpoint_method
                      )}`}
                    >
                      {f.endpoint_method}
                    </span>
                    <span className="text-xs font-mono text-slate-200 font-semibold">
                      {f.endpoint_path}
                    </span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                      {(f.confidence * 100).toFixed(0)}% AI Conf
                    </span>
                  </div>

                  <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Inspect Evidence & Code Fix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-medium leading-relaxed">{f.summary}</p>
                <p className="text-[11px] text-slate-400 font-mono line-clamp-1">{f.technical_explanation}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Embedded Security Graph */}
      {activeTab === "graph" && (
        <div className="space-y-3">
          <SecurityGraph height="520px" />
        </div>
      )}

      {/* Tab 3: Endpoints Table */}
      {activeTab === "endpoints" && (
        <div className="rounded-2xl border border-slate-800 bg-[#0b0e17]/80 overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Path</th>
                <th className="p-3.5">Auth</th>
                <th className="p-3.5">Object Identifier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {scan.endpoints?.map((ep, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3.5 font-bold">
                    <span className={`px-2 py-0.5 rounded border ${getMethodBadgeColor(ep.method)}`}>
                      {ep.method}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-white">{ep.path}</td>
                  <td className="p-3.5">
                    {ep.authenticated ? (
                      <span className="text-emerald-400 font-semibold">Protected</span>
                    ) : (
                      <span className="text-slate-500">Public</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {ep.hasObjectIdentifier ? (
                      <span className="text-amber-400 font-semibold">Yes ({ep.pathParams?.join(", ")})</span>
                    ) : (
                      <span className="text-slate-500">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Evidence Modal */}
      <EvidenceModal finding={selectedFinding} onClose={() => setSelectedFinding(null)} />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { FindingItem } from "@/types";
import { getSeverityBadgeColor, getMethodBadgeColor } from "@/lib/utils";
import {
  ShieldAlert,
  Check,
  Copy,
  Sparkles,
  ArrowRight,
  Code2,
  FileDiff,
  ExternalLink,
  Layers
} from "lucide-react";
import { toast } from "sonner";

interface EvidenceModalProps {
  finding: FindingItem | null;
  onClose: () => void;
}

export function EvidenceModal({ finding, onClose }: EvidenceModalProps) {
  const [copied, setCopied] = useState(false);

  if (!finding) return null;

  const copySnippet = () => {
    if (finding.code_fix_snippet) {
      navigator.clipboard.writeText(finding.code_fix_snippet);
      setCopied(true);
      toast.success("Remediation patch copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-[#090b10] shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-slate-900/90 border-b border-slate-800 flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSeverityBadgeColor(
                  finding.severity
                )}`}
              >
                {finding.severity}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getMethodBadgeColor(
                  finding.endpoint_method
                )}`}
              >
                {finding.endpoint_method}
              </span>
              <span className="text-sm font-mono text-slate-300 font-semibold">
                {finding.endpoint_path}
              </span>
              <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                Confidence: {(finding.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{finding.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Executive Summary */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Root Cause Breakdown
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{finding.summary}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{finding.technical_explanation}</p>
          </div>

          {/* Expected vs Observed Behavior Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-950/60 bg-emerald-950/20 space-y-2">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Expected Security Behavior
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed font-mono">
                {finding.evidence.diffSummary?.includes("403")
                  ? "HTTP 403 Forbidden / 404 Not Found"
                  : finding.summary.includes("Exposure")
                  ? "Filtered response schema matching documented DTO"
                  : "HTTP 401 Unauthorized token check"}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-rose-950/60 bg-rose-950/20 space-y-2">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Observed Vulnerable Behavior
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed font-mono">
                {finding.evidence.diffSummary || "HTTP 200 OK returned unauthorized data payload."}
              </p>
            </div>
          </div>

          {/* Side-by-Side Live Evidence Trace */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileDiff className="w-4 h-4 text-cyan-400" /> Evidence Audit Trace
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Request A (Owner) */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-[#06080c] font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800/80 pb-1.5">
                  <span className="text-emerald-400 font-bold">REQUEST A (Target Owner)</span>
                  <span>HTTP {finding.evidence.responseA?.status || 200}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-sky-400">{finding.endpoint_method}</span> {finding.evidence.requestA?.url || finding.endpoint_path}
                </div>
                <pre className="text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-lg overflow-x-auto max-h-40">
                  {JSON.stringify(finding.evidence.responseA?.body || finding.evidence.responseA || {}, null, 2)}
                </pre>
              </div>

              {/* Request B (Attacker / Probe) */}
              <div className="p-3.5 rounded-xl border border-rose-900/40 bg-[#0c0608] font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-rose-900/30 pb-1.5">
                  <span className="text-rose-400 font-bold">REQUEST B (Cross-Tenant Probe)</span>
                  <span className="text-rose-400">HTTP {finding.evidence.responseB?.status || 200} (BREACH)</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-rose-400">{finding.endpoint_method}</span> {finding.evidence.requestB?.url || finding.endpoint_path}
                </div>
                <pre className="text-[11px] text-rose-300 bg-slate-950/80 p-2.5 rounded-lg overflow-x-auto max-h-40">
                  {JSON.stringify(finding.evidence.responseB?.body || finding.evidence.responseB || finding.evidence.responseA?.body || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* AI Remediation Code Patch */}
          <div className="p-4 rounded-xl border border-cyan-950/60 bg-cyan-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> AI Remediation & Code Patch
              </div>
              {finding.code_fix_snippet && (
                <button
                  onClick={copySnippet}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium border border-cyan-500/30 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Patch"}</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{finding.remediation}</p>

            {finding.code_fix_snippet && (
              <pre className="p-3.5 rounded-xl bg-[#07090e] border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                <code>{finding.code_fix_snippet}</code>
              </pre>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

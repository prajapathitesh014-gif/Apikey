"use client";

import React from "react";
import { SAMPLE_FINDINGS, INITIAL_SCANS } from "@/lib/mock-data";
import {
  FileSpreadsheet,
  Download,
  Copy,
  Printer,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Layers
} from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const latestScan = INITIAL_SCANS[0];

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(latestScan, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sentinel-audit-${latestScan.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Security Audit JSON exported successfully!");
  };

  const handleCopyMarkdown = () => {
    const md = `# SentinelAPI Executive Security Report
**Scan ID:** ${latestScan.id}
**Target:** ${latestScan.targetUrl}
**Risk Score:** ${latestScan.riskScore}/100
**Total Findings:** ${SAMPLE_FINDINGS.length}

## Executive Summary
SentinelAPI performed deterministic AST verification and discovered ${SAMPLE_FINDINGS.length} critical/high severity vulnerabilities.

### Verified Vulnerabilities
${SAMPLE_FINDINGS.map(
  (f, i) => `### ${i + 1}. [${f.severity}] ${f.title}
- **Endpoint:** \`${f.endpoint_method} ${f.endpoint_path}\`
- **Summary:** ${f.summary}
- **Impact:** ${f.impact}
- **Remediation:** ${f.remediation}
`
).join("\n")}
`;
    navigator.clipboard.writeText(md);
    toast.success("Executive Markdown Report copied to clipboard!");
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Executive Security Report</h1>
          <p className="text-xs text-slate-400 mt-1">
            Standardized AST compliance summary & developer remediation audit
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyMarkdown}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Markdown</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit JSON</span>
          </button>
        </div>
      </div>

      {/* Report Document Box */}
      <div className="p-8 rounded-2xl border border-slate-800 bg-[#090c13] shadow-2xl space-y-8 font-sans">
        {/* Title Header */}
        <div className="border-b border-slate-800 pb-6 flex items-start justify-between">
          <div>
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              CONFIDENTIAL AST SECURITY AUDIT
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Apex E-Commerce Sandbox Assessment</h2>
            <p className="text-xs text-slate-400 font-mono mt-1">Target URL: {latestScan.targetUrl}</p>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 space-y-1">
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Risk Score: <span className="text-rose-400 font-bold">78 / 100</span></div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
            1. Executive Assessment
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            SentinelAPI conducted deterministic AST verification against the designated sandbox environment.
            The scan uncovered a critical <b>Broken Object Level Authorization (BOLA)</b> flaw allowing cross-tenant data harvesting,
            coupled with <b>Excessive Data Exposure</b> leaking password hashes and sensitive PII.
          </p>
        </div>

        {/* Findings Summary Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
            2. Verified Vulnerabilities
          </h3>

          <div className="rounded-xl border border-slate-800 overflow-hidden font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Vulnerability Category</th>
                  <th className="p-3">Endpoint</th>
                  <th className="p-3">Remediation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {SAMPLE_FINDINGS.map((f) => (
                  <tr key={f.id}>
                    <td className="p-3 font-bold text-rose-400">{f.severity}</td>
                    <td className="p-3 text-white font-semibold">{f.type}</td>
                    <td className="p-3 text-slate-400">{f.endpoint_path}</td>
                    <td className="p-3 text-amber-400">Action Required</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

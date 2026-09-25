"use client";

import React, { useState } from "react";
import { SAMPLE_FINDINGS, INITIAL_SCANS } from "@/lib/mock-data";
import {
  FileSpreadsheet,
  Download,
  Copy,
  Printer,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  GitBranch,
  Terminal,
  Check,
  ShieldCheck,
  Award,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { BrandIcon } from "@/components/ui/BrandLogo";

export default function ReportsPage() {
  const latestScan = INITIAL_SCANS[0];
  const [activeTab, setActiveTab] = useState<"audit" | "cicd">("audit");
  const [failThreshold, setFailThreshold] = useState<"critical" | "high">("critical");
  const [copiedYaml, setCopiedYaml] = useState(false);

  const handlePrintPdf = () => {
    toast.info("Opening system print / PDF export dialog...");
    window.print();
  };

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

  const cicdYaml = `name: SecureMind AST API Security Scan

on:
  push:
    branches: [ "main", "staging" ]
  pull_request:
    branches: [ "main" ]

jobs:
  api-security-audit:
    name: AST Vulnerability Gatekeeper
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Run SecureMind AST Scanner
        uses: sentinelapi/ast-scan-action@v2
        with:
          spec-path: "./openapi.json"
          target-url: "\${{ secrets.STAGING_API_URL }}"
          auth-token: "\${{ secrets.API_TEST_TOKEN }}"
          fail-on: "${failThreshold}"
          output-format: "sarif"

      - name: Upload Security SARIF to GitHub Code Scanning
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: "./sentinel-results.sarif"`;

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(cicdYaml);
    setCopiedYaml(true);
    toast.success("GitHub Actions YAML copied to clipboard!");
    setTimeout(() => setCopiedYaml(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-orange-500/20 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Executive Reports & CI/CD</h1>
          <p className="text-xs text-orange-200/70 mt-1 font-mono">
            Compliance audits, printable PDF summaries, and automated GitHub Actions pipelines
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-orange-500/20">
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "audit"
                ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-950"
                : "text-orange-300/70 hover:text-white"
            }`}
          >
            Executive Audit PDF
          </button>
          <button
            onClick={() => setActiveTab("cicd")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "cicd"
                ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-950"
                : "text-orange-300/70 hover:text-white"
            }`}
          >
            GitHub Actions CI/CD
          </button>
        </div>
      </div>

      {activeTab === "audit" && (
        <>
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#140a06]/90 border border-orange-500/20">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-orange-950/60 border border-orange-500/30 text-orange-300 font-mono text-xs">
                Scan ID: {latestScan.id}
              </span>
              <span className="text-xs text-slate-400 font-mono">Completed 2 mins ago</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintPdf}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md shadow-orange-950"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </button>
              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-200 text-xs font-semibold transition-all"
              >
                <Download className="w-3.5 h-3.5 text-orange-400" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Compliance Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { standard: "OWASP API 2023", status: "FAILED (BOLA DETECTED)", color: "text-rose-400 border-rose-900/60 bg-rose-950/20" },
              { standard: "ISO 27001", status: "REQUIRES ACTION", color: "text-amber-400 border-amber-900/60 bg-amber-950/20" },
              { standard: "SOC 2 TYPE II", status: "IN COMPLIANCE AUDIT", color: "text-orange-400 border-orange-900/60 bg-orange-950/20" },
              { standard: "HIPAA AUDIT", status: "4 VIOLATIONS", color: "text-rose-400 border-rose-900/60 bg-rose-950/20" }
            ].map((c, i) => (
              <div key={i} className={`p-3 rounded-2xl border ${c.color} flex flex-col justify-between space-y-1`}>
                <span className="text-[10px] font-mono uppercase tracking-wider opacity-75">{c.standard}</span>
                <span className="text-xs font-bold font-mono">{c.status}</span>
              </div>
            ))}
          </div>

          {/* Printable Report Document Card */}
          <div className="p-8 rounded-3xl border border-orange-500/30 bg-[#0f0704] shadow-2xl space-y-8 print:border-none print:bg-white print:text-black">
            {/* Report Header */}
            <div className="flex items-start justify-between border-b border-orange-500/20 pb-6">
              <div className="flex items-center gap-3">
                <BrandIcon size="lg" />
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">SecureMind AST Security Assessment</h2>
                  <p className="text-xs text-orange-400/80 font-mono">Target: {latestScan.targetUrl}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-orange-400 font-mono">{latestScan.riskScore}/100</div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Calculated Risk Index</span>
              </div>
            </div>

            {/* Findings Breakdown Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-orange-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-orange-400" /> Discovered Vulnerability Matrix
              </h3>
              <div className="rounded-2xl border border-orange-500/20 overflow-hidden bg-black/40">
                <table className="w-full text-left text-xs">
                  <thead className="bg-orange-950/60 border-b border-orange-500/20 text-orange-300 font-mono">
                    <tr>
                      <th className="p-3">Severity</th>
                      <th className="p-3">Vulnerability</th>
                      <th className="p-3">Endpoint</th>
                      <th className="p-3">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-500/10 text-slate-200">
                    {SAMPLE_FINDINGS.map((f, i) => (
                      <tr key={i} className="hover:bg-orange-500/10 transition-colors">
                        <td className="p-3 font-mono font-bold text-rose-400">{f.severity}</td>
                        <td className="p-3 font-semibold">{f.title}</td>
                        <td className="p-3 font-mono text-orange-300">{f.endpoint_method} {f.endpoint_path}</td>
                        <td className="p-3 font-mono">{(f.confidence * 100).toFixed(0)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "cicd" && (
        <div className="p-6 rounded-3xl border border-orange-500/30 bg-[#0f0704] space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-orange-400" />
                <span>Automated GitHub Actions AST Workflow</span>
              </h2>
              <p className="text-xs text-orange-200/70 font-mono mt-1">
                Block PRs containing BOLA or unauthorized parameter leaks automatically before production merge
              </p>
            </div>

            <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-orange-500/20 text-xs font-mono">
              <span className="text-orange-400/80 px-2 font-bold">Fail Gate:</span>
              <button
                onClick={() => setFailThreshold("critical")}
                className={`px-2.5 py-1 rounded-xl transition-all ${
                  failThreshold === "critical"
                    ? "bg-rose-600 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Critical Only
              </button>
              <button
                onClick={() => setFailThreshold("high")}
                className={`px-2.5 py-1 rounded-xl transition-all ${
                  failThreshold === "high"
                    ? "bg-amber-600 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                High + Critical
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl border border-orange-500/30 bg-black/90 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-orange-950/60 border-b border-orange-500/20 text-xs font-mono text-orange-300">
              <span>.github/workflows/sentinel-ast.yml</span>
              <button
                onClick={handleCopyYaml}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/40 text-orange-200 hover:text-white transition-colors text-xs font-bold"
              >
                {copiedYaml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedYaml ? "Copied YAML" : "Copy Workflow"}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-amber-200 overflow-x-auto leading-relaxed">
              <code>{cicdYaml}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

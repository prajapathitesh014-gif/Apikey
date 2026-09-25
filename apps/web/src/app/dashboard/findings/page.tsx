"use client";

import React, { useState } from "react";
import { SAMPLE_FINDINGS } from "@/lib/mock-data";
import { FindingItem } from "@/types";
import { getSeverityBadgeColor, getMethodBadgeColor } from "@/lib/utils";
import { EvidenceModal } from "@/components/findings/EvidenceModal";
import {
  Bug,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Layers
} from "lucide-react";

export default function FindingsPage() {
  const [selectedFinding, setSelectedFinding] = useState<FindingItem | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filtered = SAMPLE_FINDINGS.filter((item) => {
    const matchesSeverity = severityFilter === "ALL" || item.severity === severityFilter;
    const matchesSearch =
      item.endpoint_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Security Findings Matrix</h1>
        <p className="text-xs text-slate-400 mt-1">
          Deterministic AST evidence-backed vulnerabilities across analyzed sandbox APIs
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-2xl bg-[#0b0e17] border border-slate-800">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search endpoint path, BOLA, or vulnerability type..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Severity Badges Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 font-mono text-xs">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                severityFilter === sev
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-800 bg-[#0b0e17]/50 text-slate-400 font-mono text-xs">
            No security findings matching current filters.
          </div>
        ) : (
          filtered.map((finding) => (
            <div
              key={finding.id}
              onClick={() => setSelectedFinding(finding)}
              className="p-5 rounded-2xl border border-slate-800 bg-[#0b0e17]/80 hover:bg-[#0f1422] hover:border-slate-700 cursor-pointer transition-all space-y-3 group shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
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
                  <span className="text-sm font-mono text-slate-200 font-semibold">
                    {finding.endpoint_path}
                  </span>
                  <span className="text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded font-mono">
                    {(finding.confidence * 100).toFixed(0)}% AI Confidence
                  </span>
                </div>

                <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Inspect Evidence & Remediation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">{finding.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{finding.summary}</p>
              <p className="text-[11px] text-slate-400 font-mono leading-relaxed line-clamp-1">
                {finding.technical_explanation}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Evidence Modal */}
      <EvidenceModal finding={selectedFinding} onClose={() => setSelectedFinding(null)} />
    </div>
  );
}

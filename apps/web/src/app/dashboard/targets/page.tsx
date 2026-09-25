"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { INITIAL_TARGETS } from "@/lib/mock-data";
import { TargetItem } from "@/types";
import { supabase } from "@/lib/supabase/client";
import {
  Server,
  PlusCircle,
  ShieldCheck,
  Globe,
  ArrowRight,
  Sparkles,
  Lock
} from "lucide-react";
import { toast } from "sonner";

export default function TargetsPage() {
  const [targets, setTargets] = useState<TargetItem[]>(INITIAL_TARGETS);

  useEffect(() => {
    supabase
      .from("targets")
      .select("*")
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          const formatted: TargetItem[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            baseUrl: d.base_url,
            environment: d.environment || "sandbox",
            isSandbox: d.is_sandbox ?? true,
            authorizationStatus: d.authorization_status || "Authorized for AST",
            lastScanned: "Just now",
            riskScore: 78
          }));
          setTargets(formatted);
        }
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Target Sandboxes</h1>
          <p className="text-xs text-slate-400 mt-1">
            Allowlisted sandbox and staging environments authorized for AST security probing
          </p>
        </div>

        <Link
          href="/scan/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Sandbox Target</span>
        </Link>
      </div>

      {/* Safety Banner */}
      <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-200/90 leading-relaxed space-y-1">
          <span className="font-bold text-emerald-300">Sandbox Boundary Enforcement: </span>
          SentinelAPI strictly disallows probing non-authorized production systems. All registered targets require verified sandbox or staging domain declarations.
        </div>
      </div>

      {/* Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {targets.map((tgt) => (
          <div
            key={tgt.id}
            className="p-6 rounded-2xl border border-slate-800 bg-[#0b0e17]/80 backdrop-blur-xl space-y-4 hover:border-slate-700 transition-all shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Server className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {tgt.environment}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{tgt.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-1 truncate">{tgt.baseUrl}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Risk: <b className="text-rose-400">{tgt.riskScore}/100</b></span>
              <span>{tgt.lastScanned}</span>
            </div>

            <Link
              href="/scan/new"
              className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Trigger Scan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

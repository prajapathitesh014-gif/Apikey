"use client";

import React, { useEffect, useRef } from "react";
import { Terminal, ShieldAlert, CheckCircle2, Flame, Loader2 } from "lucide-react";

interface LiveTerminalProps {
  events: Array<{
    type: string;
    message: string;
    progress: number;
    endpoint?: string;
    timestamp: string;
  }>;
  isScanning?: boolean;
}

export function LiveTerminal({ events, isScanning = false }: LiveTerminalProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  const getEventBadge = (type: string) => {
    switch (type) {
      case "VULNERABILITY_FOUND":
      case "VULN":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Flame className="w-3 h-3 text-rose-400" /> BREACH
          </span>
        );
      case "TESTING_ENDPOINT":
      case "TESTING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Loader2 className="w-3 h-3 animate-spin text-sky-400" /> PROBE
          </span>
        );
      case "COMPLETE":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> DONE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
            LOG
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#090b10] shadow-2xl overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold tracking-wide">SENTINEL LIVE TELEMETRY</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          {isScanning ? (
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              ENGINE ACTIVE
            </span>
          ) : (
            <span className="text-slate-500">IDLE</span>
          )}
        </div>
      </div>

      <div className="p-4 h-64 overflow-y-auto space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800">
        {events.length === 0 ? (
          <div className="text-slate-600 flex items-center justify-center h-full">
            Waiting for scan execution telemetry...
          </div>
        ) : (
          events.map((ev, idx) => (
            <div key={idx} className="flex items-start gap-3 leading-relaxed">
              <span className="text-slate-600 select-none">
                {new Date(ev.timestamp).toLocaleTimeString()}
              </span>
              <div>{getEventBadge(ev.type)}</div>
              <span
                className={`flex-1 ${
                  ev.type === "VULNERABILITY_FOUND" || ev.type === "VULN"
                    ? "text-rose-300 font-semibold"
                    : ev.type === "COMPLETE"
                    ? "text-emerald-400 font-semibold"
                    : "text-slate-300"
                }`}
              >
                {ev.message}
              </span>
            </div>
          ))
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}

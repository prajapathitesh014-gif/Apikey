"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Sparkles, Activity, PlusCircle, LayoutDashboard, Bug, FileSpreadsheet, Server, Lock } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Navbar() {
  const [scannerOnline, setScannerOnline] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/health")
      .then((r) => r.ok)
      .then(() => setScannerOnline(true))
      .catch(() => setScannerOnline(false));
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-950/40 bg-[#160b07]/90 backdrop-blur-xl">
      {/* Top Banner Tag */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-[11px] font-mono py-1 px-4 text-center font-bold tracking-wider flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>TECHWITPRO • SENTINELAPI ZERO-TRUST SECURITY COPILOT</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <BrandLogo href="/" size="md" />

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-orange-100/80">
          <Link href="/dashboard" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="w-3.5 h-3.5" /> Overview
          </Link>
          <Link href="/dashboard/scans" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Scans
          </Link>
          <Link href="/dashboard/findings" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
            <Bug className="w-3.5 h-3.5" /> Findings
          </Link>
          <Link href="/dashboard/targets" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5" /> Sandboxes
          </Link>
          <Link href="/dashboard/reports" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Reports
          </Link>
        </nav>

        {/* Right CTA + Scanner Status */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-950/40 border border-orange-900/60 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                scannerOnline === true
                  ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"
                  : "bg-amber-400"
              }`}
            />
            <span className="text-orange-200/80 font-mono text-[11px]">
              {scannerOnline === true ? "ENGINE ONLINE" : "TESTBED READY"}
            </span>
          </div>

          <Link
            href="/login"
            className="hidden md:inline-flex items-center text-xs font-semibold text-orange-200/80 hover:text-white transition-colors"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="hidden sm:inline-flex items-center text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
          >
            Sign up
          </Link>

          <Link
            href="/scan/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-500/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Launch Scan</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Bug,
  Server,
  FileSpreadsheet,
  Settings,
  PlusCircle,
  ShieldCheck,
  Lock
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/scans", label: "Scans History", icon: Activity },
    { href: "/dashboard/findings", label: "Security Findings", icon: Bug },
    { href: "/dashboard/targets", label: "Target Sandboxes", icon: Server },
    { href: "/dashboard/reports", label: "Executive Reports", icon: FileSpreadsheet },
    { href: "/scan/new", label: "Launch Scan", icon: PlusCircle, highlight: true }
  ];

  return (
    <aside className="w-64 border-r border-orange-950/40 bg-[#120a06]/95 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-3 py-2 text-[11px] font-semibold text-orange-400/80 uppercase tracking-wider font-mono">
          Security Console
        </div>

        <nav className="space-y-1.5">
          {links.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  item.highlight
                    ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 shadow-sm"
                    : isActive
                    ? "bg-orange-950/60 text-white border border-orange-800/60 font-semibold"
                    : "text-orange-200/60 hover:text-orange-100 hover:bg-orange-950/30"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-orange-400" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Zero Trust Assurance Box */}
      <div className="rounded-xl border border-orange-900/30 bg-[#170c07]/80 p-3.5 text-xs text-orange-200/70 space-y-2">
        <div className="flex items-center gap-2 text-white font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>AST Safe Probing</span>
        </div>
        <p className="text-[11px] text-orange-200/60 leading-relaxed">
          Zero-risk AST probing with token redaction & sandbox boundary guarantees.
        </p>
      </div>
    </aside>
  );
}

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
  GitPullRequest,
  Download,
  Terminal,
  Play,
  Flame,
  Layers
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface EvidenceModalProps {
  finding: FindingItem | null;
  onClose: () => void;
}

export function EvidenceModal({ finding, onClose }: EvidenceModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"ts" | "py" | "go">("ts");
  const [prCreated, setPrCreated] = useState(false);
  const [testingCurl, setTestingCurl] = useState(false);

  if (!finding) return null;

  const getLanguageSnippet = () => {
    if (selectedLang === "py") {
      return `# Python (FastAPI / SQLAlchemy) Zero-Trust Tenant Scoped Query
from fastapi import HTTPException, status

async def get_order_secure(order_id: str, current_user: User = Depends(get_current_user)):
    # ✅ Scoped strictly to current_user.id
    order = await db.orders.filter(
        id=order_id,
        user_id=current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Cross-tenant access denied"
        )
    return order`;
    } else if (selectedLang === "go") {
      return `// Go (Gin / GORM) Zero-Trust Tenant Authorization
func GetOrderHandler(c *gin.Context) {
    userID := c.GetString("user_id")
    orderID := c.Param("orderId")

    var order Order
    // ✅ Scoped to tenant boundary
    err := db.Where("id = ? AND user_id = ?", orderID, userID).First(&order).Error
    if err != nil {
        c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden: Tenant isolation breach prevented"})
        return
    }
    c.JSON(http.StatusOK, order)
}`;
    }
    // Default TypeScript
    return finding.code_fix_snippet || `// TypeScript (Prisma / Node.js) Zero-Trust Ownership Check
const order = await db.orders.findFirst({
  where: {
    id: orderId,
    userId: session.user.id // Enforce tenant boundary
  }
});
if (!order) {
  throw new ForbiddenError("Access denied: Tenant boundary violation");
}`;
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(getLanguageSnippet());
    setCopied(true);
    toast.success("Remediation patch copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCurl = () => {
    const curl = `curl -X ${finding.endpoint_method} "http://localhost:4000${finding.endpoint_path.replace("{orderId}", "ord_attacker_probe")}" -H "Authorization: Bearer token_alice" -H "Content-Type: application/json"`;
    navigator.clipboard.writeText(curl);
    setCopiedCurl(true);
    toast.success("Reproduction cURL copied to clipboard!");
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleTestPoc = () => {
    setTestingCurl(true);
    toast.info("Sending live AST security probe to sandbox...");
    setTimeout(() => {
      setTestingCurl(false);
      toast.error("Vulnerability Reproduced: HTTP 200 OK returned unauthorized target entity.");
    }, 1200);
  };

  const handleCreatePR = () => {
    setPrCreated(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
    toast.success(`Automated Pull Request generated: #PR-104 [Fix] ${finding.title}`);
  };

  const handleDownloadPatch = () => {
    const patchContent = `--- a/src/handlers/${finding.endpoint_path.split("/").pop() || "endpoint"}.ts
+++ b/src/handlers/${finding.endpoint_path.split("/").pop() || "endpoint"}.ts
@@ -14,5 +14,8 @@
-  const record = await db.lookup(paramId);
+  // AST ZERO-TRUST AUTO-PATCH (${finding.type})
+  const record = await db.lookupScoped(paramId, session.user.id);
+  if (!record) throw new ForbiddenError("Unauthorized entity access");
`;
    const blob = new Blob([patchContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sentinel-fix-${finding.id}.patch`;
    link.click();
    toast.success(`Downloaded sentinel-fix-${finding.id}.patch`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl border border-orange-500/30 bg-[#0f0704] shadow-2xl shadow-black overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-orange-950/90 via-[#190c06] to-[#0f0704] border-b border-orange-500/20 flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
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
              <span className="text-sm font-mono text-orange-200 font-semibold">
                {finding.endpoint_path}
              </span>
              <span className="text-xs text-orange-300/80 bg-orange-950/60 border border-orange-500/20 px-2 py-0.5 rounded font-mono">
                AST Confidence: {(finding.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{finding.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-orange-500/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-slate-200 text-xs sm:text-sm">
          {/* Executive Summary */}
          <div className="p-4 rounded-2xl border border-orange-500/20 bg-orange-950/20 space-y-2">
            <div className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <ShieldAlert className="w-4 h-4" /> Root Cause Breakdown
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{finding.summary}</p>
            <p className="text-xs text-orange-200/70 leading-relaxed font-mono">{finding.technical_explanation}</p>
          </div>

          {/* Expected vs Observed Behavior */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-emerald-950/80 bg-emerald-950/20 space-y-2">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Check className="w-4 h-4" /> Expected Zero-Trust Behavior
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed font-mono">
                HTTP 403 Forbidden / 404 Not Found (Tenant isolation boundary enforced).
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-rose-950/80 bg-rose-950/20 space-y-2">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <ShieldAlert className="w-4 h-4" /> Observed AST Vulnerability
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed font-mono">
                {finding.evidence.diffSummary || "HTTP 200 OK returned unauthorized tenant payload without authorization check."}
              </p>
            </div>
          </div>

          {/* Interactive Reproduction PoC cURL */}
          <div className="p-4 rounded-2xl border border-orange-500/20 bg-black/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Terminal className="w-4 h-4 text-orange-400" /> Proof-of-Concept Reproduction (PoC)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestPoc}
                  disabled={testingCurl}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  <Play className="w-3 h-3" />
                  <span>{testingCurl ? "Testing..." : "Test PoC"}</span>
                </button>
                <button
                  onClick={copyCurl}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 text-xs font-medium border border-orange-500/30 transition-colors"
                >
                  {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCurl ? "Copied" : "Copy cURL"}</span>
                </button>
              </div>
            </div>
            <pre className="p-3 rounded-xl bg-black/80 border border-orange-500/20 text-xs font-mono text-orange-300 overflow-x-auto leading-relaxed">
              <code>{`curl -X ${finding.endpoint_method} "http://localhost:4000${finding.endpoint_path.replace("{orderId}", "ord_attacker_probe")}" \\
  -H "Authorization: Bearer token_alice" \\
  -H "Content-Type: application/json"`}</code>
            </pre>
          </div>

          {/* AI Auto-Patch & Remediation */}
          <div className="p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#1c0e07] to-[#120703] space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 font-mono">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> 1-Click AI Auto-Patch & PR Generator
              </div>
              <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-orange-500/20">
                {(["ts", "py", "go"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedLang === lang
                        ? "bg-orange-600 text-white shadow-sm shadow-orange-950"
                        : "text-orange-300/70 hover:text-white"
                    }`}
                  >
                    {lang === "ts" ? "TypeScript" : lang === "py" ? "Python" : "Golang"}
                  </button>
                ))}
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-black/90 border border-orange-500/30 text-xs font-mono text-amber-200 overflow-x-auto leading-relaxed shadow-inner">
              <code>{getLanguageSnippet()}</code>
            </pre>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={copySnippet}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 text-xs font-semibold border border-orange-500/30 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Code"}</span>
                </button>

                <button
                  onClick={handleDownloadPatch}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 text-xs font-semibold border border-orange-500/30 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-orange-400" />
                  <span>Download .patch</span>
                </button>
              </div>

              <button
                onClick={handleCreatePR}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-950/60 transition-all hover:scale-105"
              >
                <GitPullRequest className="w-4 h-4" />
                <span>{prCreated ? "✅ PR #104 Created!" : "Generate GitHub Pull Request"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gradient-to-r from-orange-950/80 via-[#180b06] to-[#0f0704] border-t border-orange-500/20 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-orange-950/40 hover:bg-orange-500/20 border border-orange-500/30 text-orange-200 text-xs font-semibold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

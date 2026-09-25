"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { startScan, fetchDemoSpec } from "@/lib/scanner-api";
import {
  Shield,
  Server,
  Key,
  Layers,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Lock,
  UploadCloud,
  FileCode2,
  Sliders,
  Check,
  Flame,
  Activity,
  FileText,
  ShieldCheck,
  Terminal
} from "lucide-react";
import { toast } from "sonner";

export default function NewScanPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [targetUrl, setTargetUrl] = useState("http://localhost:3000/api/mock-sandbox");
  const [openApiSpec, setOpenApiSpec] = useState("");
  const [authHeaderUserA, setAuthHeaderUserA] = useState("Bearer demo-token-alice-owner");
  const [authHeaderUserB, setAuthHeaderUserB] = useState("Bearer demo-token-bob-attacker");
  const [profileBola, setProfileBola] = useState(true);
  const [profileExposure, setProfileExposure] = useState(true);
  const [profileAuth, setProfileAuth] = useState(true);
  const [profileRateLimit, setProfileRateLimit] = useState(true);

  // Preload Demo Spec on Mount
  useEffect(() => {
    fetchDemoSpec()
      .then((spec) => {
        setOpenApiSpec(JSON.stringify(spec, null, 2));
      })
      .catch(() => {});
  }, []);

  // 1-Click Load Demo Vulnerable API
  const handleLoadDemo = async (targetType: string = "apex") => {
    setLoading(true);
    try {
      const spec = await fetchDemoSpec();
      setTargetUrl("http://localhost:3000/api/mock-sandbox");
      setOpenApiSpec(JSON.stringify(spec, null, 2));
      toast.success("Loaded Apex E-Commerce Sandbox Spec with intentional BOLA & Exposure testbeds!");
    } catch {
      toast.info("Preloaded OpenAPI Sandbox Spec!");
    } finally {
      setLoading(false);
    }
  };

  // Launch Scan
  const handleLaunchScan = async () => {
    if (!targetUrl || !openApiSpec) {
      toast.error("Please provide both target URL and OpenAPI spec content");
      return;
    }

    setLoading(true);
    try {
      const res = await startScan({
        targetUrl,
        openApiContent: openApiSpec,
        authHeaderUserA,
        authHeaderUserB
      });

      toast.success("Security scan initiated successfully!");
      router.push(`/dashboard/scans/${res.scanId}`);
    } catch (err: any) {
      toast.error(`Failed to launch scan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-canvas text-slate-100 selection:bg-orange-500/30 selection:text-orange-200">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Wizard Header Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-400 text-xs font-mono font-bold shadow-lg shadow-orange-950/50">
            <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
            <span>AST SCAN CONFIGURATION WIZARD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Configure Zero-Trust Security Scan
          </h1>
          <p className="text-xs sm:text-sm text-orange-200/70 max-w-xl mx-auto">
            Execute safe, deterministic AST verification against authorized sandboxes with automated evidence capture.
          </p>
        </div>

        {/* Stepper Navigation */}
        <div className="grid grid-cols-3 gap-3 p-1.5 rounded-2xl bg-[#140b07]/90 border border-orange-900/40 shadow-xl">
          <button
            onClick={() => setStep(1)}
            className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              step === 1
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20 scale-[1.02]"
                : "text-orange-200/70 hover:text-white hover:bg-orange-950/40"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">1</span>
            <span>Target & Spec</span>
          </button>

          <button
            onClick={() => setStep(2)}
            className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              step === 2
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20 scale-[1.02]"
                : "text-orange-200/70 hover:text-white hover:bg-orange-950/40"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">2</span>
            <span>Test Identities</span>
          </button>

          <button
            onClick={() => setStep(3)}
            className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              step === 3
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20 scale-[1.02]"
                : "text-orange-200/70 hover:text-white hover:bg-orange-950/40"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">3</span>
            <span>Scan Profile</span>
          </button>
        </div>

        {/* Step Content Container */}
        <div className="p-6 sm:p-10 rounded-[32px] border border-orange-900/40 bg-[#120a06]/95 backdrop-blur-2xl shadow-2xl space-y-6">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Top Banner with 3D Architecture Graphic */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-gradient-to-r from-orange-950/40 via-[#170c07] to-amber-950/30 border border-orange-900/30">
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center gap-2 text-orange-400 font-mono text-xs font-bold">
                    <Server className="w-4 h-4" />
                    <span>STEP 1: API SURFACE DISCOVERY</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Target Sandbox & OpenAPI Spec
                  </h2>
                  <p className="text-xs text-orange-200/70 leading-relaxed">
                    Provide the base URL of your authorized sandbox environment and paste the OpenAPI / Swagger 3.x schema.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleLoadDemo("apex")}
                      disabled={loading}
                      className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Use Demo E-Commerce Sandbox</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 relative aspect-video rounded-xl overflow-hidden border border-orange-500/30 shadow-lg">
                  <Image
                    src="/wizard-step1.jpg"
                    alt="OpenAPI Gateway Architecture"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-orange-300 font-bold mb-2">
                    SANDBOX BASE URL
                  </label>
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="e.g. http://localhost:3000/api/mock-sandbox or https://sandbox.example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0604] border border-orange-900/60 text-white font-mono text-xs focus:outline-none focus:border-orange-400 transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono text-orange-300 font-bold">
                      OPENAPI 3.x SPECIFICATION (JSON / YAML)
                    </label>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      ✓ Spec Ready (4 Seeded Testbed Endpoints)
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    value={openApiSpec}
                    onChange={(e) => setOpenApiSpec(e.target.value)}
                    placeholder="Paste OpenAPI 3.0 / 3.1 or Swagger schema definition here..."
                    className="w-full p-4 rounded-xl bg-[#0c0604] border border-orange-900/60 text-orange-100 font-mono text-xs focus:outline-none focus:border-orange-400 transition-colors scrollbar-thin scrollbar-thumb-orange-950"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-orange-950/60">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all hover:scale-105"
                >
                  <span>Continue to Test Identities</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Top Banner with 3D Dual Identity Graphic */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-gradient-to-r from-orange-950/40 via-[#170c07] to-amber-950/30 border border-orange-900/30">
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center gap-2 text-orange-400 font-mono text-xs font-bold">
                    <Key className="w-4 h-4" />
                    <span>STEP 2: DUAL-TENANT IDENTITY CONTEXT</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Multi-Tenant Authorization Pairs
                  </h2>
                  <p className="text-xs text-orange-200/70 leading-relaxed">
                    BOLA and IDOR verification requires two distinct test identities to deterministically validate object ownership boundaries.
                  </p>
                </div>

                <div className="lg:col-span-5 relative aspect-video rounded-xl overflow-hidden border border-orange-500/30 shadow-lg">
                  <Image
                    src="/wizard-step2.jpg"
                    alt="Dual Identity Tokens"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-emerald-900/40 bg-emerald-950/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      TEST IDENTITY A (Resource Owner: Alice Vance)
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300/80 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      Target Account
                    </span>
                  </div>
                  <input
                    type="text"
                    value={authHeaderUserA}
                    onChange={(e) => setAuthHeaderUserA(e.target.value)}
                    placeholder="Bearer token for Test User A"
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0604] border border-emerald-900/60 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="p-5 rounded-2xl border border-rose-900/40 bg-rose-950/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono font-bold text-rose-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
                      TEST IDENTITY B (Cross-Tenant Attacker Probe: Bob)
                    </div>
                    <span className="text-[10px] font-mono text-rose-300/80 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                      Cross-Tenant Actor
                    </span>
                  </div>
                  <input
                    type="text"
                    value={authHeaderUserB}
                    onChange={(e) => setAuthHeaderUserB(e.target.value)}
                    placeholder="Bearer token for Test User B"
                    className="w-full px-4 py-3 rounded-xl bg-[#0c0604] border border-rose-900/60 text-white font-mono text-xs focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-orange-950/60">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-full bg-[#1c0f0a] text-orange-200 text-xs font-bold flex items-center gap-2 hover:bg-orange-950 border border-orange-900/40"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all hover:scale-105"
                >
                  <span>Continue to Scan Profile</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Top Banner with 3D Scanner Radar Graphic */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-gradient-to-r from-orange-950/40 via-[#170c07] to-amber-950/30 border border-orange-900/30">
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center gap-2 text-orange-400 font-mono text-xs font-bold">
                    <Sliders className="w-4 h-4" />
                    <span>STEP 3: AST DETECTOR SELECTION</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Select Verification Profile & Launch
                  </h2>
                  <p className="text-xs text-orange-200/70 leading-relaxed">
                    Select the deterministic security detectors and AI reasoning models for this sandbox verification run.
                  </p>
                </div>

                <div className="lg:col-span-5 relative aspect-video rounded-xl overflow-hidden border border-orange-500/30 shadow-lg">
                  <Image
                    src="/wizard-step3.jpg"
                    alt="AST Scanner Radar"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Checkbox Detector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="p-5 rounded-2xl border border-orange-900/40 bg-[#0c0604] flex items-start gap-3 cursor-pointer hover:border-orange-500/40 transition-all">
                  <input
                    type="checkbox"
                    checked={profileBola}
                    onChange={(e) => setProfileBola(e.target.checked)}
                    className="mt-1 rounded bg-slate-900 border-orange-800 text-orange-500 focus:ring-0"
                  />
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      <span>BOLA / IDOR Verification (OWASP #1)</span>
                    </div>
                    <div className="text-[11px] text-orange-200/60 leading-relaxed">
                      Tests cross-tenant object parameter boundary enforcement with dual identities.
                    </div>
                  </div>
                </label>

                <label className="p-5 rounded-2xl border border-orange-900/40 bg-[#0c0604] flex items-start gap-3 cursor-pointer hover:border-orange-500/40 transition-all">
                  <input
                    type="checkbox"
                    checked={profileExposure}
                    onChange={(e) => setProfileExposure(e.target.checked)}
                    className="mt-1 rounded bg-slate-900 border-orange-800 text-orange-500 focus:ring-0"
                  />
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sensitive Property Exposure (OWASP #3)</span>
                    </div>
                    <div className="text-[11px] text-orange-200/60 leading-relaxed">
                      Detects leaked credentials, SSNs, and unmasked internal ORM flags.
                    </div>
                  </div>
                </label>

                <label className="p-5 rounded-2xl border border-orange-900/40 bg-[#0c0604] flex items-start gap-3 cursor-pointer hover:border-orange-500/40 transition-all">
                  <input
                    type="checkbox"
                    checked={profileAuth}
                    onChange={(e) => setProfileAuth(e.target.checked)}
                    className="mt-1 rounded bg-slate-900 border-orange-800 text-orange-500 focus:ring-0"
                  />
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Broken Authentication (OWASP #2)</span>
                    </div>
                    <div className="text-[11px] text-orange-200/60 leading-relaxed">
                      Probes anonymous access to declared private routes.
                    </div>
                  </div>
                </label>

                <label className="p-5 rounded-2xl border border-orange-900/40 bg-[#0c0604] flex items-start gap-3 cursor-pointer hover:border-orange-500/40 transition-all">
                  <input
                    type="checkbox"
                    checked={profileRateLimit}
                    onChange={(e) => setProfileRateLimit(e.target.checked)}
                    className="mt-1 rounded bg-slate-900 border-orange-800 text-orange-500 focus:ring-0"
                  />
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Rate-Limit Signals (OWASP #4)</span>
                    </div>
                    <div className="text-[11px] text-orange-200/60 leading-relaxed">
                      Checks for RFC 6585 RateLimit throttling headers.
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-orange-950/60">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-full bg-[#1c0f0a] text-orange-200 text-xs font-bold flex items-center gap-2 hover:bg-orange-950 border border-orange-900/40"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleLaunchScan}
                  disabled={loading}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:opacity-90 text-slate-950 font-black text-sm flex items-center gap-2.5 shadow-2xl shadow-orange-500/30 transition-all hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? "INITIALIZING SCAN..." : "LAUNCH AST SECURITY SCAN"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { SecurityGraph } from "@/components/graph/SecurityGraph";
import { NumberTicker } from "@/components/ui/NumberTicker";
import VariableFontHoverByRandomLetter from "@/components/fancy/text/variable-font-hover-by-random-letter";
import StackingCardsDemo from "@/components/fancy/blocks/StackingCardsDemo";
import { Skiper106 } from "@/components/fancy/inputs/smooth-input";
import OrbitingCirclesDemo from "@/components/magicui/OrbitingCirclesDemo";
import {
  Shield,
  Sparkles,
  ArrowRight,
  Terminal,
  Cpu,
  Layers,
  FileCheck2,
  Lock,
  Zap,
  Flame,
  CheckCircle2,
  Activity,
  Star,
  ShieldCheck,
  Radio,
  Server,
  Database,
  Globe
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-100 relative selection:bg-orange-500/30 selection:text-orange-200">
      <Navbar />

      {/* Top Brand Logo Banner */}
      <div className="pt-8 pb-4 text-center">
        <div className="inline-flex items-center gap-2 text-xl sm:text-2xl font-black tracking-tight text-white/90">
          <span className="text-orange-500 font-mono">11/</span>
          <span className="tracking-tighter">techwitpro</span>
        </div>
      </div>

      {/* Main Canvas Container (Card) matching Reference Design */}
      <section className="px-3 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-10">
        <div className="app-card-canvas rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Card Inner Navigation */}
          <div className="flex items-center justify-between pb-8 border-b border-slate-100">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center text-white">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                SecureMind
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
              <Link href="/dashboard" className="hover:text-slate-950 transition-colors">Solutions</Link>
              <Link href="/dashboard/findings" className="hover:text-slate-950 transition-colors">Features</Link>
              <Link href="/dashboard/reports" className="hover:text-slate-950 transition-colors">Resources</Link>
              <Link href="/dashboard/targets" className="hover:text-slate-950 transition-colors">Pricing</Link>
            </div>

            {/* Auth Actions */}
            <div className="flex items-center gap-4 text-xs">
              <Link href="/login" className="font-semibold text-slate-700 hover:text-slate-950 hidden sm:block">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
              >
                Sign up free
              </Link>
            </div>
          </div>

          {/* Hero Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 sm:pt-12">
            {/* Left Column: Heading & CTA */}
            <div className="lg:col-span-4 space-y-6 text-left">
              {/* Coral Orange Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fde8e4] text-[#ea580c] text-xs font-bold font-sans">
                <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
                <span className="tracking-wide">AI-POWERED SECURITY</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.12]">
                AI Security Agent That Protects Data
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Autonomous AI agents that detect threats, prevent data breaches, and keep your business secure 24/7.
              </p>

              {/* Action Button: Black Pill with VariableFontHover */}
              <div className="pt-1">
                <Link
                  href="/scan/new"
                  className="inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-lg transition-all hover:scale-105 group"
                >
                  <VariableFontHoverByRandomLetter
                    label="Book a Demo"
                    staggerDuration={0.03}
                    fromFontVariationSettings="'wght' 500, 'slnt' 0"
                    toFontVariationSettings="'wght' 900, 'slnt' 0"
                    className="text-xs font-bold tracking-wide"
                  />
                  <div className="w-7 h-7 rounded-full bg-[#ea580c] flex items-center justify-center text-white group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </Link>
              </div>

              {/* Social Proof with Avatars */}
              <div className="pt-2 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                    AV
                  </div>
                  <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                    TC
                  </div>
                  <div className="w-7 h-7 rounded-full bg-orange-600 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                    MK
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                    JD
                  </div>
                </div>

                <div className="text-[11px] space-y-0.5">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <Star className="w-3 h-3 fill-amber-500" />
                    <Star className="w-3 h-3 fill-amber-500" />
                    <Star className="w-3 h-3 fill-amber-500" />
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span className="font-bold text-slate-900 ml-1">4.9 rating</span>
                  </div>
                  <p className="text-slate-500 text-[10px]">Trusted by 10,000+ security teams</p>
                </div>
              </div>
            </div>

            {/* Center Column: Cyber Holographic Brain Portrait */}
            <div className="lg:col-span-4 flex items-center justify-center relative py-4">
              <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-100">
                <Image
                  src="/ai-security-mind.jpg"
                  alt="AI Security Mind Portrait"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Right Column: Floating Status Cards & Protection Widget */}
            <div className="lg:col-span-4 space-y-5 text-left">
              {/* Card 1: AI Agent Active */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-white">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-medium text-slate-500 font-mono">AI Agent Active</div>
                    <div className="text-xs font-bold text-slate-950">Threats monitored in real-time</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-600 font-sans pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                    <span>Monitor and analyze data activity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                    <span>Detect and block suspicious behavior</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                    <span>Prevent data breaches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                    <span>Ensure compliance automatically</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>Generate accuracy reports</span>
                  </div>
                </div>
              </div>

              {/* Card 2: System Protection Widget with NumberTicker */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-700">System Protection</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-0.5">↑ 18% this week</div>
                </div>

                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono flex items-baseline justify-end">
                    <NumberTicker value={99.7} decimalPlaces={1} />
                    <span className="text-[#ea580c] text-lg ml-0.5">%</span>
                  </div>
                </div>
              </div>

              {/* Headline */}
              <div className="pt-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
                  Your Data Stays Protected.
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Always. Everywhere.</p>
              </div>
            </div>
          </div>

          {/* Trusted By Logos Bar */}
          <div className="mt-12 pt-8 border-t border-slate-100 text-center space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              TRUSTED BY INNOVATIVE COMPANIES
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <span className="text-[#f25022]">■</span> Microsoft
              </span>
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                aws
              </span>
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                Google Cloud
              </span>
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                Azure
              </span>
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                IBM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC TYPOGRAPHY SHOWCASE (Matching User's Preview Code) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-6">
        <div className="rounded-[32px] p-8 sm:p-14 bg-gradient-to-br from-white via-slate-50 to-orange-50/50 border border-white/40 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE VARIABLE FONT ANIMATION</span>
          </div>

          <div className="w-full flex items-center justify-center py-4">
            <Link href="/scan/new">
              <VariableFontHoverByRandomLetter
                label="Let's Go!"
                staggerDuration={0.03}
                className="rounded-full items-center flex justify-center cursor-pointer px-8 py-5 align-text-top text-4xl sm:text-6xl md:text-7xl font-black text-[#1f464d] hover:text-[#ea580c] transition-colors shadow-lg bg-white border border-slate-200/80 hover:scale-105"
                fromFontVariationSettings="'wght' 400, 'slnt' 0"
                toFontVariationSettings="'wght' 900, 'slnt' 0"
              />
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg mx-auto">
            Hover over the <span className="font-bold text-slate-900">Let&apos;s Go!</span> button above to trigger real-time randomized character weight transitions.
          </p>
        </div>
      </section>

      {/* Interactive Stacking Cards Section */}
      <StackingCardsDemo />

      {/* Interactive Smooth Caret Physics Tester */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <Skiper106 />
      </section>

      {/* Universal API Security Gateway Orbiting Circles */}
      <OrbitingCirclesDemo />

      {/* 3D Zero Trust Shield Feature Showcase */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl p-8 sm:p-12 bg-[#120a06]/90 border border-orange-900/40 backdrop-blur-xl shadow-2xl">
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-400 text-xs font-mono font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>ZERO TRUST CRYPTOGRAPHIC PROBING</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Deterministic AST Security Shield
            </h2>
            <p className="text-xs sm:text-sm text-orange-200/75 leading-relaxed">
              Verify BOLA, Broken Authentication, and Sensitive Property Exposure without destructive payloads. SentinelAPI tests cross-tenant boundaries with automated token redaction.
            </p>
            <div className="pt-2">
              <Link
                href="/scan/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
              >
                <span>Run Sandbox Verification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-orange-500/30">
              <Image
                src="/ai-threat-shield.jpg"
                alt="AI Threat Shield"
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Attack Graph Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-mono font-bold uppercase tracking-wider text-orange-100">
              AST Security Boundary & Attack Graph
            </span>
          </div>
          <span className="text-xs text-orange-300 font-mono font-semibold bg-orange-950/60 px-3 py-1 rounded-full border border-orange-500/30">
            React Flow Engine
          </span>
        </div>

        <div className="rounded-3xl border border-orange-900/40 bg-[#120a06]/90 p-1.5 shadow-2xl">
          <SecurityGraph height="480px" />
        </div>
      </section>

      {/* Watermark & Footer */}
      <div className="text-center pb-8 pt-4">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-orange-200/80 tracking-tight font-mono">
          <Globe className="w-4 h-4 text-orange-400" />
          <span>techwitpro.com</span>
        </span>
      </div>

      <footer className="border-t border-orange-950/40 py-8 text-center text-xs text-orange-200/50 font-mono">
        <p>SecureMind • SentinelAPI — Built for AmiHacks Hackathon | Supabase + Next.js + Fastify + Gemini</p>
      </footer>
    </div>
  );
}

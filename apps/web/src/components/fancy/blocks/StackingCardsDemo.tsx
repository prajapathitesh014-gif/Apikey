"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import StackingCards, { StackingCardItem } from "@/components/fancy/blocks/stacking-cards";
import { Sparkles, ShieldCheck, ArrowDown } from "lucide-react";

const securityCards = [
  {
    bgColor: "bg-[#ea580c]",
    badge: "OWASP API #1",
    title: "Autonomous BOLA Defense",
    description:
      "Detects and validates broken object-level authorization vulnerabilities across multi-tenant API endpoints in real-time before malicious actors can harvest cross-tenant records.",
    image:
      "https://plus.unsplash.com/premium_vector-1739262161806-d954eb02427c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXxxdGU5Smx2R3d0b3x8ZW58MHx8fHx8",
  },
  {
    bgColor: "bg-[#1f464d]",
    badge: "OWASP API #3",
    title: "Object Property Exposure Shield",
    description:
      "Compares documented OpenAPI response DTOs against live JSON payloads to detect unmasked passwords, SSNs, and internal ORM serialization leaks.",
    image:
      "https://plus.unsplash.com/premium_vector-1738935247245-97940c74cced?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTZ8cXRlOUpsdkd3dG98fGVufDB8fHx8fA%3D%3D",
  },
  {
    bgColor: "bg-[#7c2d12]",
    badge: "OWASP API #2",
    title: "Broken Authentication Prober",
    description:
      "Sends unauthenticated baseline probes to verify that protected organizational routes enforce strict JWT/Bearer access middleware and deny anonymous callers.",
    image:
      "https://plus.unsplash.com/premium_vector-1738597190290-a3b571590b9e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8OHxxdGU5Smx2R3d0b3x8ZW58MHx8fHx8",
  },
  {
    bgColor: "bg-[#094857]",
    badge: "AI Copilot",
    title: "Google Gemini Code Remediations",
    description:
      "Generates copy-to-clipboard Node.js, Express, and Next.js controller patches and structured root-cause explanations for every verified AST finding.",
    image:
      "https://plus.unsplash.com/premium_vector-1739200616200-69a138d91627?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MnxxdGU5Smx2R3d0b3x8ZW58MHx8fHx8",
  },
  {
    bgColor: "bg-[#9a3412]",
    badge: "Compliance",
    title: "Instant Security Audit Reports",
    description:
      "Exports standardized executive summaries, developer audit traces, and reproducible curl reproduction commands with 1-click JSON and Markdown exports.",
    image:
      "https://plus.unsplash.com/premium_vector-1738935247692-1c2f2c924fd8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MjJ8cXRlOUpsdkd3dG98fGVufDB8fHx8fA%3D%3D",
  },
];

export default function StackingCardsDemo() {
  const container = useRef<HTMLDivElement>(null);

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-12">
      <div className="rounded-[36px] bg-[#130a06]/90 border border-orange-900/40 p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-orange-950/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-400 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>INTERACTIVE STACKING CARDS</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white mt-1 tracking-tight">
              Enterprise AST Protection Pillars
            </h2>
          </div>
          <span className="text-xs font-mono text-orange-200/60 flex items-center gap-1">
            <ArrowDown className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
            Scroll to stack cards
          </span>
        </div>

        <div
          className="h-[520px] overflow-y-auto rounded-3xl p-4 space-y-6 scrollbar-thin scrollbar-thumb-orange-900/50 bg-[#0c0604]/80 border border-orange-950/80"
          ref={container}
        >
          <StackingCards totalCards={securityCards.length} scrollOptions={{ container }}>
            {securityCards.map(({ bgColor, badge, title, description, image }, index) => {
              return (
                <StackingCardItem key={index} index={index} className="py-2">
                  <div
                    className={cn(
                      bgColor,
                      "flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl shadow-2xl text-white border border-white/10 w-full max-w-4xl mx-auto backdrop-blur-xl"
                    )}
                  >
                    <div className="flex-1 space-y-3 text-left">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/30 border border-white/20 text-[10px] font-mono font-bold uppercase tracking-wider">
                        {badge}
                      </span>
                      <h3 className="font-extrabold text-xl sm:text-2xl tracking-tight leading-snug">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
                        {description}
                      </p>
                    </div>

                    <div className="w-full md:w-5/12 aspect-video rounded-2xl relative overflow-hidden shadow-lg border border-white/15 shrink-0">
                      <Image
                        src={image}
                        alt={title}
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                  </div>
                </StackingCardItem>
              );
            })}
          </StackingCards>
        </div>
      </div>
    </section>
  );
}

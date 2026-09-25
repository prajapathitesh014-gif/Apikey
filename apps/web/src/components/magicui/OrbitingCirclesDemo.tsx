"use client";

import React from "react";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import { Sparkles, Lock, ShieldCheck } from "lucide-react";

export function OrbitingCirclesDemo() {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="rounded-[36px] bg-[#140b07]/90 border border-orange-900/40 p-8 sm:p-12 text-center shadow-2xl space-y-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-400 text-xs font-mono font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ZERO-TRUST ECOSYSTEM ORBIT</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Universal API Security Gateway
          </h2>
          <p className="text-xs sm:text-sm text-orange-200/70 max-w-lg mx-auto">
            SentinelAPI continuously audits cross-service integrations and OAuth boundaries in real time.
          </p>
        </div>

        {/* Orbiting Container */}
        <div className="relative flex h-[480px] w-full flex-col items-center justify-center overflow-hidden">
          {/* Central Secure Core Shield */}
          <div className="z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex flex-col items-center justify-center shadow-2xl shadow-orange-500/40 border-2 border-white/40 ring-4 ring-orange-500/20">
            <Lock className="w-8 h-8 text-slate-950" />
            <span className="text-[9px] font-black text-slate-950 tracking-widest mt-0.5">
              SECURE
            </span>
          </div>

          {/* Outer Orbit (radius 180px) */}
          <OrbitingCircles iconSize={44} radius={180} duration={25}>
            <div className="w-7 h-7 text-emerald-400 flex items-center justify-center">
              <Icons.whatsapp />
            </div>
            <div className="w-7 h-7 text-white flex items-center justify-center">
              <Icons.notion />
            </div>
            <div className="w-7 h-7 text-cyan-400 flex items-center justify-center">
              <Icons.openai />
            </div>
            <div className="w-7 h-7 text-amber-400 flex items-center justify-center">
              <Icons.googleDrive />
            </div>
            <div className="w-7 h-7 text-white flex items-center justify-center">
              <Icons.gitHub />
            </div>
          </OrbitingCircles>

          {/* Inner Reverse Orbit (radius 105px, speed 1.8) */}
          <OrbitingCircles iconSize={36} radius={105} reverse speed={1.8} duration={20}>
            <div className="w-6 h-6 text-emerald-400 flex items-center justify-center">
              <Icons.whatsapp />
            </div>
            <div className="w-6 h-6 text-white flex items-center justify-center">
              <Icons.notion />
            </div>
            <div className="w-6 h-6 text-cyan-400 flex items-center justify-center">
              <Icons.openai />
            </div>
            <div className="w-6 h-6 text-amber-400 flex items-center justify-center">
              <Icons.googleDrive />
            </div>
          </OrbitingCircles>
        </div>
      </div>
    </section>
  );
}

const Icons = {
  gitHub: () => (
    <svg width="24" height="24" viewBox="0 0 438.549 438.549" className="fill-current">
      <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z" />
    </svg>
  ),
  notion: () => (
    <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
      <path
        d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917z"
        className="fill-current"
      />
    </svg>
  ),
  openai: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464z" />
    </svg>
  ),
  googleDrive: () => (
    <svg width="24" height="24" viewBox="0 0 87.3 78" className="fill-current">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" />
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" />
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" />
    </svg>
  ),
  whatsapp: () => (
    <svg width="24" height="24" viewBox="0 0 175.216 175.552" className="fill-current">
      <path d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z" />
    </svg>
  ),
};

export default OrbitingCirclesDemo;

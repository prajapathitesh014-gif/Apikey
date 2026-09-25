import React from "react";
import Link from "next/link";

interface BrandIconProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  withGlow?: boolean;
}

export function BrandIcon({ size = "md", className = "", withGlow = true }: BrandIconProps) {
  const sizeMap = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 group ${sizeMap[size]} ${className}`}>
      {/* Glow aura */}
      {withGlow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-400 blur-md opacity-40 group-hover:opacity-75 group-hover:blur-lg transition-all duration-300 pointer-events-none" />
      )}

      {/* Futuristic Cyber Security Shield SVG */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-md transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Base Shield Gradient */}
          <linearGradient id="shieldBg" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff7a18" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>

          {/* Inner Core Gradient */}
          <linearGradient id="coreGlow" x1="24" y1="12" x2="24" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>

          {/* Border Highlight */}
          <linearGradient id="borderStroke" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.6" />
          </linearGradient>

          {/* Shackle Gradient */}
          <linearGradient id="shackleGrad" x1="16" y1="10" x2="32" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ffedd5" />
          </linearGradient>

          <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shield Container with Rounded Hex Facets */}
        <path
          d="M24 3.5L41 9.8C41.8 10.1 42.5 10.8 42.5 11.7V23C42.5 33.2 34.6 42.1 24.5 44.4C24.2 44.5 23.8 44.5 23.5 44.4C13.4 42.1 5.5 33.2 5.5 23V11.7C5.5 10.8 6.2 10.1 7 9.8L24 3.5Z"
          fill="url(#shieldBg)"
          stroke="url(#borderStroke)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* AST Neural Circuit Lines on Shield */}
        <path
          d="M14 18L18 22M34 18L30 22M18 34L24 31M30 34L24 31"
          stroke="#fed7aa"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />
        <circle cx="14" cy="18" r="1.5" fill="#fef08a" />
        <circle cx="34" cy="18" r="1.5" fill="#fef08a" />
        <circle cx="18" cy="34" r="1.5" fill="#fef08a" />
        <circle cx="30" cy="34" r="1.5" fill="#fef08a" />

        {/* High-Tech Shackle (Lock Top) */}
        <path
          d="M18 20V15.5C18 12.2 20.7 9.5 24 9.5C27.3 9.5 30 12.2 30 15.5V20"
          stroke="url(#shackleGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Modern Lock Body */}
        <rect
          x="15.5"
          y="19"
          width="17"
          height="14"
          rx="3.5"
          fill="#1c0a03"
          stroke="#fed7aa"
          strokeWidth="1.5"
        />

        {/* Futuristic Glowing Keyhole / AST Core */}
        <circle cx="24" cy="24.5" r="2.2" fill="url(#coreGlow)" filter="url(#neonBlur)" />
        <path
          d="M24 25.5V29"
          stroke="#fef08a"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Specular Highlight Sheen */}
        <path
          d="M10 12L24 6.5L38 12"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />
      </svg>
    </div>
  );
}

interface BrandLogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  className?: string;
}

export function BrandLogo({
  href = "/",
  size = "md",
  showSubtitle = true,
  className = ""
}: BrandLogoProps) {
  const content = (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      <BrandIcon size={size} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-extrabold tracking-tight text-white group-hover:text-orange-200 transition-colors text-base sm:text-lg font-sans">
            SecureMind
          </span>
          <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono text-[11px] font-bold tracking-wider">
            AST
          </span>
        </div>
        {showSubtitle && (
          <p className="text-[10px] text-orange-300/60 group-hover:text-orange-300/80 transition-colors font-mono tracking-wide mt-1">
            Autonomous API Security
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

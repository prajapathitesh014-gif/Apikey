"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface VariableFontHoverByRandomLetterProps {
  label: string;
  staggerDuration?: number;
  className?: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  onClick?: () => void;
}

export default function VariableFontHoverByRandomLetter({
  label,
  staggerDuration = 0.03,
  className = "",
  fromFontVariationSettings = "'wght' 400, 'slnt' 0",
  toFontVariationSettings = "'wght' 900, 'slnt' 0",
  onClick
}: VariableFontHoverByRandomLetterProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Generate randomized delays for each character
  const letters = useMemo(() => {
    const chars = label.split("");
    const indices = Array.from({ length: chars.length }, (_, i) => i);
    // Shuffle indices for random stagger order
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const delayMap = new Map<number, number>();
    indices.forEach((idx, order) => {
      delayMap.set(idx, order * staggerDuration);
    });

    return chars.map((char, index) => ({
      char: char === " " ? "\u00A0" : char,
      delay: delayMap.get(index) || 0
    }));
  }, [label, staggerDuration]);

  return (
    <motion.span
      className={`inline-flex items-center select-none cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {letters.map((item, idx) => (
        <motion.span
          key={idx}
          className="inline-block transition-colors duration-200"
          animate={{
            fontVariationSettings: isHovered ? toFontVariationSettings : fromFontVariationSettings,
            fontWeight: isHovered ? 900 : 500,
            scale: isHovered ? [1, 1.15, 1.05] : 1,
            y: isHovered ? -2 : 0
          }}
          transition={{
            duration: 0.35,
            delay: isHovered ? item.delay : item.delay * 0.5,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {item.char}
        </motion.span>
      ))}
    </motion.span>
  );
}

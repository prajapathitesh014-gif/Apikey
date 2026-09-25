"use client";

import React, { createContext, useContext, ReactNode, RefObject } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface StackingCardsContextType {
  totalCards: number;
  scrollYProgress: MotionValue<number>;
}

const StackingCardsContext = createContext<StackingCardsContextType | null>(null);

interface StackingCardsProps {
  totalCards: number;
  scrollOptions?: {
    container?: RefObject<HTMLElement | null>;
  };
  children: ReactNode;
  className?: string;
}

export default function StackingCards({
  totalCards,
  scrollOptions,
  children,
  className
}: StackingCardsProps) {
  const { scrollYProgress } = useScroll(scrollOptions);

  return (
    <StackingCardsContext.Provider value={{ totalCards, scrollYProgress }}>
      <div className={cn("relative w-full", className)}>
        {children}
      </div>
    </StackingCardsContext.Provider>
  );
}

interface StackingCardItemProps {
  index: number;
  children: ReactNode;
  className?: string;
}

export function StackingCardItem({
  index,
  children,
  className
}: StackingCardItemProps) {
  const context = useContext(StackingCardsContext);
  const total = context?.totalCards || 5;

  // Stagger scale and top offset for sticky stacking effect
  return (
    <div
      className={cn(
        "sticky top-8 w-full flex items-center justify-center transition-transform",
        className
      )}
      style={{
        zIndex: index + 1
      }}
    >
      <motion.div
        className="w-full flex justify-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

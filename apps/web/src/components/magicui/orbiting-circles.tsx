"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface OrbitingCirclesProps {
  className?: string;
  children?: ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
}

export function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 160,
  path = true,
  iconSize = 40,
  speed = 1,
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed;
  const childArray = React.Children.toArray(children);
  const total = childArray.length;

  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-orange-500/20 stroke-1"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            strokeDasharray="4 4"
          />
        </svg>
      )}

      {childArray.map((child, index) => {
        const angle = (360 / total) * index;
        return (
          <div
            key={index}
            style={
              {
                "--duration": `${calculatedDuration}s`,
                "--radius": `${radius}px`,
                "--angle": `${angle}deg`,
                "--icon-size": `${iconSize}px`,
              } as React.CSSProperties
            }
            className={cn(
              "absolute flex size-[var(--icon-size)] transform-gpu items-center justify-center rounded-full bg-[#1c0f0a] border border-orange-500/30 p-2 text-white shadow-lg shadow-orange-500/10",
              reverse ? "animate-orbit-reverse" : "animate-orbit",
              className,
            )}
          >
            {child}
          </div>
        );
      })}
    </>
  );
}

export default OrbitingCircles;

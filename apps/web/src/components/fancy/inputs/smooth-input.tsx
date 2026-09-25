"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import React, {
  type ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const inputWrapperClassName = cn(
  "bg-[#170c07]/90 border border-orange-900/40 text-white has-[:focus-visible]:border-orange-500 relative w-full max-w-[420px] rounded-2xl p-4 shadow-xl",
  "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-orange-500/20",
);

const inputClassName =
  "w-full bg-transparent outline-none placeholder:text-orange-200/40 text-white font-sans text-base";

type InputFieldProps = ComponentPropsWithoutRef<"input"> & {
  wrapperClassName?: string;
};

type SmoothInputType = "text" | "password";

type SmoothInputProps = Omit<InputFieldProps, "type"> & {
  type?: SmoothInputType;
};

const Input = ({ className, wrapperClassName, ...props }: InputFieldProps) => {
  return (
    <div className={cn(inputWrapperClassName, wrapperClassName)}>
      <input className={cn(inputClassName, className)} {...props} />
    </div>
  );
};

const PASSWORD_CHAR = typeof window !== "undefined" && navigator.userAgent.match(/firefox|fxios/i)
  ? "\u25CF"
  : "\u2022";

const SmoothInput = ({
  className,
  wrapperClassName,
  value,
  defaultValue,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  style,
  ...props
}: SmoothInputProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const caretX = useMotionValue(0);
  const caretOpacity = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const isControlled = value !== undefined;

  const springCaretX = useSpring(
    caretX,
    prefersReducedMotion
      ? { stiffness: 10000, damping: 100, mass: 0.1 }
      : { stiffness: 500, damping: 30, mass: 0.5 },
  );

  const inputValue = isControlled ? String(value) : internalValue;
  const displayPlaceholder = placeholder || "Try typing an API endpoint...";

  const syncMeasureSpan = () => {
    const input = inputRef.current;
    const measureSpan = measureRef.current;
    if (!input || !measureSpan) return;

    const styles = window.getComputedStyle(input);
    const isPassword = input.type === "password";

    let fontSize = styles.fontSize;
    if (
      PASSWORD_CHAR === "\u2022" &&
      isPassword &&
      !navigator.userAgent.match(/chrome|chromium|crios/i)
    ) {
      fontSize = `${parseFloat(fontSize) + 6.25}px`;
    }

    measureSpan.style.font = `${styles.fontStyle} ${styles.fontWeight} ${fontSize} ${styles.fontFamily}`;
    measureSpan.style.letterSpacing = styles.letterSpacing;
    measureSpan.style.fontFeatureSettings = styles.fontFeatureSettings;
    measureSpan.style.fontVariationSettings = styles.fontVariationSettings;
  };

  const measurePrefixWidth = (text: string) => {
    const input = inputRef.current;
    const measureSpan = measureRef.current;
    if (!input || !measureSpan) return null;

    syncMeasureSpan();
    measureSpan.textContent = text;

    const paddingLeft =
      parseFloat(window.getComputedStyle(input).paddingLeft) || 0;

    return text.length > 0
      ? measureSpan.offsetWidth + paddingLeft
      : paddingLeft - 1;
  };

  const scrollCaretIntoView = (
    target: HTMLInputElement,
    absoluteWidth: number,
  ) => {
    const styles = window.getComputedStyle(target);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    const maxScroll = Math.max(0, target.scrollWidth - target.clientWidth);
    const visibleRight = target.scrollLeft + target.clientWidth - paddingRight;
    const visibleLeft = target.scrollLeft + paddingLeft;

    if (absoluteWidth > visibleRight) {
      target.scrollLeft = Math.min(
        absoluteWidth - target.clientWidth + paddingRight,
        maxScroll,
      );
      return;
    }

    if (absoluteWidth < visibleLeft) {
      target.scrollLeft = Math.max(0, absoluteWidth - paddingLeft);
    }
  };

  const getCaretIndex = (target: HTMLInputElement) => {
    const selectionStart = target.selectionStart ?? 0;
    const selectionEnd = target.selectionEnd ?? 0;

    if (selectionStart === selectionEnd) {
      return selectionStart;
    }

    return target.selectionDirection === "backward"
      ? selectionStart
      : selectionEnd;
  };

  const updateCaretFromInput = (target: HTMLInputElement) => {
    const selectionStart = target.selectionStart ?? 0;
    const selectionEnd = target.selectionEnd ?? 0;
    const hasSelection = selectionStart !== selectionEnd;
    const caretIndex = getCaretIndex(target);
    const isPassword = target.type === "password";
    const textBeforeCaret = isPassword
      ? PASSWORD_CHAR.repeat(caretIndex)
      : target.value.slice(0, caretIndex);

    const absoluteWidth = measurePrefixWidth(textBeforeCaret);
    if (absoluteWidth === null) return;

    scrollCaretIntoView(target, absoluteWidth);

    const styles = window.getComputedStyle(target);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    const caretPosition = absoluteWidth - target.scrollLeft;
    const minX = paddingLeft - 1;
    const maxX = target.clientWidth - paddingRight;
    const isCaretVisible =
      caretPosition >= minX && caretPosition <= maxX + 1;

    caretX.set(Math.min(caretPosition, maxX));

    if (!isCaretVisible || hasSelection) {
      caretOpacity.set(0);
      return;
    }

    caretOpacity.set(1);
  };

  const updateCaretRef = useRef(updateCaretFromInput);
  updateCaretRef.current = updateCaretFromInput;
  const caretOpacityRef = useRef(caretOpacity);
  caretOpacityRef.current = caretOpacity;

  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement === input) {
      updateCaretRef.current(input);
    }
  }, [inputValue]);

  useEffect(() => {
    const input = inputRef.current;
    const container = containerRef.current;
    if (!input || !container) return;

    const updateCaretIfFocused = () => {
      if (document.activeElement === input) {
        updateCaretRef.current(input);
      }
    };

    const handleSelectionChange = () => {
      if (document.activeElement !== input) return;

      requestAnimationFrame(() => {
        if (document.activeElement === input) {
          updateCaretRef.current(input);
        }
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.fonts?.addEventListener("loadingdone", updateCaretIfFocused);
    void document.fonts?.ready.then(updateCaretIfFocused);
    input.addEventListener("scroll", updateCaretIfFocused);

    const resizeObserver = new ResizeObserver(updateCaretIfFocused);
    resizeObserver.observe(container);

    updateCaretIfFocused();

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.fonts?.removeEventListener("loadingdone", updateCaretIfFocused);
      input.removeEventListener("scroll", updateCaretIfFocused);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={cn(inputWrapperClassName, wrapperClassName)}>
      <div
        ref={containerRef}
        className="relative grid grid-cols-1 p-0 text-lg"
        style={{ caretColor: "transparent" }}
      >
        <input
          {...props}
          ref={inputRef}
          type={type}
          placeholder={displayPlaceholder}
          className={cn(
            inputClassName,
            "col-start-1 col-end-2 row-start-1 row-end-2 text-inherit",
            className,
          )}
          style={style}
          value={inputValue}
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value);
            onChange?.(e);
            requestAnimationFrame(() => {
              updateCaretRef.current(e.target);
            });
          }}
          onBlur={(e) => {
            caretOpacityRef.current.set(0);
            onBlur?.(e);
          }}
        />
        <span
          ref={measureRef}
          aria-hidden
          className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre"
        />
        <motion.div
          className="bg-orange-500 pointer-events-none col-start-1 col-end-2 row-start-1 row-end-2 h-[0.9em] w-0.5 self-center shadow-[0_0_8px_#ea580c]"
          style={{ x: springCaretX, opacity: caretOpacity }}
        />
      </div>
    </div>
  );
};

const Skiper106 = () => {
  return (
    <div className="rounded-3xl bg-[#140b07]/90 border border-orange-900/40 p-8 sm:p-12 text-white flex flex-col items-center justify-center shadow-2xl max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold uppercase">
          INTERACTIVE PROBE INPUT
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Try Smooth Caret Physics
        </h3>
        <p className="text-xs text-orange-200/70">
          Type an API endpoint or authorization token to experience physics-driven caret tracking.
        </p>
      </div>

      <div className="flex w-full flex-col items-center space-y-4">
        <SmoothInput
          placeholder="e.g. /api/v1/orders/{id}"
          aria-label="Smooth caret input"
        />
      </div>
    </div>
  );
};

export { Input, Skiper106, SmoothInput };
export default SmoothInput;

"use client";

import { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: "reveal" | "reveal-left" | "reveal-right" | "reveal-scale" | "reveal-line";
  delay?: "d1" | "d2" | "d3" | "d4" | "d5" | "d6";
  threshold?: number;
  as?: "div" | "section" | "article" | "span" | "li";
}

export function ScrollReveal({
  children,
  className = "",
  variant = "reveal",
  delay,
  threshold = 0.12,
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const delayClass = delay ? `reveal-${delay}` : "";

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`${variant} ${delayClass} ${className}`}>
      {children}
    </Tag>
  );
}

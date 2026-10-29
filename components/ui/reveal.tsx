"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger in milliseconds, for sibling items. */
  delay?: number;
};

/**
 * Fades content up as it scrolls into view.
 *
 * Fails safe in three ways:
 *  - without JavaScript a `<noscript>` rule in the layout forces everything
 *    visible;
 *  - without IntersectionObserver support the content is revealed on mount;
 *  - with `prefers-reduced-motion` the transition collapses to nothing (see
 *    `globals.css`) and content simply appears.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const show = () => node.setAttribute("data-in", "true");

    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

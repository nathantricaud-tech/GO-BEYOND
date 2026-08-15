import { useEffect, useRef } from "react";

/**
 * Lightweight scroll-reveal, mobile-safe (no GSAP/Framer needed).
 * Usage: const ref = useReveal<HTMLDivElement>();  <div ref={ref} className="reveal">...
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Renders children into document.body via a portal instead of in-place.
 * Modals MUST use this: rendering them inline (even with position:fixed)
 * makes them vulnerable to any ancestor with an active CSS animation,
 * transform, or filter — all of which create a new containing block /
 * stacking context per the CSS spec and silently break "fixed" positioning
 * and z-index. A portal sidesteps the whole class of bug permanently.
 */
export default function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

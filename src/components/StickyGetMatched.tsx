"use client";

import { FindCoverageLink } from "@/components/AttributionLinks";
import { useEffect, useState } from "react";

/** Mobile sticky CTA after ~30% scroll on long guide pages. */
export function StickyGetMatched() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) return;
      setVisible(doc.scrollTop / max >= 0.3);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
      <FindCoverageLink className="flex w-full items-center justify-center rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white">
        Get Matched — ~60 sec
      </FindCoverageLink>
    </div>
  );
}

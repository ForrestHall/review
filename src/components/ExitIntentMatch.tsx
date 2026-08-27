"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { findCoverageHref } from "@/lib/attribution";

const STORAGE_KEY = "rvr_exit_intent_quiz";

/**
 * Once per browser session: offer the quiz when the cursor leaves toward the
 * top of the viewport (desktop). Skipped on the quiz landing itself.
 */
export function ExitIntentMatch() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/find-coverage" || pathname.startsWith("/find-coverage/")) {
      return;
    }
    if (typeof sessionStorage === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    function onMouseOut(e: MouseEvent) {
      if (e.clientY > 0) return;
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
    }

    document.addEventListener("mouseout", onMouseOut);
    return () => document.removeEventListener("mouseout", onMouseOut);
  }, [pathname]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <h2
          id="exit-intent-title"
          className="font-serif text-xl font-semibold text-foreground"
        >
          Still comparing warranties?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Get matched to the best coverage for your RV in about 60 seconds — no
          obligation.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={findCoverageHref("exit-intent-quiz")}
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90"
            onClick={() => setOpen(false)}
          >
            Get Matched
          </Link>
          <button
            type="button"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-brand hover:text-brand"
            onClick={() => setOpen(false)}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

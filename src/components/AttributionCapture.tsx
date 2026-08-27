"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { captureLeadAttribution } from "@/lib/attribution";

/** Captures UTMs from any page URL into sessionStorage for the quiz submit. */
export function AttributionCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    captureLeadAttribution();
  }, [searchParams]);

  return null;
}

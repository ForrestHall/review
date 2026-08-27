"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  captureLeadAttribution,
  getLeadAttribution,
  type LeadAttribution,
} from "@/lib/attribution";

/** Stored first-touch UTMs from the landing URL. */
export function useAttribution(): LeadAttribution | null {
  const pathname = usePathname();
  const [attribution, setAttribution] = useState<LeadAttribution | null>(null);

  useEffect(() => {
    captureLeadAttribution();
    setAttribution(getLeadAttribution());
  }, [pathname]);

  return attribution;
}

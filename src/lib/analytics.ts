/** GA4 helpers for quiz funnel + lead events (Looker Studio / BigQuery). */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type Ga4LeadAttribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
};

function callGtag(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

/** Fires on each /find-coverage step change. Register `quiz_step` as a custom dimension in GA4. */
export function trackQuizStep(
  step: string,
  attribution: Ga4LeadAttribution | null = null
) {
  if (step === "matching" || step === "result") return;
  callGtag("event", "quiz_step", {
    quiz_step: step,
    method: "find_coverage",
    ...(attribution ?? {}),
  });
}

/** Fires only after a successful /api/arw-lead response. Register UTM params as custom dimensions in GA4. */
export function trackGenerateLead(attribution: Ga4LeadAttribution | null) {
  callGtag("event", "generate_lead", {
    method: "find_coverage",
    currency: "USD",
    ...(attribution ?? {}),
  });
}

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

const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() ?? "AW-880590315";
const GOOGLE_ADS_LEAD_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL?.trim();

/**
 * Google Ads conversion on quiz submit. Create the action in Google Ads, then set
 * NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL so remarketing lists can exclude converters.
 */
export function trackGoogleAdsLead() {
  if (!GOOGLE_ADS_ID || !GOOGLE_ADS_LEAD_LABEL) return;
  callGtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
  });
}

/** Fires when the exit-intent modal opens (once per session). */
export function trackExitIntentShow() {
  callGtag("event", "exit_intent_show", {
    method: "find_coverage",
  });
}

/** Fires when the user clicks Get Matched in the exit-intent modal. */
export function trackExitIntentClick(ctaMedium: string) {
  callGtag("event", "exit_intent_click", {
    method: "find_coverage",
    cta_medium: ctaMedium,
  });
}

/** User clicked Unlock on the match result → phone offer screen. */
export function trackUnlockOfferClick(
  attribution: Ga4LeadAttribution | null = null
) {
  callGtag("event", "unlock_offer_click", {
    method: "find_coverage",
    ...(attribution ?? {}),
  });
}

/** User tapped the tel: CTA on the phone offer screen. */
export function trackPhoneOfferCallClick(
  phoneNumber: string,
  attribution: Ga4LeadAttribution | null = null
) {
  callGtag("event", "phone_call_click", {
    method: "find_coverage",
    phone_number: phoneNumber.replace(/\D/g, ""),
    ...(attribution ?? {}),
  });
}

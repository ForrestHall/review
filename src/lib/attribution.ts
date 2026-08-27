/** UTM capture + ARW-aligned link builders (campaign=rvr, kebab-case medium). */

const STORAGE_KEY = "rvr_lead_attribution";

/** Matches /quote/source/rvr/ and AWI advertiser token. */
export const UTM_CAMPAIGN = "rvr";

const ATTR_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

export type LeadAttribution = Partial<
  Record<(typeof ATTR_KEYS)[number], string>
>;

export type OrganicQuizMedium =
  | "find-coverage"
  | "header-get-matched"
  | "home-hero-quiz"
  | "sticky-get-matched"
  | "exit-intent-quiz"
  | "quiz-match-cta"
  | "review-get-matched"
  | "compare-get-matched"
  | "guide-get-matched"
  | "blog-get-matched"
  | "review-get-quote";

/** Organic quiz CTA — ARW pattern: campaign=rvr, source=organic, medium=kebab slug. */
export function findCoverageHref(medium: OrganicQuizMedium): string {
  const params = new URLSearchParams({
    utm_campaign: UTM_CAMPAIGN,
    utm_source: "organic",
    utm_medium: medium,
  });
  return `/find-coverage?${params.toString()}`;
}

/** Append ARW-aligned UTMs to an external quote URL. */
export function withOrganicUtms(
  baseUrl: string,
  medium: OrganicQuizMedium
): string {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_campaign", UTM_CAMPAIGN);
  url.searchParams.set("utm_source", "organic");
  url.searchParams.set("utm_medium", medium);
  return url.toString();
}

function applyClickIdDefaults(
  attribution: LeadAttribution
): LeadAttribution {
  const next = { ...attribution };
  if (next.gclid && !next.utm_source) {
    next.utm_source = "Google";
  }
  if (next.fbclid && !next.utm_source) {
    next.utm_source = "Facebook";
  }
  if (!next.utm_campaign && (next.utm_source || next.gclid || next.fbclid)) {
    next.utm_campaign = UTM_CAMPAIGN;
  }
  return next;
}

/** Persist UTM / click IDs from the landing URL (first-touch per session). */
export function captureLeadAttribution() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const existing = getLeadAttribution() ?? {};
    const next: LeadAttribution = { ...existing };
    let updated = false;
    for (const key of ATTR_KEYS) {
      const value = params.get(key);
      if (value && !next[key]) {
        next[key] = value.slice(0, 200);
        updated = true;
      }
    }
    const merged = applyClickIdDefaults(next);
    if (updated || Object.keys(merged).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
  } catch {
    /* ignore */
  }
}

export function getLeadAttribution(): LeadAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LeadAttribution;
  } catch {
    return null;
  }
}

/** UTM query keys forwarded by /get-quote redirect. */
export const UTM_QUERY_KEYS = ATTR_KEYS;

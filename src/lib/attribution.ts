/** UTM capture + ARW-aligned link builders (campaign=rvr, kebab-case medium). */

import { captureLandingVariant } from "@/lib/ad-variants";

const STORAGE_KEY = "rvr_lead_attribution";

/** Matches /quote/source/rvr/ and AWI advertiser token. */
export const UTM_CAMPAIGN = "rvr";

const FIRST_TOUCH_UTM = [
  "utm_source",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/** Last-touch when present in URL — tracks which CTA drove the quiz. */
const LAST_TOUCH_UTM = ["utm_medium"] as const;

const UTM_KEYS = [...FIRST_TOUCH_UTM, ...LAST_TOUCH_UTM] as const;

const CLICK_ID_KEYS = ["fbclid", "gclid"] as const;

const ATTR_KEYS = [...UTM_KEYS, ...CLICK_ID_KEYS] as const;

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

/** Facebook / paid ad landing URL builder. Sets utm_content to match medium so SF can distinguish homepage vs quiz ad landings (first-touch). */
export function buildAdLandingHref(
  path: string,
  medium: string,
  source = "Facebook"
): string {
  const params = new URLSearchParams({
    utm_campaign: UTM_CAMPAIGN,
    utm_source: source,
    utm_medium: medium,
    utm_content: medium,
  });
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${normalized}?${params.toString()}`;
}

function isAdLandingMedium(medium: string): boolean {
  return medium.startsWith("quiz") || medium.startsWith("rankings");
}

/** Lock first-touch utm_content to the ad landing slug (homepage vs quiz). */
function preserveAdLandingContent(
  existing: LeadAttribution,
  merged: LeadAttribution,
  search: string
): LeadAttribution {
  if (existing.utm_content || merged.utm_content) return merged;
  if (new URLSearchParams(search).get("utm_content")) return merged;
  const landingMedium = existing.utm_medium ?? merged.utm_medium;
  if (landingMedium && isAdLandingMedium(landingMedium)) {
    return { ...merged, utm_content: landingMedium };
  }
  return merged;
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

function readAttributionFromSearch(
  search: string,
  existing: LeadAttribution = {}
): LeadAttribution {
  const params = new URLSearchParams(search);
  const next: LeadAttribution = { ...existing };

  for (const key of FIRST_TOUCH_UTM) {
    const value = params.get(key);
    if (value && !next[key]) {
      next[key] = value.slice(0, 200);
    }
  }

  for (const key of LAST_TOUCH_UTM) {
    const value = params.get(key);
    if (value) {
      next[key] = value.slice(0, 200);
    }
  }

  for (const key of CLICK_ID_KEYS) {
    const value = params.get(key);
    if (value && !next[key]) {
      next[key] = value.slice(0, 200);
    }
  }

  return applyClickIdDefaults(next);
}

/** Persist UTM / click IDs from the landing URL (hybrid: first-touch source, last-touch medium). */
export function captureLeadAttribution() {
  if (typeof window === "undefined") return;
  try {
    const existing = getLeadAttribution() ?? {};
    let merged = readAttributionFromSearch(window.location.search, existing);
    merged = preserveAdLandingContent(existing, merged, window.location.search);
    if (Object.keys(merged).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      captureLandingVariant(
        existing.utm_content ?? existing.utm_medium ?? merged.utm_content ?? merged.utm_medium
      );
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

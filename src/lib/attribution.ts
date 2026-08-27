/** UTM capture + passthrough link builders (TBC-style: LP UTMs flow to all CTAs). */

import { captureLandingVariant } from "@/lib/ad-variants";

const STORAGE_KEY = "rvr_lead_attribution";

export const UTM_CAMPAIGN = "rvr";

const UTM_PARAM_KEYS = [
  "utm_campaign",
  "utm_source",
  "utm_medium",
  "utm_content",
  "utm_term",
] as const;

const CLICK_ID_KEYS = ["fbclid", "gclid"] as const;

export const UTM_QUERY_KEYS = [...UTM_PARAM_KEYS, ...CLICK_ID_KEYS] as const;

export type LeadAttribution = Partial<
  Record<(typeof UTM_QUERY_KEYS)[number], string>
>;

export function hasUtmParams(attribution: LeadAttribution | null): boolean {
  if (!attribution) return false;
  return UTM_PARAM_KEYS.some((key) => Boolean(attribution[key]));
}

export function utmSearchParams(
  attribution: LeadAttribution | null
): URLSearchParams {
  const params = new URLSearchParams();
  if (!attribution) return params;
  for (const key of UTM_PARAM_KEYS) {
    const value = attribution[key];
    if (value) params.set(key, value);
  }
  return params;
}

/** Quiz CTA — passthrough stored landing UTMs, or plain /find-coverage. */
export function buildFindCoverageHref(
  attribution: LeadAttribution | null
): string {
  const qs = utmSearchParams(attribution).toString();
  return qs ? `/find-coverage?${qs}` : "/find-coverage";
}

/** ARW / external quote CTA — passthrough stored landing UTMs onto base URL. */
export function buildQuoteHref(
  baseUrl: string,
  attribution: LeadAttribution | null
): string {
  if (!hasUtmParams(attribution)) return baseUrl;
  const url = new URL(baseUrl);
  utmSearchParams(attribution).forEach((value, key) => {
    url.searchParams.set(key, value);
  });
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

  for (const key of UTM_PARAM_KEYS) {
    const value = params.get(key);
    if (value && !next[key]) {
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

/** Persist UTM / click IDs from the landing URL (first-touch per session). */
export function captureLeadAttribution() {
  if (typeof window === "undefined") return;
  try {
    const existing = getLeadAttribution() ?? {};
    const merged = readAttributionFromSearch(window.location.search, existing);
    if (Object.keys(merged).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      captureLandingVariant(merged.utm_medium);
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

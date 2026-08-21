const STORAGE_KEY = "rvr_lead_attribution";

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

/** Persist UTM / click IDs from the landing URL for analytics on submit. */
export function captureLeadAttribution() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const next: LeadAttribution = {};
    let found = false;
    for (const key of ATTR_KEYS) {
      const value = params.get(key);
      if (value) {
        next[key] = value.slice(0, 200);
        found = true;
      }
    }
    if (!found) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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

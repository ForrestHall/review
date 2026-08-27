/** Ad landing variants — first-touch, keyed off utm_medium prefix. */

const VARIANT_STORAGE_KEY = "rvr_landing_variant";

export type AdLandingVariant = "quiz" | "rankings";

export function resolveVariantFromMedium(
  medium?: string
): AdLandingVariant | null {
  if (!medium) return null;
  if (medium.startsWith("rankings")) return "rankings";
  if (medium.startsWith("quiz")) return "quiz";
  return null;
}

/** Persist landing variant on first utm_medium capture (first-touch). */
export function captureLandingVariant(utmMedium?: string) {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(VARIANT_STORAGE_KEY)) return;
    const variant = resolveVariantFromMedium(utmMedium);
    if (variant) {
      sessionStorage.setItem(VARIANT_STORAGE_KEY, variant);
    }
  } catch {
    /* ignore */
  }
}

export function getLandingVariant(): AdLandingVariant | null {
  if (typeof window === "undefined") return null;
  try {
    const value = sessionStorage.getItem(VARIANT_STORAGE_KEY);
    if (value === "quiz" || value === "rankings") return value;
    return null;
  } catch {
    return null;
  }
}

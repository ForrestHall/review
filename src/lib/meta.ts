/** Meta Pixel helpers — no-op until NEXT_PUBLIC_META_PIXEL_ID is set. */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackMetaLead() {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  window.fbq("track", "Lead");
}

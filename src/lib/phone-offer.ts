/** Phone-only post-quiz offer (SurgeFlow-style call CTA). */

export const OFFER_UNLOCK_STORAGE_KEY = "rvr_offer_unlock_at";

const DEFAULT_PHONE = "8773632783";
const DEFAULT_OFFER_AMOUNT = "200";
const DEFAULT_OFFER_PHRASE = "RV Warranty Review";

export function getPhoneOfferConfig() {
  const digits =
    process.env.NEXT_PUBLIC_RVR_SALES_PHONE?.replace(/\D/g, "") ||
    DEFAULT_PHONE;
  const amount =
    process.env.NEXT_PUBLIC_RVR_PHONE_OFFER_AMOUNT?.trim() ||
    DEFAULT_OFFER_AMOUNT;
  const phrase =
    process.env.NEXT_PUBLIC_RVR_PHONE_OFFER_PHRASE?.trim() ||
    DEFAULT_OFFER_PHRASE;
  return { digits, amount, phrase };
}

export function formatDisplayPhone(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (d.length === 10) {
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  if (d.length === 11 && d.startsWith("1")) {
    return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  }
  return digits;
}

export function formatTelHref(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (d.length === 10) return `tel:+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `tel:+${d}`;
  return `tel:${digits}`;
}

export function readOfferUnlockAt(): number | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(OFFER_UNLOCK_STORAGE_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function writeOfferUnlockAt(ms: number = Date.now()) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(OFFER_UNLOCK_STORAGE_KEY, String(ms));
  } catch {
    /* ignore */
  }
}

export const OFFER_DURATION_MS = 24 * 60 * 60 * 1000;

export function remainingOfferMs(unlockAt: number, now = Date.now()): number {
  return Math.max(0, unlockAt + OFFER_DURATION_MS - now);
}

export function formatCountdown(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

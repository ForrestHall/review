"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  formatCountdown,
  formatDisplayPhone,
  formatTelHref,
  getPhoneOfferConfig,
  readOfferUnlockAt,
  OFFER_DURATION_MS,
  remainingOfferMs,
  writeOfferUnlockAt,
} from "@/lib/phone-offer";
import { trackPhoneOfferCallClick } from "@/lib/analytics";
import { getLeadAttribution } from "@/lib/attribution";

type PhoneOfferScreenProps = {
  firstName: string;
  footerNote?: ReactNode;
  onlineQuoteHref?: string;
};

export function PhoneOfferScreen({
  firstName,
  footerNote,
  onlineQuoteHref,
}: PhoneOfferScreenProps) {
  const { digits, amount, phrase } = getPhoneOfferConfig();
  const displayPhone = formatDisplayPhone(digits);
  const telHref = formatTelHref(digits);
  const displayName = firstName.trim() || "there";

  const [remainingMs, setRemainingMs] = useState(OFFER_DURATION_MS);

  useEffect(() => {
    let unlockAt = readOfferUnlockAt();
    if (unlockAt == null) {
      unlockAt = Date.now();
      writeOfferUnlockAt(unlockAt);
    }
    const tick = () => setRemainingMs(remainingOfferMs(unlockAt!));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  function onCallClick() {
    trackPhoneOfferCallClick(digits, getLeadAttribution());
  }

  return (
    <section className="space-y-6 py-2">
      <div className="text-center">
        <span className="inline-block rounded-full bg-[#1e4a8c] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
          RV Warranty Review
        </span>
        <h2 className="mt-5 font-serif text-2xl font-bold leading-tight text-foreground sm:text-3xl">
          {displayName}, your RV warranty discount is{" "}
          <span className="text-brand-light">Unlocked</span>
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl bg-[#0f172a] px-5 py-8 text-center text-white shadow-lg sm:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#f87171]">
          ★ Phone-only offer ★
        </p>
        <p className="mt-4 flex items-baseline justify-center gap-2">
          <span className="font-serif text-5xl font-bold sm:text-6xl">
            ${amount}
          </span>
          <span className="text-2xl font-bold uppercase text-[#f87171] sm:text-3xl">
            Off
          </span>
        </p>
        <p className="mt-2 text-sm font-bold uppercase tracking-wide text-[#f87171]">
          Call within 24 hours
        </p>
        <p className="mt-1 text-xs italic text-slate-400">
          This discount can only be applied by a rep over the phone
        </p>

        <div className="mx-auto mt-6 max-w-sm rounded-lg border border-amber-900/50 bg-[#292018] px-4 py-3">
          <p className="text-xs text-amber-200/90">
            <span aria-hidden className="mr-1">
              ⏰
            </span>
            Offer expires in{" "}
            <span className="font-mono text-base font-semibold text-amber-100">
              {formatCountdown(remainingMs)}
            </span>
          </p>
        </div>

        <p className="mt-5 rounded-lg bg-brand/20 px-3 py-2 text-sm font-medium text-teal-100">
          ${amount} that online quotes will never give you.
        </p>

        <a
          href={telHref}
          onClick={onCallClick}
          className="mt-6 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-brand-light px-6 py-4 text-lg font-bold text-white shadow-md transition-colors hover:bg-teal-500"
        >
          <span aria-hidden>📞</span>
          Call {displayPhone}
        </a>

        <p className="mt-4 text-sm text-slate-300">
          Mention &ldquo;{phrase}&rdquo; for ${amount} off — takes ~3 minutes
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Lines open now · Average wait: under 60 seconds
        </p>
      </div>

      {footerNote ? (
        <p className="text-center text-sm leading-relaxed text-muted">
          {footerNote}
        </p>
      ) : null}

      {onlineQuoteHref ? (
        <p className="text-center text-xs text-muted">
          Prefer online?{" "}
          <a
            href={onlineQuoteHref}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="font-medium text-brand underline-offset-2 hover:underline"
          >
            Get a quote on America&apos;s RV Warranty
          </a>
        </p>
      ) : null}
    </section>
  );
}

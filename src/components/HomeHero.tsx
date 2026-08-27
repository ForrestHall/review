"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLandingVariant, type AdLandingVariant } from "@/lib/ad-variants";
import {
  buildFindCoverageHref,
  captureLeadAttribution,
  getLeadAttribution,
} from "@/lib/attribution";

type HomeHeroProps = {
  year: number;
};

export function HomeHero({ year }: HomeHeroProps) {
  const [variant, setVariant] = useState<AdLandingVariant | null>(null);
  const [quizHref, setQuizHref] = useState("/find-coverage");

  useEffect(() => {
    captureLeadAttribution();
    const attribution = getLeadAttribution();
    setVariant(getLandingVariant());
    setQuizHref(buildFindCoverageHref(attribution));
  }, []);

  const isRankings = variant === "rankings";

  return (
    <section className="border-b border-border bg-gradient-to-br from-brand to-teal-800 text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-200">
          Updated for {year}
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
          Best RV Extended Warranty Companies
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-teal-100">
          {isRankings
            ? `We\u2019ve ranked the top providers for ${year} \u2014 see who earned our #1 spot.`
            : "Take this short quiz to get matched with the best RV warranty coverage for your motorhome, travel trailer, or fifth wheel."}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          {isRankings ? (
            <>
              <Link
                href="/reviews/americas-rv-warranty"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-teal-50"
              >
                See Our #1 Pick
              </Link>
              <Link
                href={quizHref}
                className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Get Matched in ~60 sec
              </Link>
            </>
          ) : (
            <>
              <Link
                href={quizHref}
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-teal-50"
              >
                Get Matched
              </Link>
              <a
                href="#compare"
                className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Compare Top Providers
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

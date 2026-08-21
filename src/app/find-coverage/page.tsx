import type { Metadata } from "next";
import {
  ARW_HOSTED_QUOTE_URL,
  getArwClasses,
  getArwMakes,
  hasArwApiToken,
} from "@/lib/arw";
import { FindCoverageSurvey } from "@/components/FindCoverageSurvey";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Get Your Free RV Warranty Quote",
  description:
    "Answer a few quick questions and get matched with the best RV warranty coverage for your motorhome, travel trailer, or fifth wheel.",
  path: "/find-coverage",
});

export default async function FindCoveragePage() {
  const [classes, makes] = await Promise.all([getArwClasses(), getArwMakes()]);
  const apiEnabled = hasArwApiToken();

  return (
    <div className="relative min-h-[70vh] bg-gradient-to-b from-brand/[0.06] via-background to-background">
      <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            Free quote · No obligation
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Get your free RV warranty quote
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Tell us about your RV — we&apos;ll match you with the best coverage
            in about a minute.
          </p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-muted">
            <li>No obligation</li>
            <li aria-hidden className="text-border">
              ·
            </li>
            <li>Takes ~60 seconds</li>
            <li aria-hidden className="text-border">
              ·
            </li>
            <li>#1 on our {SITE.year} rankings</li>
          </ul>
          <blockquote className="mt-6 border-l-2 border-brand/30 pl-4 text-left text-sm italic leading-relaxed text-muted">
            &ldquo;They pay claims quickly, and repair shops like working with
            them.&rdquo;
            <cite className="mt-1 block text-xs not-italic font-medium text-foreground">
              — Verified owner review
            </cite>
          </blockquote>
        </header>

        <div className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm backdrop-blur-sm sm:p-8">
          <FindCoverageSurvey
            classes={classes}
            makes={makes}
            apiEnabled={apiEnabled}
            hostedQuoteUrl={ARW_HOSTED_QUOTE_URL}
          />
        </div>
      </div>
    </div>
  );
}

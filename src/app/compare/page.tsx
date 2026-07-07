import type { Metadata } from "next";
import Link from "next/link";
import { comparisons } from "@/data/comparisons";
import { getCompany } from "@/data/companies";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "RV Extended Warranty Comparisons",
  description:
    "Side-by-side comparisons of top RV extended warranty companies. Compare coverage, pricing, claims, and deductibles.",
  path: "/compare",
});

export default function CompareIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
        RV Warranty Comparisons
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Side-by-side comparisons of the most popular RV extended warranty
        providers. Updated for {SITE.year} with ratings, feature tables, and
        editorial verdicts.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {comparisons.map((comparison) => {
          const companyA = getCompany(comparison.companyA);
          const companyB = getCompany(comparison.companyB);
          if (!companyA || !companyB) return null;

          return (
            <Link
              key={comparison.slug}
              href={`/compare/${comparison.slug}`}
              className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <h2 className="font-serif text-xl font-semibold text-foreground group-hover:text-brand">
                {companyA.name} vs {companyB.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {comparison.description}
              </p>
              {comparison.winner && (
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand">
                  Winner: {getCompany(comparison.winner)?.name}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

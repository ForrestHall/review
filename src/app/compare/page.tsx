import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { comparisons } from "@/data/comparisons";
import { getCompaniesSorted, getCompany } from "@/data/companies";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: `Best RV Extended Warranty Companies Compared (${SITE.year})`,
  description:
    "Compare the best RV extended warranty companies for 2026. Side-by-side matchups, independent ratings, claims reputation, and links to full reviews of all nine major providers.",
  path: "/compare",
});

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best RV Extended Warranty Company Comparisons",
  description:
    "Head-to-head comparisons of the best RV extended warranty companies for 2026.",
  numberOfItems: comparisons.length,
  itemListElement: comparisons.map((comparison, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: comparison.title,
    url: `${SITE.url}/compare/${comparison.slug}`,
  })),
};

export default function CompareIndexPage() {
  const topReviews = getCompaniesSorted().slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <JsonLd data={itemListSchema} />
      <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
        Best RV Extended Warranty Companies Compared ({SITE.year})
      </h1>
      <p className="mt-3 max-w-3xl text-lg text-muted">
        Side-by-side comparisons of the most searched RV extended warranty
        providers. Start with our{" "}
        <Link href="/blog/best-rv-extended-warranty-reviews" className="font-semibold text-brand hover:underline">
          ranked reviews of all 9 companies
        </Link>
        , then drill into head-to-head matchups below.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {topReviews.map((company) => (
          <Link
            key={company.slug}
            href={`/reviews/${company.slug}`}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
          >
            {company.name} review
          </Link>
        ))}
      </div>

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

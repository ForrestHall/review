import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorByline } from "@/components/AuthorByline";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { QuizMatchCta } from "@/components/QuizMatchCta";
import { RelatedLinks } from "@/components/RelatedLinks";
import { comparisons, getComparison } from "@/data/comparisons";
import { getCompany } from "@/data/companies";
import { getAuthorOrDefault } from "@/data/authors";
import { FindCoverageLink, QuoteLink } from "@/components/AttributionLinks";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) return {};

  return buildMetadata({
    title: `${comparison.title} (${SITE.year})`,
    description: comparison.description,
    path: `/compare/${slug}`,
    ogType: "article",
  });
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) notFound();

  const companyA = getCompany(comparison.companyA);
  const companyB = getCompany(comparison.companyB);
  if (!companyA || !companyB) notFound();

  const author = getAuthorOrDefault(comparison.reviewedBy);
  const winner = comparison.winner ? getCompany(comparison.winner) : null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: comparison.title,
    description: comparison.description,
    datePublished: comparison.publishedAt,
    dateModified: comparison.updatedAt,
    author: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.role,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  };

  return (
    <>
      <JsonLd
        data={[
          schema,
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Compare", path: "/compare" },
            { name: comparison.title, path: `/compare/${comparison.slug}` },
          ]),
        ]}
      />

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Compare", href: "/compare" },
            { name: comparison.title },
          ]}
        />

        <header>
          <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {comparison.title} ({SITE.year})
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {comparison.description}
          </p>
          <AuthorByline
            authorSlug={comparison.reviewedBy}
            publishedAt={comparison.publishedAt}
            updatedAt={comparison.updatedAt}
          />
        </header>

        {winner && (
          <div className="rounded-xl border border-brand/20 bg-brand/5 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              Our Pick
            </p>
            <p className="mt-1 font-serif text-xl font-semibold text-foreground">
              {winner.name}
            </p>
            <p className="mt-2 text-sm text-muted">{comparison.verdict}</p>
            {winner.ctaUrl && (
              winner.slug === "americas-rv-warranty" ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  <FindCoverageLink className="inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90">
                    Get Matched
                  </FindCoverageLink>
                  <QuoteLink
                    quoteUrl={winner.ctaUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="inline-block rounded-lg border border-brand px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
                  >
                    Get Quote — {winner.name}
                  </QuoteLink>
                </div>
              ) : winner.ctaUrl.startsWith("/") ? (
                <Link
                  href={winner.ctaUrl}
                  className="mt-4 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
                >
                  {winner.ctaLabel ?? "Get a Quote"}
                </Link>
              ) : (
                <a
                  href={winner.ctaUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="mt-4 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
                >
                  {winner.ctaLabel ?? "Get a Quote"}
                </a>
              )
            )}
          </div>
        )}

        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Side-by-Side Comparison
          </h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Feature
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-brand">
                    <Link href={`/reviews/${companyA.slug}`}>{companyA.name}</Link>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-brand">
                    <Link href={`/reviews/${companyB.slug}`}>{companyB.name}</Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row) => (
                  <tr key={row.feature} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.feature}
                    </td>
                    <td className="px-4 py-3 text-muted">{row.a}</td>
                    <td className="px-4 py-3 text-muted">{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="prose-content mt-10">
          {comparison.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.content.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-xl border border-border bg-card p-6">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Final Verdict
          </h2>
          <p className="mt-3 leading-relaxed text-muted">{comparison.verdict}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <FindCoverageLink className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90">
              Get Matched
            </FindCoverageLink>
            {winner?.ctaUrl &&
              winner.slug === "americas-rv-warranty" && (
                <QuoteLink
                  quoteUrl={winner.ctaUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand hover:text-white"
                >
                  Get Quote — {winner.name}
                </QuoteLink>
              )}
            {winner?.ctaUrl &&
              winner.slug !== "americas-rv-warranty" &&
              (winner.ctaUrl.startsWith("/") ? (
                <Link
                  href={winner.ctaUrl}
                  className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
                >
                  {winner.ctaLabel ?? "Get a Quote"} — {winner.name}
                </Link>
              ) : (
                <a
                  href={winner.ctaUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
                >
                  {winner.ctaLabel ?? "Get a Quote"} — {winner.name}
                </a>
              ))}
            <Link
              href={`/reviews/${companyA.slug}`}
              className="rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-brand hover:text-white"
            >
              {companyA.name} Review
            </Link>
            <Link
              href={`/reviews/${companyB.slug}`}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-brand hover:text-brand"
            >
              {companyB.name} Review
            </Link>
          </div>
        </section>

        <QuizMatchCta variant="compare" />

        <RelatedLinks
          title="Helpful Guides"
          links={[
            { href: "/guides/how-much-do-rv-warranties-cost", title: "How Much Do RV Warranties Cost?" },
            { href: "/guides/how-to-shop-for-an-rv-warranty", title: "How to Shop for an RV Warranty" },
            { href: "/guides/how-to-cancel-an-rv-warranty", title: "How to Cancel an RV Warranty" },
            { href: "/guides/is-an-extended-rv-warranty-worth-it", title: "Is an Extended RV Warranty Worth It?" },
          ]}
        />

        <RelatedLinks
          title="More Comparisons"
          links={comparisons
            .filter((c) => c.slug !== comparison.slug)
            .slice(0, 4)
            .map((c) => ({
              href: `/compare/${c.slug}`,
              title: c.title,
            }))}
        />
      </article>
    </>
  );
}

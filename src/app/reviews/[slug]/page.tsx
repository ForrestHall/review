import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorByline } from "@/components/AuthorByline";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { Rating } from "@/components/Rating";
import { RelatedLinks } from "@/components/RelatedLinks";
import { getAuthorOrDefault } from "@/data/authors";
import { getComparisonsForCompany } from "@/data/comparisons";
import { companies, getCompaniesSorted, getCompany } from "@/data/companies";
import { UserReviewSection } from "@/components/UserReviews";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { getUserReviewStats, getUserReviews } from "@/lib/user-reviews";

type Props = {
  params: Promise<{ slug: string }>;
};

// Regenerate hourly so owner-review aggregate ratings stay current in schema.
export const revalidate = 3600;

export async function generateStaticParams() {
  return companies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) return {};

  return buildMetadata({
    title: `${company.name} Review ${SITE.year}`,
    description: `${company.name} review: rated ${company.rating}/10 from ${company.reviewCount.toLocaleString()} reviews. ${company.summary}`,
    path: `/reviews/${slug}`,
    ogType: "article",
  });
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) notFound();

  const author = getAuthorOrDefault(company.reviewedBy);
  const comparisons = getComparisonsForCompany(company.slug);
  const relatedReviews = getCompaniesSorted()
    .filter((c) => c.slug !== company.slug)
    .slice(0, 3);
  const userReviews = getUserReviews(company.slug);
  const userReviewStats = getUserReviewStats(company.slug);

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Organization",
      name: company.name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: company.rating,
      bestRating: 10,
      worstRating: 0,
    },
    author: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.role,
      url: `${SITE.url}/editorial-team#${author.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    reviewBody: company.summary,
    datePublished: company.publishedAt,
    dateModified: company.updatedAt,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Reviews",
        item: `${SITE.url}/#compare`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: company.name,
        item: `${SITE.url}/reviews/${company.slug}`,
      },
    ],
  };

  const schemas: Record<string, unknown>[] = [reviewSchema, breadcrumbSchema];

  if (userReviewStats.count > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${company.name} RV Extended Warranty`,
      description: company.summary,
      brand: { "@type": "Brand", name: company.name },
      url: `${SITE.url}/reviews/${company.slug}`,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: userReviewStats.average,
        reviewCount: userReviewStats.count,
        bestRating: 10,
        worstRating: 1,
      },
      review: userReviews.slice(0, 5).map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.authorName },
        datePublished: r.createdAt.slice(0, 10),
        reviewBody: r.body,
        ...(r.title ? { name: r.title } : {}),
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 10,
          worstRating: 1,
        },
      })),
    });
  }

  if (company.faqs?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: company.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }

  return (
    <>
      <JsonLd data={schemas} />

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Reviews", href: "/#compare" },
            { name: company.name },
          ]}
        />

        <header>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand px-3 py-1 text-sm font-bold text-white">
              #{company.rank}
            </span>
            {company.badge && (
              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-amber-800">
                {company.badge}
              </span>
            )}
          </div>

          <h1 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {company.name} Review {SITE.year}
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-muted">
            {company.summary}
          </p>

          <AuthorByline
            authorSlug={company.reviewedBy}
            publishedAt={company.publishedAt}
            updatedAt={company.updatedAt}
          />

          <div className="flex flex-wrap items-center gap-6 rounded-xl border border-border bg-card p-5">
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                Our Rating
              </p>
              <div className="mt-1">
                <Rating score={company.rating} size="lg" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                Reviews Analyzed
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {company.reviewCount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                Coverage Type
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {company.coverageType}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                Deductible
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {company.deductible}
              </p>
            </div>
          </div>
        </header>

        {/* At a glance table */}
        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            At a Glance
          </h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Coverage Type", company.coverageType],
                  ["Deductible", company.deductible],
                  ["Eligibility", company.eligibility],
                  ["Rating", `${company.rating}/10`],
                ].map(([label, value]) => (
                  <tr key={label} className="border-b border-border last:border-0">
                    <td className="bg-background px-4 py-3 font-semibold text-foreground">
                      {label}
                    </td>
                    <td className="px-4 py-3 text-muted">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pros & Cons */}
        <section className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Pros
            </h2>
            <ul className="mt-4 space-y-2">
              {company.pros.map((pro) => (
                <li key={pro} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-0.5 text-brand-light" aria-hidden>
                    ✓
                  </span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Cons
            </h2>
            <ul className="mt-4 space-y-2">
              {company.cons.map((con) => (
                <li key={con} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-0.5 text-red-400" aria-hidden>
                    ✗
                  </span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Reviews from Around the Web
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {company.testimonials.map((t) => (
              <blockquote
                key={t.quote}
                className="rounded-xl border border-border bg-background p-5"
              >
                <p className="text-sm italic text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <cite className="mt-2 block text-xs not-italic text-muted">
                  — {t.source}
                </cite>
              </blockquote>
            ))}
          </div>
        </section>

        <UserReviewSection
          companySlug={company.slug}
          companyName={company.name}
          initialReviews={userReviews}
          averageRating={userReviewStats.average}
        />

        {company.faqs && company.faqs.length > 0 && (
          <FAQ items={company.faqs} />
        )}

        {/* Verdict */}
        <section className="mt-10 rounded-xl border border-brand/20 bg-brand/5 p-6">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Final Verdict
          </h2>
          <p className="mt-3 leading-relaxed text-muted">{company.verdict}</p>
          {company.ctaUrl ? (
            <a
              href={company.ctaUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="mt-5 inline-block rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
            >
              {company.ctaLabel ?? "Get a Quote"}
            </a>
          ) : (
            company.phone && (
              <a
                href={`tel:${company.phone.replace(/\D/g, "")}`}
                className="mt-5 inline-block rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
              >
                {company.ctaLabel ?? "Get a Quote"} — {company.phone}
              </a>
            )
          )}
        </section>

        <RelatedLinks
          title="Compare With Other Providers"
          links={comparisons.slice(0, 3).map((c) => ({
            href: `/compare/${c.slug}`,
            title: c.title,
          }))}
        />

        <RelatedLinks
          title="Related Reviews"
          links={relatedReviews.map((c) => ({
            href: `/reviews/${c.slug}`,
            title: `${c.name} Review`,
            description: `Rated ${c.rating}/10`,
          }))}
        />

        <RelatedLinks
          title="Helpful Guides"
          links={[
            {
              href: "/guides/how-to-shop-for-an-rv-warranty",
              title: "How to Shop for an RV Warranty",
            },
            {
              href: "/guides/how-much-do-rv-warranties-cost",
              title: "How Much Do RV Warranties Cost?",
            },
          ]}
        />

        <div className="mt-10 border-t border-border pt-8">
          <Link
            href="/#compare"
            className="text-sm font-semibold text-brand hover:underline"
          >
            ← Back to all RV warranty comparisons
          </Link>
        </div>
      </article>
    </>
  );
}

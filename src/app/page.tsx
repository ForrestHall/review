import Link from "next/link";
import { CompanyCard } from "@/components/CompanyCard";
import { FAQ, homepageFaqs } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { getCompaniesSorted } from "@/data/companies";
import { comparisons } from "@/data/comparisons";
import { blogCategories, getRecentBlogPosts } from "@/data/blog";
import { guides, guideCategories } from "@/data/guides";
import { SITE } from "@/lib/site";

const companies = getCompaniesSorted();
const recentPosts = getRecentBlogPosts(3);

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `Best RV Extended Warranty Companies ${SITE.year}`,
  description:
    "Ranked list of the top RV extended warranty providers based on independent reviews.",
  numberOfItems: companies.length,
  itemListElement: companies.map((company) => ({
    "@type": "ListItem",
    position: company.rank,
    name: company.name,
    url: `${SITE.url}/reviews/${company.slug}`,
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homepageFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={[itemListSchema, faqSchema]} />

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-br from-brand to-teal-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-200">
            Updated for {SITE.year}
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Best RV Extended Warranty Companies
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-teal-100">
            Compare the top RV warranty providers based on independent ratings,
            customer reviews, and coverage details. Find the best extended
            warranty for your motorhome, travel trailer, or fifth wheel.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#compare"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-teal-50"
            >
              Compare Top Providers
            </a>
            <Link
              href="/guides/what-is-an-rv-extended-warranty"
              className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              RV Warranty 101
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            What Is an RV Extended Warranty?
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            An RV warranty, also called a service plan or service contract,
            helps cover repair costs when your vehicle&apos;s systems and
            appliances suffer mechanical failure. Warranty plans cover
            motorhomes, travel trailers, fifth wheel trailers, toy haulers, and
            other types of RVs. We&apos;ve researched the industry to bring you
            the best extended RV warranty providers.
          </p>
          <Link
            href="/guides/what-is-an-rv-extended-warranty"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            Learn more about warranties
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Quick nav */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            RV Warranty 101
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/guides/what-is-an-rv-extended-warranty",
                label: "About Warranties",
              },
              {
                href: "/guides/exclusionary-vs-named-component-coverage",
                label: "Coverage Details",
              },
              {
                href: "/guides/how-much-do-rv-warranties-cost",
                label: "Warranty Costs",
              },
              {
                href: "/guides/how-to-shop-for-an-rv-warranty",
                label: "How to Shop",
              },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison list */}
      <section id="compare" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-semibold text-foreground">
            Best RV Warranty Companies {SITE.year}
          </h2>
          <p className="mt-2 text-muted">
            Compare the top {companies.length} RV warranty providers based on
            user ratings and reviews.
          </p>
        </div>

        <div className="space-y-6">
          {companies.map((company) => (
            <CompanyCard
              key={company.slug}
              company={company}
              featured={company.rank === 1}
            />
          ))}
        </div>
      </section>

      {/* Head-to-head comparisons */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Head-to-Head Comparisons
          </h2>
          <p className="mt-2 text-muted">
            Side-by-side feature tables and editorial verdicts for the most
            searched warranty matchups.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((comparison) => (
              <Link
                key={comparison.slug}
                href={`/compare/${comparison.slug}`}
                className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-brand">
                  {comparison.title}
                </h3>
                <p className="mt-2 text-sm text-muted line-clamp-2">
                  {comparison.description}
                </p>
              </Link>
            ))}
          </div>
          <Link
            href="/compare"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            View all comparisons
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Latest blog posts */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Latest from the Blog
          </h2>
          <p className="mt-2 text-muted">
            Timely tips on buying, claims, and getting the best RV warranty
            coverage.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border border-border p-5 transition-shadow hover:shadow-md"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-brand">
                  {blogCategories[post.category]}
                </span>
                <h3 className="mt-2 font-serif text-lg font-semibold text-foreground group-hover:text-brand">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-3">
                  {post.description}
                </p>
                <p className="mt-3 text-xs text-muted">
                  {post.readTime} min read
                </p>
              </Link>
            ))}
          </div>
          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            Read all blog posts
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Educational content */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            RV Warranty Guides
          </h2>
          <p className="mt-2 text-muted">
            Expert articles to help you understand coverage and make the right
            choice.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.slice(0, 6).map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group rounded-xl border border-border p-5 transition-shadow hover:shadow-md"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-brand">
                  {guideCategories[guide.category]}
                </span>
                <h3 className="mt-2 font-serif text-lg font-semibold text-foreground group-hover:text-brand">
                  {guide.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {guide.description}
                </p>
                <p className="mt-3 text-xs text-muted">
                  {guide.readTime} min read
                </p>
              </Link>
            ))}
          </div>
          <Link
            href="/guides"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            View all guides
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Methodology teaser */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-xl border border-border bg-background p-8">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            How We Choose the Best Companies
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Transparency",
                desc: "Clear plan details, pricing, and exclusions.",
              },
              {
                title: "Claims Processing",
                desc: "Simple claims with reasonable service fees.",
              },
              {
                title: "Coverage Options",
                desc: "Flexible plans for different RV types and budgets.",
              },
              {
                title: "Customer Service",
                desc: "Strong communication and real customer reviews.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/how-we-review"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            Read our full methodology
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <FAQ items={homepageFaqs} />
      </section>
    </>
  );
}

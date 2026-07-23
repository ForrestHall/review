import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorByline } from "@/components/AuthorByline";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { getAuthorOrDefault } from "@/data/authors";
import {
  getGuide,
  guides,
  guideCategories,
} from "@/data/guides";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return buildMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${slug}`,
    ogType: "article",
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const author = getAuthorOrDefault(guide.reviewedBy);
  const relatedGuides = guides
    .filter((g) => g.slug !== guide.slug && g.category === guide.category)
    .slice(0, 3);

  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      datePublished: guide.publishedAt,
      dateModified: guide.updatedAt,
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
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: guide.title, path: `/guides/${guide.slug}` },
    ]),
  ];

  if (guide.faqs?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return (
    <>
      <JsonLd data={schemas} />

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Guides", href: "/guides" },
            { name: guide.title },
          ]}
        />

        <header>
          <span className="text-xs font-semibold uppercase tracking-wide text-brand">
            {guideCategories[guide.category]}
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {guide.description}
          </p>
          <AuthorByline
            authorSlug={guide.reviewedBy}
            publishedAt={guide.publishedAt}
            updatedAt={guide.updatedAt}
            reviewedLabel="Written by"
          />
          <p className="mt-2 text-sm text-muted">{guide.readTime} min read</p>
        </header>

        <div className="prose-content mt-10">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.content.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        {guide.faqs && guide.faqs.length > 0 && <FAQ items={guide.faqs} />}

        {guide.relatedLinks && guide.relatedLinks.length > 0 && (
          <RelatedLinks title="Related on RV Warranty Review" links={guide.relatedLinks} />
        )}

        <RelatedLinks
          title="Related Guides"
          links={relatedGuides.map((g) => ({
            href: `/guides/${g.slug}`,
            title: g.title,
            description: `${g.readTime} min read`,
          }))}
        />

        <div className="mt-12 rounded-xl border border-border bg-background p-6">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Ready to Compare Providers?
          </h2>
          <p className="mt-2 text-sm text-muted">
            See our ranked list of the best RV extended warranty companies.
          </p>
          <Link
            href="/#compare"
            className="mt-4 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90"
          >
            Compare RV Warranties
          </Link>
        </div>
      </article>
    </>
  );
}

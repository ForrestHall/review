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
  blogCategories,
  blogPosts,
  getBlogPost,
  getBlogPostsSorted,
} from "@/data/blog";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    ogType: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const author = getAuthorOrDefault(post.reviewedBy);
  const relatedPosts = getBlogPostsSorted()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
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
      mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
    },
  ];

  schemas.push(
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ])
  );

  if (post.faqs?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((faq) => ({
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
            { name: "Blog", href: "/blog" },
            { name: post.title },
          ]}
        />

        <header>
          <span className="text-xs font-semibold uppercase tracking-wide text-brand">
            {blogCategories[post.category]}
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {post.description}
          </p>
          <AuthorByline
            authorSlug={post.reviewedBy}
            publishedAt={post.publishedAt}
            updatedAt={post.updatedAt}
            reviewedLabel="Written by"
          />
          <p className="mt-2 text-sm text-muted">{post.readTime} min read</p>
        </header>

        <div className="prose-content mt-10">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.content.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        {post.faqs && post.faqs.length > 0 && <FAQ items={post.faqs} />}

        {post.relatedLinks && post.relatedLinks.length > 0 && (
          <RelatedLinks title="Related on RV Warranty Review" links={post.relatedLinks} />
        )}

        <RelatedLinks
          title="More from the Blog"
          links={relatedPosts.map((p) => ({
            href: `/blog/${p.slug}`,
            title: p.title,
            description: `${p.readTime} min read`,
          }))}
        />

        <div className="mt-12 rounded-xl border border-border bg-background p-6">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Compare RV Warranty Providers
          </h2>
          <p className="mt-2 text-sm text-muted">
            Ready to shop? See our ranked list of the best extended warranty
            companies.
          </p>
          <Link
            href="/#compare"
            className="mt-4 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90"
          >
            View Rankings
          </Link>
        </div>
      </article>
    </>
  );
}

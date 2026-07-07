import type { Metadata } from "next";
import Link from "next/link";
import { blogCategories, getBlogPostsSorted } from "@/data/blog";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "RV Warranty Blog — Tips, Claims Advice & Buying Guides",
  description:
    "Expert articles on RV extended warranties — seasonal buying tips, claim denial help, full-time RV coverage, and provider alternatives.",
  path: "/blog",
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getBlogPostsSorted();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            RV Warranty Blog
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Timely tips, claims advice, and buying strategies from our editorial
            team. Updated regularly for {SITE.year}.
          </p>
        </div>
        <Link
          href="/blog/rss.xml"
          className="text-sm font-semibold text-brand hover:underline"
        >
          RSS Feed
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-brand">
              {blogCategories[post.category]}
            </span>
            <h2 className="mt-2 font-serif text-lg font-semibold text-foreground group-hover:text-brand">
              {post.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {post.description}
            </p>
            <p className="mt-4 text-xs text-muted">
              {formatDate(post.publishedAt)} · {post.readTime} min read
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

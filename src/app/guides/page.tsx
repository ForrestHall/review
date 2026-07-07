import type { Metadata } from "next";
import Link from "next/link";
import { guides, guideCategories } from "@/data/guides";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "RV Extended Warranty Guides & Resources",
  description:
    "Expert guides on RV extended warranties — coverage types, shopping tips, costs, and whether coverage is worth it.",
  path: "/guides",
});

export default function GuidesPage() {
  const grouped = Object.entries(guideCategories).map(([key, label]) => ({
    key: key as keyof typeof guideCategories,
    label,
    guides: guides.filter((g) => g.category === key),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
        RV Warranty Guides
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Everything you need to know about RV extended warranties — from
        coverage basics to shopping strategies and cost breakdowns.
      </p>

      <div className="mt-12 space-y-12">
        {grouped.map((group) => (
          <section key={group.key}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">
              {group.label}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {group.guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
                >
                  <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-brand">
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
          </section>
        ))}
      </div>
    </div>
  );
}

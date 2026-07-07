import Link from "next/link";
import type { CompanyReview } from "@/types";
import { Rating } from "./Rating";

type CompanyCardProps = {
  company: CompanyReview;
  featured?: boolean;
};

export function CompanyCard({ company, featured = false }: CompanyCardProps) {
  return (
    <article
      id={company.slug}
      className={`scroll-mt-24 rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md ${
        featured ? "border-brand ring-1 ring-brand/20" : "border-border"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
            {company.rank}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                <Link
                  href={`/reviews/${company.slug}`}
                  className="hover:text-brand"
                >
                  {company.name}
                </Link>
              </h2>
              {company.badge && (
                <span className="rounded-full bg-accent/15 px-3 py-0.5 text-xs font-semibold text-amber-800">
                  {company.badge}
                </span>
              )}
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {company.summary}
            </p>
          </div>
        </div>

        <div className="text-right">
          <Rating score={company.rating} />
          <p className="mt-1 text-xs text-muted">
            {company.reviewCount.toLocaleString()} reviews
          </p>
        </div>
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {company.highlights.slice(0, 4).map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-light"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {item}
          </li>
        ))}
      </ul>

      {company.testimonials.length > 0 && (
        <div className="mt-4 rounded-lg bg-background p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Customer Reviews
          </p>
          <blockquote className="mt-2 text-sm italic text-foreground">
            &ldquo;{company.testimonials[0].quote}&rdquo;
          </blockquote>
          <cite className="mt-1 block text-xs not-italic text-muted">
            — {company.testimonials[0].source}
          </cite>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/reviews/${company.slug}`}
          className="rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
        >
          Read Full Review
        </Link>
        {company.phone && (
          <a
            href={`tel:${company.phone.replace(/\D/g, "")}`}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
          >
            {company.ctaLabel ?? "Get Quote"}
          </a>
        )}
      </div>
    </article>
  );
}

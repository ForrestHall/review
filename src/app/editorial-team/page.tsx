import type { Metadata } from "next";
import Link from "next/link";
import { authors } from "@/data/authors";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Editorial Team",
  description: `Meet the RV warranty researchers and editors behind ${SITE.name}. Credentials, expertise, and editorial standards.`,
  path: "/editorial-team",
});

export default function EditorialTeamPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
        Editorial Team
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Every review and guide on {SITE.name} is researched, written, and
        fact-checked by specialists with RV industry and consumer finance
        experience. We use secret shoppers, contract analysis, and verified
        customer feedback — not manufacturer marketing.
      </p>

      <div className="mt-12 space-y-10">
        {authors.map((author) => (
          <article
            key={author.slug}
            id={author.slug}
            className="scroll-mt-24 rounded-xl border border-border bg-card p-6 sm:p-8"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                {author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div>
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  {author.name}
                </h2>
                <p className="text-sm font-medium text-brand">{author.role}</p>
              </div>
            </div>

            <p className="mt-4 leading-relaxed text-muted">{author.bio}</p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                  Credentials
                </h3>
                <ul className="mt-2 space-y-1">
                  {author.credentials.map((item) => (
                    <li key={item} className="text-sm text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                  Areas of Expertise
                </h3>
                <ul className="mt-2 space-y-1">
                  {author.expertise.map((item) => (
                    <li key={item} className="text-sm text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border bg-background p-6">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          Editorial Standards
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Our team follows a documented review methodology covering
          transparency, claims processing, coverage options, and customer
          service. Ratings are never influenced by affiliate partnerships.
        </p>
        <Link
          href="/how-we-review"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
        >
          Read how we review
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}

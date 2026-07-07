import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About RV Warranty Review",
  description: `Learn about ${SITE.name} — independent RV extended warranty reviews and comparisons to help you find the right coverage.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-foreground">
        About {SITE.name}
      </h1>
      <div className="prose-content mt-8">
        <p>
          {SITE.name} is an independent review site dedicated to helping RV
          owners navigate the complex world of extended warranty coverage. We
          research, compare, and rate RV warranty providers so you can make
          confident decisions about protecting your investment.
        </p>
        <h2>Our Mission</h2>
        <p>
          RV repairs are expensive and warranty contracts are confusing. Our
          goal is to cut through the marketing and provide honest, research-backed
          comparisons of the top extended warranty companies serving motorhome
          and towable RV owners.
        </p>
        <h2>Our Team</h2>
        <p>
          Reviews and guides are written by specialists with RV service and
          consumer finance backgrounds. Every provider is evaluated through
          secret-shopper calls, contract analysis, and verified customer
          feedback.
        </p>
        <Link
          href="/editorial-team"
          className="text-brand hover:underline"
        >
          Meet the editorial team →
        </Link>
        <h2>Contact</h2>
        <p>
          Questions or corrections? Reach us at{" "}
          <a href={`mailto:${SITE.email}`} className="text-brand hover:underline">
            {SITE.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}

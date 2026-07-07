import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Affiliate Disclosure",
  description: `Affiliate disclosure for ${SITE.name}.`,
  path: "/disclosure",
});

export default function DisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-foreground">
        Affiliate Disclosure
      </h1>
      <div className="prose-content mt-8">
        <p>
          {SITE.name} is supported by advertising and affiliate partnerships.
          When you click links on our site and purchase a product or service, we
          may earn a commission at no additional cost to you.
        </p>
        <h2>Editorial Independence</h2>
        <p>
          Affiliate relationships do not influence our ratings, rankings, or
          review content. Our editorial team evaluates providers based on our
          published methodology, not compensation arrangements.
        </p>
        <h2>FTC Compliance</h2>
        <p>
          In accordance with FTC guidelines, we disclose that some links on this
          site are affiliate links. We only recommend products and services we
          believe provide value to RV owners.
        </p>
      </div>
    </div>
  );
}

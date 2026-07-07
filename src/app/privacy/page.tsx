import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE.name}.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-foreground">
        Privacy Policy
      </h1>
      <div className="prose-content mt-8">
        <p>Last updated: March 1, {SITE.year}</p>
        <p>
          {SITE.name} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
          operates {SITE.domain}. This page informs you of our policies regarding
          the collection, use, and disclosure of personal information when you
          use our website.
        </p>
        <h2>Information We Collect</h2>
        <p>
          We may collect anonymous usage data through analytics tools, including
          pages visited, time on site, and referring URLs. If you contact us via
          email, we collect the information you provide.
        </p>
        <h2>Cookies</h2>
        <p>
          We use cookies and similar tracking technologies to analyze site traffic
          and improve user experience. You can instruct your browser to refuse
          cookies, though some site features may not function properly.
        </p>
        <h2>Third-Party Links</h2>
        <p>
          Our site contains links to third-party warranty providers. We are not
          responsible for the privacy practices of those sites.
        </p>
        <h2>Contact</h2>
        <p>
          For privacy-related questions, contact us at{" "}
          <a href={`mailto:${SITE.email}`} className="text-brand hover:underline">
            {SITE.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}

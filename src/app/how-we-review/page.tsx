import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "How We Review RV Warranty Companies",
  description:
    "Our editorial methodology for rating RV extended warranty providers — transparency, claims processing, coverage, and customer service.",
  path: "/how-we-review",
});

export default function HowWeReviewPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-foreground">
        How We Review RV Warranty Companies
      </h1>
      <p className="mt-4 text-lg text-muted">
        {SITE.name} provides independent research to help RV owners make
        informed decisions about extended warranty coverage.
      </p>

      <div className="prose-content mt-10">
        <h2>Transparency</h2>
        <p>
          RV warranties are complex products. We prioritize companies that
          honestly disclose plan details, pricing, limits, and exclusions. We
          favor providers that offer sample contracts and clear coverage
          information online.
        </p>

        <h2>Secret Shopping</h2>
        <p>
          Ratings on a website only tell part of the story. To see how companies
          actually treat prospective customers, we use secret shoppers who
          contact providers as if they were real RV owners shopping for coverage
          on a used motorhome or travel trailer.
        </p>
        <p>
          Each shopper requests quotes by phone and email, asks detailed
          questions about coverage levels, deductibles, exclusions, and the
          claims process, and presses sales reps on how their plans compare to
          competitors. We note whether reps explain different plan options or
          push a single high-commission product, how clearly they describe
          limits and exclusions, and whether they volunteer sample contracts
          without being asked.
        </p>
        <p>
          We also test follow-up communication, quote accuracy, and whether
          what salespeople promise aligns with the policy language in the
          contract. Companies that are evasive, misleading, or unwilling to
          answer direct questions score lower — regardless of what their
          marketing materials claim.
        </p>

        <h2>Claims Processing</h2>
        <p>
          How a warranty works when you need it matters most. We evaluate the
          claims process from start to finish — pre-authorization requirements,
          service fees, mobile mechanic support, and direct-pay to repair
          facilities. Companies with in-house claims departments and strong
          administrator relationships score higher.
        </p>

        <h2>Coverage Options</h2>
        <p>
          Flexible coverage levels, deductible choices, and payment options are
          essential. We recommend companies that offer a range of choices rather
          than pushing a single plan. Be wary of salespeople who won&apos;t
          explain different coverage options.
        </p>

        <h2>Customer Service</h2>
        <p>
          We read reviews from BBB, Google, Facebook, Reddit, and RV community
          forums. We also consider communication quality, 24/7 support
          availability, and how companies handle mistakes.
        </p>

        <h2>Insurance Backing</h2>
        <p>
          We look for companies backed by insurance companies with at least a B
          rating. This guarantees that even if the selling company goes under,
          your policy will still be serviced by the administrator.
        </p>
      </div>

      <Link
        href="/guides/how-we-choose-the-best-companies"
        className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
      >
        Read the full methodology guide
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

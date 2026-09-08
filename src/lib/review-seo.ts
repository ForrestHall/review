import type { CompanyReview } from "@/types";
import { SITE } from "./site";

type ReviewSeo = { title: string; description: string };

const REVIEW_SEO: Partial<Record<string, ReviewSeo>> = {
  "good-sam-esp": {
    title: `Good Sam ESP Review (${SITE.year}): Claims, Denials & Alternatives`,
    description:
      "Independent Good Sam ESP review for 2026: insurance-backed coverage, travel reimbursement, club membership, and the claim denial patterns owners report most often.",
  },
  "americas-rv-warranty": {
    title: `America's RV Warranty Review (${SITE.year}): Rating, Claims & Cost`,
    description:
      "America's RV Warranty review for 2026: 9.0/10 rating, in-house claims, mobile mechanic support, and how pricing compares to Good Sam and Wholesale Warranties.",
  },
  "warranty-direct-protect": {
    title: `Warranty Direct Protect Review (${SITE.year}): Pros, Cons & Pricing`,
    description:
      "Warranty Direct Protect review (formerly Eagle Vision) for 2026: coverage tiers, premium pricing, claim experiences, and how it stacks up against top RV warranty companies.",
  },
  "easycare-rv": {
    title: `EasyCare RV Warranty Review (${SITE.year}): Dealer Plans & Exclusions`,
    description:
      "EasyCare RV warranty review for 2026: what dealer F&I plans cover, common exclusions in owner feedback, and why to compare direct quotes before signing.",
  },
};

export function getReviewSeo(company: CompanyReview): ReviewSeo {
  const custom = REVIEW_SEO[company.slug];
  if (custom) return custom;

  return {
    title: `${company.name} Review ${SITE.year}`,
    description: `${company.name} review: rated ${company.rating}/10 from ${company.reviewCount.toLocaleString()} reviews. ${company.summary}`,
  };
}

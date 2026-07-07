function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }

  return "https://rvwarrantyreview.com";
}

function resolveDomain(url: string) {
  if (process.env.NEXT_PUBLIC_SITE_DOMAIN) {
    return process.env.NEXT_PUBLIC_SITE_DOMAIN;
  }

  try {
    return new URL(url).hostname;
  } catch {
    return "rvwarrantyreview.com";
  }
}

const siteUrl = resolveSiteUrl();

export const SITE = {
  name: "RV Warranty Review",
  domain: resolveDomain(siteUrl),
  url: siteUrl,
  tagline: "Independent RV Extended Warranty Reviews & Comparisons",
  description:
    "Compare the best RV extended warranty companies with independent reviews, ratings, and expert buying guides. Find coverage for motorhomes, travel trailers, and fifth wheels.",
  email: "hello@rvwarrantyreview.com",
  year: 2026,
} as const;

export type CompanyReview = {
  slug: string;
  name: string;
  rank: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  summary: string;
  pros: string[];
  cons: string[];
  highlights: string[];
  testimonials: { quote: string; source: string }[];
  verdict: string;
  coverageType: string;
  deductible: string;
  eligibility: string;
  website?: string;
  phone?: string;
  ctaLabel?: string;
  publishedAt: string;
  updatedAt: string;
  reviewedBy: string;
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  category: "basics" | "shopping" | "coverage" | "cost";
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  reviewedBy: string;
  sections: { heading: string; content: string[] }[];
};

export type Comparison = {
  slug: string;
  title: string;
  description: string;
  companyA: string;
  companyB: string;
  winner?: string;
  verdict: string;
  publishedAt: string;
  updatedAt: string;
  reviewedBy: string;
  rows: { feature: string; a: string; b: string }[];
  sections: { heading: string; content: string[] }[];
};

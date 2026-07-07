import type { MetadataRoute } from "next";
import { companies } from "@/data/companies";
import { comparisons } from "@/data/comparisons";
import { guides } from "@/data/guides";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: "", priority: 1, lastModified: "2026-03-01" },
    { path: "/compare", priority: 0.9, lastModified: "2026-03-01" },
    { path: "/guides", priority: 0.8, lastModified: "2026-03-01" },
    { path: "/how-we-review", priority: 0.8, lastModified: "2026-03-01" },
    { path: "/editorial-team", priority: 0.7, lastModified: "2026-03-01" },
    { path: "/about", priority: 0.7, lastModified: "2026-03-01" },
    { path: "/privacy", priority: 0.3, lastModified: "2026-03-01" },
    { path: "/disclosure", priority: 0.3, lastModified: "2026-03-01" },
  ].map(({ path, priority, lastModified }) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(lastModified),
    changeFrequency: "weekly" as const,
    priority,
  }));

  const reviewPages = companies.map((c) => ({
    url: `${SITE.url}/reviews/${c.slug}`,
    lastModified: new Date(c.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const comparePages = comparisons.map((c) => ({
    url: `${SITE.url}/compare/${c.slug}`,
    lastModified: new Date(c.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const guidePages = guides.map((g) => ({
    url: `${SITE.url}/guides/${g.slug}`,
    lastModified: new Date(g.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...reviewPages, ...comparePages, ...guidePages];
}

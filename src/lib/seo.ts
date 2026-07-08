import type { Metadata } from "next";
import { SITE } from "./site";

type PageMeta = {
  title: string;
  description: string;
  path?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = "",
  ogType = "website",
  noIndex = false,
}: PageMeta): Metadata {
  const url = `${SITE.url}${path}`;
  const fullTitle =
    path === "" || path === "/"
      ? `${title} | ${SITE.name}`
      : `${title} | ${SITE.name}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      type: ogType,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function jsonLdScript(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(Array.isArray(data) ? data : data),
  };
}

export function breadcrumbSchema(
  items: { name: string; path?: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: `${SITE.url}${item.path}` } : {}),
    })),
  };
}

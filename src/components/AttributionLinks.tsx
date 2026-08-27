"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { buildFindCoverageHref, buildQuoteHref } from "@/lib/attribution";
import { useAttribution } from "@/hooks/useAttribution";

type FindCoverageLinkProps = Omit<ComponentProps<typeof Link>, "href">;

export function FindCoverageLink({ ...props }: FindCoverageLinkProps) {
  const attribution = useAttribution();
  return <Link href={buildFindCoverageHref(attribution)} {...props} />;
}

type QuoteLinkProps = Omit<ComponentProps<"a">, "href"> & {
  quoteUrl: string;
};

export function QuoteLink({ quoteUrl, ...props }: QuoteLinkProps) {
  const attribution = useAttribution();
  return <a href={buildQuoteHref(quoteUrl, attribution)} {...props} />;
}

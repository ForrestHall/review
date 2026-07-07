import { getComparison } from "@/data/comparisons";
import { getCompany } from "@/data/companies";
import { createOgImage } from "@/lib/og-image";

export const alt = "RV Warranty Comparison";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) {
    return createOgImage("RV Warranty Comparison");
  }

  const a = getCompany(comparison.companyA);
  const b = getCompany(comparison.companyB);

  return createOgImage(
    comparison.title,
    a && b ? `${a.name} vs ${b.name}` : "Side-by-side comparison"
  );
}

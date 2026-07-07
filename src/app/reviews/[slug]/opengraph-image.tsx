import { getCompany } from "@/data/companies";
import { createOgImage } from "@/lib/og-image";

export const alt = "RV Warranty Review";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  const company = getCompany(slug);
  if (!company) {
    return createOgImage("RV Warranty Review");
  }

  return createOgImage(
    `${company.name} Review`,
    `Rated ${company.rating}/10 · Independent analysis`
  );
}

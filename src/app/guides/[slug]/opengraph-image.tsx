import { getGuide } from "@/data/guides";
import { createOgImage } from "@/lib/og-image";

export const alt = "RV Warranty Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) {
    return createOgImage("RV Warranty Guide");
  }

  return createOgImage(guide.title, guide.description.slice(0, 100));
}

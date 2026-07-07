import { createOgImage } from "@/lib/og-image";
import { SITE } from "@/lib/site";

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return createOgImage(
    "Best RV Extended Warranty Reviews",
    "Independent ratings, comparisons & buying guides"
  );
}

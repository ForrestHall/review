import { getBlogPost } from "@/data/blog";
import { createOgImage } from "@/lib/og-image";

export const alt = "RV Warranty Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return createOgImage("RV Warranty Blog");
  }

  return createOgImage(post.title, post.description.slice(0, 100));
}

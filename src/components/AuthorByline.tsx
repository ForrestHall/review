import Link from "next/link";
import { getAuthorOrDefault } from "@/data/authors";

type AuthorBylineProps = {
  authorSlug?: string;
  publishedAt: string;
  updatedAt: string;
  reviewedLabel?: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function AuthorByline({
  authorSlug,
  publishedAt,
  updatedAt,
  reviewedLabel = "Reviewed by",
}: AuthorBylineProps) {
  const author = getAuthorOrDefault(authorSlug);
  const showUpdated = updatedAt !== publishedAt;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-6 text-sm text-muted">
      <div className="flex items-center gap-2">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-bold text-white"
          aria-hidden
        >
          {author.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
        <div>
          <p>
            {reviewedLabel}{" "}
            <Link
              href={`/editorial-team#${author.slug}`}
              className="font-semibold text-brand hover:underline"
            >
              {author.name}
            </Link>
          </p>
          <p className="text-xs">{author.role}</p>
        </div>
      </div>
      <div className="text-xs">
        <p>Published {formatDate(publishedAt)}</p>
        {showUpdated && (
          <p className="font-medium text-foreground">
            Last updated {formatDate(updatedAt)}
          </p>
        )}
      </div>
    </div>
  );
}

export function UpdatedDate({ date }: { date: string }) {
  return (
    <p className="text-sm text-muted">
      Last updated{" "}
      <time dateTime={date}>
        {new Date(date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </time>
    </p>
  );
}

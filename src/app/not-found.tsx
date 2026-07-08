import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">
        404
      </p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl">
        Page Not Found
      </h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Here are some helpful places to start instead.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/#compare"
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
        >
          Best RV Warranties
        </Link>
        <Link
          href="/compare"
          className="rounded-lg border border-brand px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
        >
          Compare Providers
        </Link>
        <Link
          href="/guides"
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
        >
          Guides
        </Link>
        <Link
          href="/blog"
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
        >
          Blog
        </Link>
      </div>
    </div>
  );
}

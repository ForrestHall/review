import Link from "next/link";

type RelatedLink = {
  href: string;
  title: string;
  description?: string;
};

type RelatedLinksProps = {
  title: string;
  links: RelatedLink[];
};

export function RelatedLinks({ title, links }: RelatedLinksProps) {
  if (links.length === 0) return null;

  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="font-serif text-xl font-semibold text-foreground">
        {title}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-lg border border-border p-4 transition-colors hover:border-brand"
          >
            <p className="font-semibold text-foreground group-hover:text-brand">
              {link.title}
            </p>
            {link.description && (
              <p className="mt-1 text-sm text-muted">{link.description}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

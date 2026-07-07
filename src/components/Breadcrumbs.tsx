import Link from "next/link";

type BreadcrumbItem = {
  name: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-1">
            {i > 0 && (
              <span aria-hidden className="text-border">
                /
              </span>
            )}
            {item.href ? (
              <Link href={item.href} className="hover:text-brand">
                {item.name}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

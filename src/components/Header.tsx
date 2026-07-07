import Link from "next/link";
import { SITE } from "@/lib/site";

const navLinks = [
  { href: "/", label: "Best Warranties" },
  { href: "/compare", label: "Compare" },
  { href: "/guides", label: "Guides" },
  { href: "/how-we-review", label: "How We Review" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
            RV
          </span>
          <div className="leading-tight">
            <span className="block text-sm font-bold text-foreground group-hover:text-brand">
              {SITE.name}
            </span>
            <span className="hidden text-xs text-muted sm:block">
              Independent Reviews
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#compare"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
        >
          Compare Plans
        </Link>
      </div>
    </header>
  );
}

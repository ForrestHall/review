import Link from "next/link";
import { getCompaniesSorted } from "@/data/companies";
import { comparisons } from "@/data/comparisons";
import { SITE } from "@/lib/site";

const topCompanies = getCompaniesSorted().slice(0, 6);

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-foreground text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-lg font-bold text-white">{SITE.name}</p>
            <p className="mt-2 text-sm leading-relaxed">
              Independent reviews and comparisons to help RV owners find the
              right extended warranty coverage.
            </p>
            <Link
              href="/editorial-team"
              className="mt-3 inline-block text-sm text-teal-300 hover:text-white"
            >
              Meet our editorial team →
            </Link>
          </div>

          <div>
            <p className="font-semibold text-white">Reviews</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Best RV Warranties
                </Link>
              </li>
              {topCompanies.map((c) => (
                <li key={c.slug}>
                  <Link href={`/reviews/${c.slug}`} className="hover:text-white">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white">Compare</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/compare" className="hover:text-white">
                  All Comparisons
                </Link>
              </li>
              {comparisons.slice(0, 4).map((c) => (
                <li key={c.slug}>
                  <Link href={`/compare/${c.slug}`} className="hover:text-white">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white">Company</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/editorial-team" className="hover:text-white">
                  Editorial Team
                </Link>
              </li>
              <li>
                <Link href="/how-we-review" className="hover:text-white">
                  How We Review
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-white">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclosure" className="hover:text-white">
                  Affiliate Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-700 pt-8 text-sm">
          <p>
            © {SITE.year} {SITE.name}. All rights reserved.
          </p>
          <p className="mt-2 leading-relaxed text-slate-400">
            {SITE.name} provides independent research and reviews. We may earn
            commissions when you click links on this site. This does not affect
            our ratings or recommendations. Information is for educational
            purposes and should not be considered financial or legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

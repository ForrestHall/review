"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SITE } from "@/lib/site";

function isLeadLanding(pathname: string) {
  return pathname === "/find-coverage" || pathname.startsWith("/find-coverage/");
}

function AdsHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">
            RV
          </span>
          <span className="text-sm font-bold text-foreground">{SITE.name}</span>
        </div>
        <span className="text-xs font-medium text-muted">Secure · ~60 sec</span>
      </div>
    </header>
  );
}

function AdsFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-background py-6">
      <div className="mx-auto max-w-lg px-4 text-center text-xs text-muted sm:px-6">
        <p>
          Independent reviews. We may earn a commission when you get a quote.{" "}
          <Link href="/disclosure" className="underline hover:text-foreground">
            Disclosure
          </Link>
          {" · "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy
          </Link>
        </p>
      </div>
    </footer>
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ads = isLeadLanding(pathname);

  return (
    <>
      {ads ? <AdsHeader /> : <Header />}
      <main className="flex-1">{children}</main>
      {ads ? <AdsFooter /> : <Footer />}
    </>
  );
}

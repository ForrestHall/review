#!/usr/bin/env node
/**
 * Smoke-check GA4 wiring on the live (or staging) site.
 *
 *   npm run verify:ga4
 *   SITE_URL=https://www.rvwarrantyreview.com npm run verify:ga4
 *
 * Manual Realtime check (required once):
 *   1. GA4 → Reports → Realtime
 *   2. Open /find-coverage?utm_source=verify_test
 *   3. Step through the quiz — confirm `quiz_step` events
 *   4. Submit a test lead (needs ARW_API_TOKEN in prod) — confirm `generate_lead`
 */

const SITE_URL = (process.env.SITE_URL ?? "https://www.rvwarrantyreview.com").replace(
  /\/$/,
  ""
);
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-RMSCHQPTV5";

const paths = ["/", "/find-coverage"];

let failed = false;

for (const path of paths) {
  const url = `${SITE_URL}${path}`;
  const response = await fetch(url);
  const html = await response.text();

  if (!response.ok) {
    console.error(`FAIL ${url} HTTP ${response.status}`);
    failed = true;
    continue;
  }

  const hasGtagLoader = html.includes("googletagmanager.com/gtag/js");
  const hasGaConfig = html.includes(`gtag('config', '${GA_ID}'`) || html.includes(GA_ID);

  if (!hasGtagLoader || !hasGaConfig) {
    console.error(`FAIL ${url} — GA4 tag missing (expected ${GA_ID})`);
    failed = true;
  } else {
    console.log(`OK   ${url} — GA4 ${GA_ID} present`);
  }
}

console.log("");
console.log("Event names emitted by the quiz (see src/lib/analytics.ts):");
console.log("  • quiz_step      — each funnel step (param: quiz_step)");
console.log("  • generate_lead  — successful /api/arw-lead only (UTM + gclid params)");
console.log("");
console.log("Register these as GA4 custom dimensions (Event scope) for Looker Studio:");
console.log("  quiz_step, utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, fbclid");
console.log("");
console.log("Looker Studio setup: docs/analytics-looker.md");

process.exit(failed ? 1 : 0);

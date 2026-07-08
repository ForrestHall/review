// Submits all sitemap URLs to IndexNow (Bing, and by extension Microsoft
// Copilot). Run after deploying new or updated content:
//
//   npm run indexnow
//
// Optionally pass specific URLs: node scripts/indexnow.mjs https://... https://...

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rvwarrantyreview.com";
const KEY = "19c63a31adacd1da1a1c5f7184958122";

async function getSitemapUrls() {
  const response = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap: ${response.status}`);
  }
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const args = process.argv.slice(2);
  const urlList = args.length > 0 ? args : await getSitemapUrls();

  if (urlList.length === 0) {
    console.error("No URLs found to submit.");
    process.exit(1);
  }

  const host = new URL(SITE_URL).hostname;
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: KEY,
      keyLocation: `${SITE_URL}/${KEY}.txt`,
      urlList,
    }),
  });

  console.log(`Submitted ${urlList.length} URLs to IndexNow.`);
  console.log(`Status: ${response.status} ${response.statusText}`);
  if (!response.ok) {
    console.error(await response.text());
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

# RV Warranty Review

SEO-optimized RV extended warranty review site for [rvwarrantyreview.com](https://rvwarrantyreview.com).

Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Comparison hub** — Ranked list of top RV warranty providers with ratings and reviews
- **Individual review pages** — Detailed company reviews with pros, cons, and JSON-LD schema
- **Head-to-head comparisons** — X vs Y pages with feature tables
- **Educational guides** — RV Warranty 101 content covering coverage, shopping, and costs
- **Owner reviews** — Visitors can submit their own warranty experiences
- **SEO foundations** — Meta tags, canonical URLs, Open Graph, sitemap.xml, robots.txt, llms.txt

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Railway

This repo is configured for [Railway](https://railway.com) with `railway.toml` and standalone Next.js output.

### Option A: Deploy from GitHub (recommended)

1. Go to [railway.com/new](https://railway.com/new)
2. Choose **Deploy from GitHub repo**
3. Select `ForrestHall/review`
4. Railway will detect Next.js and run `npm run build` + `npm start`

### Option B: Deploy with Railway CLI

```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

### Environment variables

Set these in your Railway service **Variables** tab:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | Your public URL, e.g. `https://rvwarrantyreview.com` |
| `DATA_DIR` | `/data` (after adding a volume — see below) |

Railway also sets `RAILWAY_PUBLIC_DOMAIN` automatically, which the app uses as a fallback for SEO URLs before you add a custom domain.

### Persistent owner reviews (Volume)

Owner-submitted reviews are stored in a JSON file. Railway's filesystem is ephemeral by default, so add a **Volume**:

1. In your Railway project, open your service
2. Go to **Volumes** → **Add Volume**
3. Mount path: `/data`
4. Add variable: `DATA_DIR=/data`

Without a volume, reviews reset on each deploy.

### Custom domain

1. In Railway, open your service → **Settings** → **Networking**
2. Click **Generate Domain** (for a `*.up.railway.app` URL) or **Custom Domain**
3. Add `rvwarrantyreview.com` and point your DNS CNAME to Railway
4. Set `NEXT_PUBLIC_SITE_URL=https://rvwarrantyreview.com`
5. Redeploy

## Build & Deploy (local)

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # Pages and routes
├── components/       # UI components
├── data/             # Company and guide content
├── lib/              # Site config and SEO utilities
└── types/            # TypeScript types
```

## Customization

- Edit company data in `src/data/companies.ts`
- Edit guides in `src/data/guides.ts`
- Update site config in `src/lib/site.ts`
- Replace placeholder phone numbers and affiliate links before launch

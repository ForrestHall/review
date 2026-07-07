# RV Warranty Review

SEO-optimized RV extended warranty review site for [rvwarrantyreview.com](https://rvwarrantyreview.com).

Built with Next.js, TypeScript, and Tailwind CSS. Statically generated for fast performance and strong search engine visibility.

## Features

- **Comparison hub** — Ranked list of top RV warranty providers with ratings and reviews
- **Individual review pages** — Detailed company reviews with pros, cons, and JSON-LD schema
- **Educational guides** — RV Warranty 101 content covering coverage, shopping, and costs
- **SEO foundations** — Meta tags, canonical URLs, Open Graph, sitemap.xml, robots.txt, FAQ schema

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Deploy

```bash
npm run build
npm start
```

Deploy to Vercel, Netlify, or any static hosting that supports Next.js.

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

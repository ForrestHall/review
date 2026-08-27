# Analytics → Looker / Looker Studio

Connect **rvwarrantyreview.com** reporting to Google Looker Studio (free dashboards) or enterprise **Looker** (BigQuery models).

## Data flow

```
Site (GA4 tag G-RMSCHQPTV5)
  → GA4 property
    → Looker Studio (connector)
    → optional: BigQuery export → Looker (enterprise)
```

No Looker snippet goes on the site. The site feeds **GA4**; Looker reads GA4 (or BigQuery).

---

## 1. Verify GA4 events (required once)

### Automated smoke check

```bash
npm run verify:ga4
# or against staging:
SITE_URL=https://your-app.up.railway.app npm run verify:ga4
```

Confirms the GA4 tag (`G-RMSCHQPTV5`) is on `/` and `/find-coverage`.

### Realtime manual check

1. Open [GA4](https://analytics.google.com) → property with measurement ID **G-RMSCHQPTV5**
2. **Reports → Realtime**
3. In another tab, open:
   `https://www.rvwarrantyreview.com/find-coverage?utm_source=looker_verify`
4. Click through quiz steps → confirm **`quiz_step`** events in Realtime (Event count by Event name)
5. Submit a test lead → confirm **`generate_lead`** (requires `ARW_API_TOKEN` on Railway; without it the quiz falls back and **no** lead event fires)

### Events emitted (code: `src/lib/analytics.ts`)

| Event | When | Key parameters |
|-------|------|----------------|
| `quiz_step` | Each funnel step | `quiz_step`, `method` |
| `generate_lead` | Successful `/api/arw-lead` only | `method`, UTM params, `gclid`, `fbclid` |
| `exit_intent_show` | Exit-intent modal opens (once/session) | `method` |
| `exit_intent_click` | User clicks Get Matched in modal | `method`, `cta_medium` |

### Register custom dimensions in GA4 Admin

For Looker Studio breakdowns, register these as **Custom dimensions → Event scope**:

| Parameter | Dimension name |
|-----------|----------------|
| `quiz_step` | Quiz step |
| `utm_source` | UTM source |
| `utm_medium` | UTM medium |
| `utm_campaign` | UTM campaign |
| `utm_content` | UTM content |
| `utm_term` | UTM term |
| `gclid` | Google click ID |
| `fbclid` | Meta click ID |
| `cta_medium` | Exit-intent CTA medium (on `exit_intent_click`) |

**Admin → Data display → Custom definitions → Create custom dimensions**

Allow 24–48 hours after registration for dimensions to appear in Looker Studio.

---

## 2. Looker Studio dashboard (Path A)

1. Go to [lookerstudio.google.com](https://lookerstudio.google.com) → **Create → Report**
2. **Add data → Google Analytics**
3. Select the GA4 property for **G-RMSCHQPTV5**
4. Sign in with the Google account that owns the property

### Recommended charts

| Chart type | Metric | Dimension / filter | Purpose |
|------------|--------|-------------------|---------|
| Scorecard | Sessions | Page path contains `/find-coverage` | Quiz landing traffic |
| Scorecard | Event count | Event name = `generate_lead` | Leads submitted |
| Time series | Event count | Event name = `quiz_step`, breakdown: Quiz step | Funnel activity over time |
| Bar chart | Event count | Event name = `quiz_step`, dimension: Quiz step | Step drop-off |
| Table | Event count | Event name = `generate_lead`, dimensions: UTM source, UTM campaign | Paid vs organic leads |
| Table | Sessions | Landing page + source/medium | Top entry paths to quiz |

### Date range & filters

- Default: Last 28 days
- Add report filter: **Hostname** = `www.rvwarrantyreview.com`
- Optional filter: **Event name** is one of `quiz_step`, `generate_lead`

### Share the report

**Share → Manage access** — add team emails. Pin the report in your Looker Studio home for weekly review.

---

## 3. Search Console connector (Path A extension)

Add organic search data to the same report:

1. In the report: **Resource → Manage added data sources → Add a data source**
2. Choose **Search Console**
3. Select site property: `https://www.rvwarrantyreview.com/` (must be verified in GSC)
4. Add charts:

| Chart | Metrics | Dimensions |
|-------|---------|------------|
| Table | Clicks, Impressions, CTR | Query |
| Time series | Clicks | Date |
| Table | Clicks | Landing page (filter pages containing `/find-coverage` or `/reviews`) |

**Blend data (optional):** Combine GA4 sessions on `/find-coverage` with GSC clicks on the same URL using a **Blend** on Page / Landing page.

### GSC verification on site

Set in Railway (or `.env`):

```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_token
```

The meta tag is rendered in `src/app/layout.tsx`.

Submit sitemap in GSC: `https://www.rvwarrantyreview.com/sitemap.xml`

---

## 4. Enterprise Looker via BigQuery (Path B)

Use when you have a GCP **Looker** instance and need SQL modeling or joins with ad spend / CRM.

### Enable GA4 → BigQuery export

1. GA4 **Admin → Product links → BigQuery Links**
2. Link your GCP project; enable **Daily** export (Streaming optional)
3. Tables appear as `analytics_<PROPERTY_ID>.events_YYYYMMDD`

### Sample queries

See [`analytics/bigquery/looker-views.sql`](bigquery/looker-views.sql) for:

- `quiz_funnel_daily` — step counts by day
- `leads_by_source` — `generate_lead` with UTM dimensions

### Connect Looker

1. Looker **Admin → Connections → BigQuery**
2. Create a **View** from the SQL file (or native BigQuery table)
3. Build explores: funnel conversion rate = leads / quiz starts

Do **not** export raw email/phone to BigQuery without a privacy review.

---

## 5. Production checklist

| Variable | Required for | Where |
|----------|--------------|-------|
| `NEXT_PUBLIC_GA_ID` | GA4 (defaults to G-RMSCHQPTV5) | Railway |
| `ARW_API_TOKEN` | On-site leads + `generate_lead` events | Railway |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | GSC HTML verification | Railway |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta ads only (not Looker) | Railway |

---

## 6. UTM tracking & Meta Pixel

### Convention (ARW-aligned)

| Field | Organic site CTAs | Facebook ads |
|-------|-------------------|--------------|
| `utm_campaign` | `rvr` | `rvr` |
| `utm_source` | `organic` | `Facebook` |
| `utm_content` | (not set) | **Ad landing slug** — `quiz-main`, `rankings-main` (first-touch) |
| `utm_medium` | CTA slug (e.g. `header-get-matched`) | Starts as ad slug; updates to last CTA clicked |

**Salesforce:** `LeadSource` stays `rvr`. Use **`UTM_Content__c`** to compare homepage vs quiz ad landings; **`UTM_Medium__c`** for the last CTA that drove quiz entry (e.g. `exit-intent-quiz`).

### URL presets

**Facebook ad — quiz direct:**

```
https://www.rvwarrantyreview.com/find-coverage?utm_campaign=rvr&utm_source=Facebook&utm_medium=quiz-main&utm_content=quiz-main
```

**Facebook ad — rankings homepage (TBC-style hero):**

```
https://www.rvwarrantyreview.com/?utm_campaign=rvr&utm_source=Facebook&utm_medium=rankings-main&utm_content=rankings-main
```

Change slugs per creative (`quiz-video-v1`, `rankings-carousel-v1`, etc.). Code helper: `buildAdLandingHref(path, medium)` sets both `utm_medium` and `utm_content`.

### Differentiating ad tests in Salesforce

| Ad test | Landing URL | `UTM_Content__c` (ad landing) | `UTM_Medium__c` (conversion CTA) |
|---------|-------------|-------------------------------|----------------------------------|
| Quiz direct | `/find-coverage?...&utm_content=quiz-main` | `quiz-main` | `quiz-main` (or last CTA if they navigated) |
| Rankings homepage | `/?...&utm_content=rankings-main` | `rankings-main` | Last quiz CTA (e.g. `exit-intent-quiz`, `home-hero-quiz`) |

Filter Looker/SF reports on **`UTM_Content__c`** to compare ad landing performance; use **`UTM_Medium__c`** for CTA-level conversion analysis.

**Organic CTA (built in code via `findCoverageHref()`):**

```
/find-coverage?utm_campaign=rvr&utm_source=organic&utm_medium=home-hero-quiz
```

Medium slugs: `header-get-matched`, `home-hero-quiz`, `sticky-get-matched`, `exit-intent-quiz` (exit-intent / “last chance” modal), `quiz-match-cta`, `review-get-matched`, `compare-get-matched`, `guide-get-matched`, `blog-get-matched`, `review-get-quote`.

### Ad landing variants

| `utm_medium` prefix | Variant | Landing page | Hero behavior |
|---------------------|---------|--------------|---------------|
| `quiz-*` | quiz | `/find-coverage` | Quiz-first (default) |
| `rankings-*` | rankings | `/` homepage | “See Our #1 Pick” primary CTA |

Variant is stored first-touch in `sessionStorage` via `src/lib/ad-variants.ts` and drives the homepage hero (`HomeHero`).

### How it works (hybrid attribution)

| Field | Policy |
|-------|--------|
| `utm_source`, `utm_campaign`, `utm_term` | First-touch — acquisition channel sticks |
| **`utm_content`** | **First-touch — ad landing slug** (`quiz-main`, `rankings-main`); not set for organic |
| `fbclid`, `gclid` | First-touch |
| **`utm_medium`** | **Last-touch** when present in URL — which CTA drove the quiz |

1. **Site-wide capture** — `AttributionCapture` reads UTM params + `gclid`/`fbclid` into `sessionStorage`.
2. **Click ID inference** — `fbclid` → `Facebook`, `gclid` → `Google` only when no explicit `utm_source` was captured.
3. **Organic CTAs** — hrefs append UTMs; `utm_medium` updates on each tagged quiz entry (e.g. exit-intent modal → `exit-intent-quiz`).
4. **Exit-intent modal** — links to `/find-coverage?...&utm_medium=exit-intent-quiz`; GA4 fires `exit_intent_show` and `exit_intent_click`.
5. **Quiz events** — `quiz_step` and `generate_lead` use stored attribution from `getLeadAttribution()`.
6. **Lead API** — `/api/arw-lead` forwards UTMs to Salesforce on successful submit.

**Testing note:** Use a fresh incognito window when comparing acquisition sources. `utm_source` is first-touch; `utm_medium` reflects the last CTA clicked before quiz entry.

### Meta Pixel

Set on Railway (and locally for testing):

```
NEXT_PUBLIC_META_PIXEL_ID=1086705430359596
```

- **PageView** — fires on every page load (`Analytics.tsx`)
- **Lead** — fires on successful quiz submit (`trackMetaLead()` in `FindCoverageSurvey.tsx`)

Verify in [Meta Events Manager](https://business.facebook.com/events_manager) → Test Events while submitting a test lead on `/find-coverage`.

### Testing checklist

1. **Facebook quiz URL** — incognito → ad quiz URL → complete quiz → SF `UTM_Source__c=Facebook`, `utm_medium=quiz-main`
2. **Facebook rankings URL** — incognito → rankings homepage URL → hero shows “See Our #1 Pick” → complete quiz → SF source `Facebook`, medium `rankings-main` (or last CTA clicked)
3. **Organic CTA** — incognito → click “Get Matched” from header → submit → `utm_source=organic`, medium `header-get-matched`
4. **Exit-intent modal** — incognito → homepage → trigger modal (mouse to top) → Get Matched → submit → SF medium `exit-intent-quiz`; GA4 `exit_intent_show` + `exit_intent_click`
5. **Paid then exit intent** — Facebook rankings URL → exit-intent Get Matched → submit → SF content `rankings-main`, medium `exit-intent-quiz`, source `Facebook`
6. **Quiz ad direct** — Facebook quiz URL → complete quiz → SF content and medium both `quiz-main`
7. **Direct visit** — `/find-coverage` with no params → lead still submits; UTM fields empty unless click IDs present

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| No `generate_lead` in Realtime | Set `ARW_API_TOKEN`; test submit without ad blockers |
| `quiz_step` missing | Confirm `/find-coverage` loads GA tag (`npm run verify:ga4`) |
| UTM columns empty in Looker Studio | Register custom dimensions in GA4; wait 24–48h |
| Quiz step dimension missing | Register `quiz_step` custom dimension in GA4 |
| GSC connector unavailable | Verify site in Search Console with same Google account |

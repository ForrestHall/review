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
| `utm_medium` | kebab-case slug (e.g. `header-get-matched`) | creative slug (e.g. `quiz-main`) |

**Salesforce:** `LeadSource` stays `rvr` (advertiser token). Campaign detail lives in `UTM_Campaign__c`, `UTM_Source__c`, `UTM_Medium__c`.

### URL presets

**Facebook ad landing URL:**

```
https://www.rvwarrantyreview.com/find-coverage?utm_campaign=rvr&utm_source=Facebook&utm_medium=quiz-main
```

Change `utm_medium` per creative (`quiz-video-v1`, etc.).

**Organic CTA (built in code via `findCoverageHref()`):**

```
/find-coverage?utm_campaign=rvr&utm_source=organic&utm_medium=home-hero-quiz
```

Medium slugs: `header-get-matched`, `home-hero-quiz`, `sticky-get-matched`, `exit-intent-quiz`, `quiz-match-cta`, `review-get-matched`, `compare-get-matched`, `guide-get-matched`, `blog-get-matched`, `review-get-quote`.

### How it works

1. **Site-wide capture** — `AttributionCapture` reads UTM params + `gclid`/`fbclid` from the landing URL into `sessionStorage` (first-touch).
2. **Organic links** — CTAs append ARW-aligned UTMs via `src/lib/attribution.ts`.
3. **Quiz events** — `quiz_step` and `generate_lead` include stored attribution params in GA4.
4. **Lead API** — `/api/arw-lead` forwards UTMs to Salesforce on successful submit.

### Meta Pixel

Set on Railway (and locally for testing):

```
NEXT_PUBLIC_META_PIXEL_ID=1086705430359596
```

- **PageView** — fires on every page load (`Analytics.tsx`)
- **Lead** — fires on successful quiz submit (`trackMetaLead()` in `FindCoverageSurvey.tsx`)

Verify in [Meta Events Manager](https://business.facebook.com/events_manager) → Test Events while submitting a test lead on `/find-coverage`.

### Testing checklist

1. **Facebook URL** — open ad URL with UTMs → complete quiz → check Salesforce UTM fields + GA4 Realtime (`generate_lead` with UTM params) + Meta Lead event
2. **Organic CTA** — click "Get Matched" from homepage → same checks; `utm_source` should be `organic`
3. **Direct visit** — `/find-coverage` with no params → lead still submits; UTM fields empty unless referrer click IDs present

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| No `generate_lead` in Realtime | Set `ARW_API_TOKEN`; test submit without ad blockers |
| `quiz_step` missing | Confirm `/find-coverage` loads GA tag (`npm run verify:ga4`) |
| UTM columns empty in Looker Studio | Register custom dimensions in GA4; wait 24–48h |
| Quiz step dimension missing | Register `quiz_step` custom dimension in GA4 |
| GSC connector unavailable | Verify site in Search Console with same Google account |

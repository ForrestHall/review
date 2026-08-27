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

### Passthrough model (TBC-style)

You control UTMs on your ad/landing URLs. The site **captures them first-touch** and **passes them through** to every quiz CTA and ARW quote link — no hardcoded `rvr` / `organic` overrides.

**Example:** land on:

```
https://www.rvwarrantyreview.com/?utm_campaign=leads&utm_source=facebook&utm_medium=tbc_promo
```

- **Get Matched** → `/find-coverage?utm_campaign=leads&utm_source=facebook&utm_medium=tbc_promo`
- **Get Quote (ARW)** → `https://www.americasrvwarranty.com/quote/source/rvr/...?utm_campaign=leads&utm_source=facebook&utm_medium=tbc_promo`

Same UTMs are sent to Salesforce on quiz submit via `/api/arw-lead`.

| Behavior | Detail |
|----------|--------|
| Capture | First-touch per session (`AttributionCapture` + `sessionStorage`) |
| Quiz CTAs | `FindCoverageLink` reads stored UTMs client-side |
| ARW quote CTAs | `QuoteLink` appends stored UTMs to the quote URL |
| No landing UTMs | CTAs link to plain `/find-coverage` and base ARW URL |
| `fbclid` / `gclid` | Captured for analytics/submit; not appended to CTA hrefs |

**Salesforce:** `LeadSource` stays `rvr`. Campaign detail in `UTM_Campaign__c`, `UTM_Source__c`, `UTM_Medium__c`, etc.

### Example ad URLs

**Homepage LP:**

```
https://www.rvwarrantyreview.com/?utm_campaign=leads&utm_source=facebook&utm_medium=homepage_v1
```

**Quiz direct:**

```
https://www.rvwarrantyreview.com/find-coverage?utm_campaign=leads&utm_source=facebook&utm_medium=quiz_v1
```

Use any values you want — the site passes them through unchanged.

### Homepage hero variants (optional)

If `utm_medium` starts with `rankings-`, the homepage hero switches to rankings-first copy. Prefix `quiz-` maps to quiz variant. Custom mediums (e.g. `tbc_promo`) use the default hero; UTMs still passthrough on CTAs.

### GA4 exit-intent events

- `exit_intent_show` — modal opens
- `exit_intent_click` — Get Matched clicked (uses your stored `utm_medium`)

### Testing checklist

1. **Custom LP UTMs** — incognito → `/?utm_campaign=test&utm_source=test&utm_medium=test` → hover Get Matched href → should include `test` params, not `rvr`/`organic`
2. **ARW quote** — same session → Get Quote href should include same UTMs on `americasrvwarranty.com`
3. **Quiz submit** — complete funnel → Salesforce UTM fields match landing values
4. **No UTMs** — direct visit → CTAs have no UTM query string; lead still submits

### Meta Pixel

Set on Railway (and locally for testing):

```
NEXT_PUBLIC_META_PIXEL_ID=1086705430359596
```

- **PageView** — fires on every page load (`Analytics.tsx`)
- **Lead** — fires on successful quiz submit (`trackMetaLead()` in `FindCoverageSurvey.tsx`)

Verify in [Meta Events Manager](https://business.facebook.com/events_manager) → Test Events while submitting a test lead on `/find-coverage`.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| No `generate_lead` in Realtime | Set `ARW_API_TOKEN`; test submit without ad blockers |
| `quiz_step` missing | Confirm `/find-coverage` loads GA tag (`npm run verify:ga4`) |
| UTM columns empty in Looker Studio | Register custom dimensions in GA4; wait 24–48h |
| Quiz step dimension missing | Register `quiz_step` custom dimension in GA4 |
| GSC connector unavailable | Verify site in Search Console with same Google account |
| CTAs show wrong UTMs | Land with UTMs first in a fresh session; check href after page loads (client-side) |

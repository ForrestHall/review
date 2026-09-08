# RV Referral Card Sheet

Tracker for RV techs who need referral cards. Enter each tech’s **Lead Source** slug; the sheet builds the quote URL you copy into a QR generator.

## Columns

| Column | Header        | Purpose |
|--------|---------------|---------|
| A      | Name          | Tech name (internal tracking / card printing) |
| B      | RV Facility   | Shop or campground name |
| C      | Lead Source   | URL slug and Salesforce `LeadSource` value |
| D      | Link          | Auto-generated quote URL — copy for QR codes |

Row 1 = headers. Data starts in row 2.

## Google Sheets setup

1. **Import the template**  
   File → Import → Upload [`rv-referral-cards-template.csv`](rv-referral-cards-template.csv) (or your updated Downloads copy).

2. **Add the link formula**  
   In cell **D2**, paste:

   ```gs
   =IF(C2="","","https://americasrvwarranty.com/quote/source/" & ENCODEURL(C2) & "/")
   ```

3. **Fill down**  
   Select D2, then double-click the fill handle (or drag down) for every tech row.

4. **Optional formatting**  
   - View → Freeze → 1 row  
   - Widen column D so full URLs are visible  
   - Format column D as plain text if you paste values elsewhere (formulas stay live in the sheet)

5. **Add techs**  
   Enter Name, RV Facility, and Lead Source in columns A–C. Column D updates automatically.

## Excel

In **D2**:

```excel
=IF(C2="","","https://americasrvwarranty.com/quote/source/" & C2 & "/")
```

Fill down as needed. Prefer URL-safe Lead Source values (lowercase, hyphens, no spaces).

## Link format

```
https://americasrvwarranty.com/quote/source/{LeadSource}/
```

- `{LeadSource}` comes from column C.
- Default tracking number **844-200-7314** applies on the quote form when `tracking_num` is not in the URL.
- The path segment is submitted as Salesforce `LeadSource` on the lead form.

## Lead Source naming

Each Lead Source should be:

1. **Unique** per tech (or per facility + tech)
2. **URL-safe** — e.g. `john-smith-sunset-rv-park`
3. **On the Salesforce Lead Source picklist** before you go live with the QR — otherwise leads may fail or lose attribution

Suggested pattern: `{first-last}-{facility-slug}`

## Workflow

1. Add a row (Name, RV Facility, Lead Source).
2. Copy **Link** from column D.
3. Paste into your QR tool (QR Code Generator, Canva, etc.).
4. Add the Lead Source to Salesforce when onboarding a new tech.

## Example row

| Name       | RV Facility   | Lead Source              | Link |
|------------|---------------|--------------------------|------|
| John Smith | Sunset RV Park | john-smith-sunset-rv-park | `https://americasrvwarranty.com/quote/source/john-smith-sunset-rv-park/` |

In Google Sheets, the Link column is a formula, not static text.

## Files

- [`rv-referral-cards-template.csv`](rv-referral-cards-template.csv) — empty template (headers only)
- Local working copy: `~/Downloads/RV REFERRAL CARDS - Sheet1.csv`

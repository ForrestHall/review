-- GA4 BigQuery views for enterprise Looker explores.
-- Replace analytics_XXXXXXXXX with your GA4 export dataset ID
-- (GA4 Admin → BigQuery Links → details).

-- ---------------------------------------------------------------------------
-- Quiz funnel: event counts by step and day
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW `analytics_XXXXXXXXX.quiz_funnel_daily` AS
SELECT
  PARSE_DATE('%Y%m%d', event_date) AS event_date,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'quiz_step') AS quiz_step,
  COUNT(*) AS event_count,
  COUNT(DISTINCT user_pseudo_id) AS users
FROM `analytics_XXXXXXXXX.events_*`
WHERE event_name = 'quiz_step'
  AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY))
                        AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
GROUP BY 1, 2;

-- ---------------------------------------------------------------------------
-- Leads by attribution source
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW `analytics_XXXXXXXXX.leads_by_source` AS
SELECT
  PARSE_DATE('%Y%m%d', event_date) AS event_date,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'utm_source') AS utm_source,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'utm_medium') AS utm_medium,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'utm_campaign') AS utm_campaign,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'gclid') AS gclid,
  COUNT(*) AS lead_events,
  COUNT(DISTINCT user_pseudo_id) AS users
FROM `analytics_XXXXXXXXX.events_*`
WHERE event_name = 'generate_lead'
  AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY))
                        AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
GROUP BY 1, 2, 3, 4, 5;

-- ---------------------------------------------------------------------------
-- Quiz landing page sessions (for conversion rate)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW `analytics_XXXXXXXXX.find_coverage_sessions` AS
SELECT
  PARSE_DATE('%Y%m%d', event_date) AS event_date,
  COUNT(DISTINCT CONCAT(user_pseudo_id, CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS STRING))) AS sessions
FROM `analytics_XXXXXXXXX.events_*`
WHERE event_name = 'page_view'
  AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') LIKE '%/find-coverage%'
  AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY))
                        AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
GROUP BY 1;

-- Looker explore idea:
--   leads / sessions = conversion rate by day
--   JOIN leads_by_source.event_date = find_coverage_sessions.event_date

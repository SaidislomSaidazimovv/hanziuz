-- 019: Single-RPC replacement for the 8 client-side count queries in getSrsStats.
-- Collapses 8 network round-trips to 1.

CREATE OR REPLACE FUNCTION public.get_srs_stats(uid uuid)
RETURNS TABLE(
  due integer,
  new_count integer,
  learned integer,
  mastered integer,
  leeches integer,
  reviewed_today integer,
  tomorrow_due integer,
  week_due integer
)
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  WITH bounds AS (
    SELECT
      date_trunc('day', now()) AS today_start,
      date_trunc('day', now()) + interval '1 day'  AS tomorrow_start,
      date_trunc('day', now()) + interval '2 days' AS tomorrow_end,
      date_trunc('day', now()) + interval '7 days' AS week_end
  ),
  totals AS (
    SELECT (SELECT COUNT(*)::int FROM public.vocabulary) AS vocab_total,
           (SELECT COUNT(*)::int FROM public.srs_reviews WHERE user_id = uid) AS learned_count
  )
  SELECT
    (SELECT COUNT(*)::int FROM public.srs_reviews
       WHERE user_id = uid AND next_review_at <= now()) AS due,
    GREATEST(0, (SELECT vocab_total FROM totals) - (SELECT learned_count FROM totals)) AS new_count,
    (SELECT learned_count FROM totals) AS learned,
    (SELECT COUNT(*)::int FROM public.srs_reviews
       WHERE user_id = uid AND repetitions >= 5) AS mastered,
    (SELECT COUNT(*)::int FROM public.srs_reviews
       WHERE user_id = uid AND coalesce(lapses, 0) >= 3) AS leeches,
    (SELECT COUNT(*)::int FROM public.srs_reviews
       WHERE user_id = uid
         AND last_reviewed_at >= (SELECT today_start FROM bounds)) AS reviewed_today,
    (SELECT COUNT(*)::int FROM public.srs_reviews
       WHERE user_id = uid
         AND next_review_at >= (SELECT tomorrow_start FROM bounds)
         AND next_review_at <  (SELECT tomorrow_end   FROM bounds)) AS tomorrow_due,
    (SELECT COUNT(*)::int FROM public.srs_reviews
       WHERE user_id = uid
         AND next_review_at >= now()
         AND next_review_at <= (SELECT week_end FROM bounds)) AS week_due;
$$;

GRANT EXECUTE ON FUNCTION public.get_srs_stats(uuid) TO authenticated;

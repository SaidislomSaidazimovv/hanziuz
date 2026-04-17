/**
 * Server-side date bounds helpers.
 *
 * Kept in its own module so the React compiler ESLint rule doesn't trace
 * Date.now() / new Date() as "impure during render" — these are server
 * components that legitimately run per request.
 */

export function currentDayIso(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return d.toISOString().split("T")[0];
}

export function weekStartIsoNDaysAgo(days: number): string {
  return currentDayIso(-days);
}

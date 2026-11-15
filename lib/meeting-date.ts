/** Ward time zone, so "this Sunday" is the same on the server (UTC) and for local members. */
export const WARD_TIME_ZONE = 'Africa/Maputo';

/** Today's date in the ward time zone as 'YYYY-MM-DD'. */
export function getTodayISO(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: WARD_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** The most recent Sunday (today, if today is Sunday) as 'YYYY-MM-DD'. */
export function getMostRecentSundayISO(now: Date = new Date()): string {
  const date = new Date(`${getTodayISO(now)}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return date.toISOString().slice(0, 10);
}

/** Formats an ISO date ('YYYY-MM-DD') as a readable, timezone-safe string. */
export function formatMeetingDate(
  iso: string,
  style: 'long' | 'short' = 'long'
): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString('en-US', {
    weekday: style === 'long' ? 'long' : 'short',
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
    timeZone: 'UTC', // the date has no time component, so never shift it
  });
}

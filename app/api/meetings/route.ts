import { getMeetings } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

/** Accepts only a real calendar date in the format YYYY-MM-DD (rejects 2026-02-30). */
function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}

export async function GET(request: Request): Promise<Response> {
  const date = new URL(request.url).searchParams.get('date');

  if (date !== null && !isValidDate(date)) {
    return Response.json(
      { error: `Invalid date "${date}". Use the format YYYY-MM-DD.` },
      { status: 400 }
    );
  }

  try {
    // A valid date with no meetings simply returns an empty array.
    const meetings: SacramentMeeting[] = await getMeetings(date);
    return Response.json(meetings, { status: 200 });
  } catch (error) {
    console.error('GET /api/meetings failed:', error);
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

import { neon } from '@neondatabase/serverless';
import { getMostRecentSundayISO } from './meeting-date';
import type { SacramentMeeting } from './types';

export const PAGE_SIZE = 5;

/**
 * The client is created inside a function (not at module level) so `next build`
 * does not fail when DATABASE_URL is not defined yet.
 * neon() returns a tagged template: every interpolated value becomes a query
 * parameter ($1, $2, ...), so user input can never be injected as SQL.
 */
function db() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Run `vercel env pull .env.local` and restart the dev server.'
    );
  }
  return neon(url);
}

/** A row exactly as stored in PostgreSQL (snake_case columns). */
type MeetingRow = {
  id: number;
  date: string;
  meeting_type: SacramentMeeting['meetingType'];
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  opening_hymn: SacramentMeeting['openingHymn'];
  opening_prayer: string;
  ward_business: SacramentMeeting['wardBusiness'] | null;
  stake_business: boolean | null;
  sacrament_hymn: SacramentMeeting['sacramentHymn'];
  speakers: SacramentMeeting['speakers'] | null;
  closing_hymn: SacramentMeeting['closingHymn'];
  closing_prayer: string;
};

/** Converts a database row (snake_case) into the app's SacramentMeeting type. */
function mapRow(row: MeetingRow): SacramentMeeting {
  return {
    id: row.id,
    date: row.date,
    meetingType: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements ?? [],
    openingHymn: row.opening_hymn,
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business ?? [],
    stakeBusiness: row.stake_business ?? false,
    sacramentHymn: row.sacrament_hymn,
    speakers: row.speakers ?? [],
    closingHymn: row.closing_hymn,
    closingPrayer: row.closing_prayer,
  };
}

/** All meetings (newest first), or only the ones on a date ('YYYY-MM-DD'). */
export async function getMeetings(date?: string | null): Promise<SacramentMeeting[]> {
  const sql = db();
  // to_char() returns the DATE as a plain 'YYYY-MM-DD' string (no timezone shift).
  const rows = date
    ? await sql`
        SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type, presiding,
               conducting, announcements, opening_hymn, opening_prayer,
               ward_business, stake_business, sacrament_hymn, speakers,
               closing_hymn, closing_prayer
        FROM meetings
        WHERE date = ${date}
        ORDER BY date DESC`
    : await sql`
        SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type, presiding,
               conducting, announcements, opening_hymn, opening_prayer,
               ward_business, stake_business, sacrament_hymn, speakers,
               closing_hymn, closing_prayer
        FROM meetings
        ORDER BY date DESC`;
  return rows.map((row) => mapRow(row as MeetingRow));
}

/** One meeting by id, or null if it does not exist. */
export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  const sql = db();
  const rows = await sql`
    SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type, presiding,
           conducting, announcements, opening_hymn, opening_prayer,
           ward_business, stake_business, sacrament_hymn, speakers,
           closing_hymn, closing_prayer
    FROM meetings
    WHERE id = ${id}`;
  return rows[0] ? mapRow(rows[0] as MeetingRow) : null;
}

/**
 * Meeting for the most recent Sunday (in the ward time zone). If none exists
 * for that exact date, falls back to the latest meeting on or before it;
 * returns null if there is none.
 */
export async function getCurrentMeeting(now: Date = new Date()): Promise<SacramentMeeting | null> {
  const sql = db();
  const sundayISO = getMostRecentSundayISO(now);
  const rows = await sql`
    SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type, presiding,
           conducting, announcements, opening_hymn, opening_prayer,
           ward_business, stake_business, sacrament_hymn, speakers,
           closing_hymn, closing_prayer
    FROM meetings
    WHERE date <= ${sundayISO}
    ORDER BY date DESC
    LIMIT 1`;
  return rows[0] ? mapRow(rows[0] as MeetingRow) : null;
}

/**
 * Search + pagination for the /meetings list.
 * Matches the presiding / conducting names, the meeting type and the NAMES of
 * speakers / musical numbers (case-insensitive). PAGE_SIZE meetings per page.
 */
export async function searchMeetings(
  query: string,
  page: number
): Promise<{ meetings: SacramentMeeting[]; totalPages: number }> {
  const sql = db();
  // Escape \ % _ so the user cannot use them as LIKE wildcards.
  const pattern = `%${query.trim().replace(/[\\%_]/g, '\\$&')}%`;
  const safePage = Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
  const offset = (safePage - 1) * PAGE_SIZE;

  const rows = await sql`
    SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type, presiding,
           conducting, announcements, opening_hymn, opening_prayer,
           ward_business, stake_business, sacrament_hymn, speakers,
           closing_hymn, closing_prayer
    FROM meetings
    WHERE presiding ILIKE ${pattern}
       OR conducting ILIKE ${pattern}
       OR meeting_type ILIKE ${pattern}
       OR EXISTS (
            SELECT 1 FROM jsonb_array_elements(speakers) AS s
            WHERE s->>'name' ILIKE ${pattern}
          )
    ORDER BY date DESC
    LIMIT ${PAGE_SIZE} OFFSET ${offset}`;

  const count = await sql`
    SELECT COUNT(*)::int AS total
    FROM meetings
    WHERE presiding ILIKE ${pattern}
       OR conducting ILIKE ${pattern}
       OR meeting_type ILIKE ${pattern}
       OR EXISTS (
            SELECT 1 FROM jsonb_array_elements(speakers) AS s
            WHERE s->>'name' ILIKE ${pattern}
          )`;

  return {
    meetings: rows.map((row) => mapRow(row as MeetingRow)),
    totalPages: Math.max(1, Math.ceil(Number(count[0].total) / PAGE_SIZE)),
  };
}

// ---- Stubs: these will be wired to the database in Week 04 (forms) ----

export async function addMeeting(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _meeting: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
  throw new Error('addMeeting: not implemented until Week 04');
}

export async function updateMeeting(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _id: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _changes: Partial<Omit<SacramentMeeting, 'id'>>
): Promise<SacramentMeeting | null> {
  throw new Error('updateMeeting: not implemented until Week 04');
}

export async function deleteMeeting(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _id: number
): Promise<boolean> {
  throw new Error('deleteMeeting: not implemented until Week 04');
}

import { neon } from '@neondatabase/serverless';
import { getMostRecentSundayISO } from './meeting-date';
import type { MeetingInput, SacramentMeeting } from './types';

export const PAGE_SIZE = 5;

/**
 * The client is created inside a function (not at module level) so `next build`
 * does not fail when DATABASE_URL is not defined yet.
 * neon() returns a tagged template: every interpolated value becomes a query
 * parameter ($1, $2, ...), so user input can never be injected as SQL.
 */
export function db() {
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

// ---- Mutations (Week 04) ----

/** Inserts a new meeting and returns it (with its generated id). */
export async function addMeeting(meeting: MeetingInput): Promise<SacramentMeeting> {
  const sql = db();
  const rows = await sql`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting, announcements,
      opening_hymn, opening_prayer, ward_business, stake_business,
      sacrament_hymn, speakers, closing_hymn, closing_prayer
    )
    VALUES (
      ${meeting.date}::date,
      ${meeting.meetingType},
      ${meeting.presiding},
      ${meeting.conducting},
      ${meeting.announcements ?? []}::text[],
      ${JSON.stringify(meeting.openingHymn)}::jsonb,
      ${meeting.openingPrayer},
      ${JSON.stringify(meeting.wardBusiness)}::jsonb,
      ${meeting.stakeBusiness},
      ${JSON.stringify(meeting.sacramentHymn)}::jsonb,
      ${JSON.stringify(meeting.speakers)}::jsonb,
      ${JSON.stringify(meeting.closingHymn)}::jsonb,
      ${meeting.closingPrayer}
    )
    RETURNING id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type, presiding,
              conducting, announcements, opening_hymn, opening_prayer,
              ward_business, stake_business, sacrament_hymn, speakers,
              closing_hymn, closing_prayer`;
  return mapRow(rows[0] as MeetingRow);
}

/**
 * Updates a meeting. Only the fields present in `changes` are replaced.
 * Returns the updated meeting, or null if the id does not exist.
 */
export async function updateMeeting(
  id: number,
  changes: Partial<MeetingInput>
): Promise<SacramentMeeting | null> {
  const current = await getMeetingById(id);
  if (!current) return null;

  const next = { ...current, ...changes };
  const sql = db();
  const rows = await sql`
    UPDATE meetings
    SET date = ${next.date}::date,
        meeting_type = ${next.meetingType},
        presiding = ${next.presiding},
        conducting = ${next.conducting},
        announcements = ${next.announcements ?? []}::text[],
        opening_hymn = ${JSON.stringify(next.openingHymn)}::jsonb,
        opening_prayer = ${next.openingPrayer},
        ward_business = ${JSON.stringify(next.wardBusiness)}::jsonb,
        stake_business = ${next.stakeBusiness},
        sacrament_hymn = ${JSON.stringify(next.sacramentHymn)}::jsonb,
        speakers = ${JSON.stringify(next.speakers)}::jsonb,
        closing_hymn = ${JSON.stringify(next.closingHymn)}::jsonb,
        closing_prayer = ${next.closingPrayer}
    WHERE id = ${id}
    RETURNING id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type, presiding,
              conducting, announcements, opening_hymn, opening_prayer,
              ward_business, stake_business, sacrament_hymn, speakers,
              closing_hymn, closing_prayer`;
  return rows[0] ? mapRow(rows[0] as MeetingRow) : null;
}

/** Deletes a meeting. Returns false if the id does not exist. */
export async function deleteMeeting(id: number): Promise<boolean> {
  const sql = db();
  const rows = await sql`DELETE FROM meetings WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

import { neon } from "@neondatabase/serverless";
import type { SacramentMeeting } from "@/lib/types";

export const PAGE_SIZE = 5;

// O cliente é criado dentro de uma função (e não no topo do ficheiro) para que
// o `npm run build` não rebente quando DATABASE_URL ainda não está definida.
// neon() devolve um "tagged template": cada valor interpolado vira um parâmetro
// ($1, $2...), por isso não há risco de SQL injection.
function db() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Run `vercel env pull .env.local` and restart the dev server."
    );
  }
  return neon(url);
}

// Linha como vem da base de dados (snake_case).
type MeetingRow = {
  id: number;
  date: string;
  meeting_type: SacramentMeeting["meetingType"];
  presiding: string;
  conducting: string;
  announcements: string[];
  opening_hymn: SacramentMeeting["openingHymn"];
  opening_prayer: string;
  ward_business: SacramentMeeting["wardBusiness"];
  stake_business: boolean;
  sacrament_hymn: SacramentMeeting["sacramentHymn"];
  speakers: SacramentMeeting["speakers"];
  closing_hymn: SacramentMeeting["closingHymn"];
  closing_prayer: string;
};

// Converte snake_case (BD) para o tipo camelCase da aplicação.
// AJUSTA os nomes à tua interface SacramentMeeting em lib/types.ts.
function mapRow(r: MeetingRow): SacramentMeeting {
  return {
    id: r.id,
    date: r.date,
    meetingType: r.meeting_type,
    presiding: r.presiding,
    conducting: r.conducting,
    announcements: r.announcements,
    openingHymn: r.opening_hymn,
    openingPrayer: r.opening_prayer,
    wardBusiness: r.ward_business,
    stakeBusiness: r.stake_business,
    sacramentHymn: r.sacrament_hymn,
    speakers: r.speakers,
    closingHymn: r.closing_hymn,
    closingPrayer: r.closing_prayer,
  };
}

/** Todas as reuniões (ou só as de uma data YYYY-MM-DD). */
export async function getMeetings(date?: string): Promise<SacramentMeeting[]> {
  const sql = db();
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
  return rows.map((r) => mapRow(r as MeetingRow));
}

/** Uma reunião pelo id, ou undefined se não existir. */
export async function getMeetingById(
  id: number
): Promise<SacramentMeeting | undefined> {
  const sql = db();
  const rows = await sql`
    SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type, presiding,
           conducting, announcements, opening_hymn, opening_prayer,
           ward_business, stake_business, sacrament_hymn, speakers,
           closing_hymn, closing_prayer
    FROM meetings
    WHERE id = ${id}`;
  return rows[0] ? mapRow(rows[0] as MeetingRow) : undefined;
}

/**
 * Pesquisa + paginação para a lista /meetings.
 * Procura em presiding, conducting, meeting_type e nos oradores (JSONB como texto).
 */
export async function searchMeetings(
  query: string,
  page: number
): Promise<{ meetings: SacramentMeeting[]; totalPages: number }> {
  const sql = db();
  // Escapa \ % _ para que o utilizador não os use como wildcards do LIKE.
  const pattern = `%${query.trim().replace(/[\\%_]/g, "\\$&")}%`;
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
       OR speakers::text ILIKE ${pattern}
    ORDER BY date DESC
    LIMIT ${PAGE_SIZE} OFFSET ${offset}`;

  const count = await sql`
    SELECT COUNT(*)::int AS total
    FROM meetings
    WHERE presiding ILIKE ${pattern}
       OR conducting ILIKE ${pattern}
       OR meeting_type ILIKE ${pattern}
       OR speakers::text ILIKE ${pattern}`;

  return {
    meetings: rows.map((r) => mapRow(r as MeetingRow)),
    totalPages: Math.max(1, Math.ceil(Number(count[0].total) / PAGE_SIZE)),
  };
}

// ---- Stubs: serão ligados à base de dados na Semana 04 (formulários) ----

export async function addMeeting(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _meeting: Omit<SacramentMeeting, "id">
): Promise<SacramentMeeting> {
  throw new Error("addMeeting: not implemented until Week 04");
}

export async function updateMeeting(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _id: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _changes: Partial<Omit<SacramentMeeting, "id">>
): Promise<SacramentMeeting | undefined> {
  throw new Error("updateMeeting: not implemented until Week 04");
}

export async function deleteMeeting(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _id: number
): Promise<boolean> {
  throw new Error("deleteMeeting: not implemented until Week 04");
}

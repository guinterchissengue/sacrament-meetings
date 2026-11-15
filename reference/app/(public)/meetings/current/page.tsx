import { redirect } from "next/navigation";
import { getMeetings } from "@/lib/meetings-db";

// Fuso horário FIXO do ramo: servidor e browser passam a concordar sobre
// "este domingo" (resolve o comentário do Copilot sobre fusos horários).
// Muda para o fuso do teu ramo/ala se for outro.
const BRANCH_TIME_ZONE = "America/Denver";

export const dynamic = "force-dynamic"; // depende da data de hoje: nunca em cache

// Devolve YYYY-MM-DD do domingo de hoje (se hoje for domingo) ou do próximo.
function upcomingSunday(timeZone: string): string {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date()); // en-CA => YYYY-MM-DD
  const [y, m, d] = today.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + ((7 - date.getUTCDay()) % 7));
  return date.toISOString().slice(0, 10);
}

export default async function CurrentMeetingPage() {
  // Os ids agora são números da BD (SERIAL), por isso procuramos pela DATA.
  const [meeting] = await getMeetings(upcomingSunday(BRANCH_TIME_ZONE));
  redirect(meeting ? `/meetings/${meeting.id}` : "/meetings");
}

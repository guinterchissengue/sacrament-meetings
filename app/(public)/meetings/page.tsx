import { Suspense } from "react";
import { redirect } from "next/navigation";
import { searchMeetings } from "@/lib/meetings-db";
import MeetingCard from "@/components/MeetingCard";
import MeetingSearch from "@/components/MeetingSearch";
import Pagination from "@/components/Pagination";

type SearchParams = Promise<{
  query?: string | string[];
  page?: string | string[];
}>;

// Um parâmetro repetido (?query=a&query=b) chega como array: usamos o primeiro.
const first = (value?: string | string[]) =>
  (Array.isArray(value) ? value[0] : value) ?? "";

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = first(params.query).trim().slice(0, 100);
  const requestedPage = Math.min(
    1_000_000,
    Math.max(1, Math.floor(Number(first(params.page))) || 1)
  );

  const { meetings, totalPages } = await searchMeetings(query, requestedPage);

  // ?page=99 (fora do intervalo) -> leva o utilizador para a última página válida.
  if (requestedPage > totalPages) {
    const qs = new URLSearchParams();
    if (query) qs.set("query", query);
    qs.set("page", String(totalPages));
    redirect(`/meetings?${qs.toString()}`);
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Sacrament Meeting Programs</h1>

      <Suspense fallback={null}>
        <MeetingSearch />
      </Suspense>

      {meetings.length === 0 ? (
        <p role="status" className="py-8 text-center text-gray-700">
          No meetings found{query ? ` for "${query}"` : ""}.
        </p>
      ) : (
        <ul className="space-y-4">
          {meetings.map((meeting) => (
            <li key={meeting.id}>
              <MeetingCard meeting={meeting} />
            </li>
          ))}
        </ul>
      )}

      <Suspense fallback={null}>
        <Pagination totalPages={totalPages} />
      </Suspense>
    </div>
  );
}

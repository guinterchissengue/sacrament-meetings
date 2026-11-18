import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { searchMeetings } from '@/lib/meetings-db';

type SearchParams = Promise<{
  query?: string | string[];
  page?: string | string[];
}>;

/** A repeated parameter (?query=a&query=b) arrives as an array: use the first value. */
const first = (value?: string | string[]) =>
  (Array.isArray(value) ? value[0] : value) ?? '';

export default async function MeetingsListPage({
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

  // ?page=99 (out of range) -> send the user to the last valid page.
  if (requestedPage > totalPages) {
    const qs = new URLSearchParams();
    if (query) qs.set('query', query);
    qs.set('page', String(totalPages));
    redirect(`/meetings?${qs.toString()}`);
  }

  return (
    <section aria-labelledby="meetings-list-heading" className="space-y-4">
      <h1 id="meetings-list-heading" className="text-2xl font-bold">
        All Meetings
      </h1>

      <Suspense fallback={null}>
        <MeetingSearch />
      </Suspense>

      {meetings.length === 0 ? (
        <p role="status" className="text-slate-700">
          {query
            ? `No meetings found for "${query}".`
            : 'No meetings have been scheduled yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}

      <Suspense fallback={null}>
        <Pagination totalPages={totalPages} />
      </Suspense>
    </section>
  );
}

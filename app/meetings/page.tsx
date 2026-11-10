import { headers } from 'next/headers';
import MeetingCard from '@/components/MeetingCard';
import { getMeetings } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

async function fetchMeetingsFromApi(): Promise<SacramentMeeting[]> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') ?? 'localhost:3000';
    const protocol =
      headersList.get('x-forwarded-proto') ??
      (host.includes('localhost') ? 'http' : 'https');

    const response = await fetch(`${protocol}://${host}/api/meetings`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data: SacramentMeeting[] = await response.json();
    return data;
  } catch {
    return getMeetings();
  }
}

export default async function MeetingsListPage() {
  const meetings = await fetchMeetingsFromApi();

  return (
    <section aria-labelledby="meetings-list-heading">
      <h2 id="meetings-list-heading" className="sr-only">
        All Meetings List
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </section>
  );
}

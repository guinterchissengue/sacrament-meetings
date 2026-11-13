import MeetingCard from '@/components/MeetingCard';
import { getBaseUrl } from '@/lib/api';
import { getMeetings } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

async function fetchMeetingsFromApi(): Promise<SacramentMeeting[]> {
  // Read headers outside the try/catch so Next.js can detect dynamic rendering.
  const baseUrl = await getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/meetings`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    return (await response.json()) as SacramentMeeting[];
  } catch (error) {
    // e.g. the deployment is protected and rejects server-side calls to itself
    console.error('Falling back to in-memory data:', error);
    return getMeetings();
  }
}

export default async function MeetingsListPage() {
  const meetings = await fetchMeetingsFromApi();

  return (
    <section aria-labelledby="meetings-list-heading" className="space-y-4">
      <h1 id="meetings-list-heading" className="text-2xl font-bold">
        All Meetings
      </h1>
      {meetings.length === 0 ? (
        <p className="text-slate-700">No meetings have been scheduled yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}
    </section>
  );
}

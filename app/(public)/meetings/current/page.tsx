import { redirect } from 'next/navigation';
import { getCurrentMeeting } from '@/lib/meetings-db';

export const dynamic = 'force-dynamic';

export default async function CurrentMeetingRedirectPage() {
  // The "current Sunday" is always resolved on the server in the ward time zone
  // (see lib/meeting-date.ts), so it never depends on the visitor's browser.
  const meeting = await getCurrentMeeting();
  redirect(meeting ? `/meetings/${meeting.id}` : '/meetings');
}

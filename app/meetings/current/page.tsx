import { redirect } from 'next/navigation';
import { getCurrentMeeting } from '@/lib/meetings-db';

export const dynamic = 'force-dynamic';

export default function CurrentMeetingRedirectPage() {
  const meeting = getCurrentMeeting();
  redirect(meeting ? `/meetings/${meeting.id}` : '/meetings');
}

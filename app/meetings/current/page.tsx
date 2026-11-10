import { redirect } from 'next/navigation';
import { getMeetings } from '@/lib/meetings-db';

export const dynamic = 'force-dynamic';

export default function CurrentMeetingRedirectPage() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) through 6 (Sat)
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek); // roll back to Sunday

  const year = sunday.getFullYear();
  const month = String(sunday.getMonth() + 1).padStart(2, '0');
  const day = String(sunday.getDate()).padStart(2, '0');
  const sundayISO = `${year}-${month}-${day}`;

  const matchingMeetings = getMeetings(sundayISO);

  if (matchingMeetings.length > 0) {
    redirect(`/meetings/${matchingMeetings[0].id}`);
  }

  redirect('/meetings');
}

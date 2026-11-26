import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import MeetingDetail from '@/components/MeetingDetail';
import { formatMeetingDate } from '@/lib/format';
import { MEETING_TYPE_OPTIONS } from '@/lib/meeting-form';
import { getMeetingById } from '@/lib/meetings-db';
import { OG_IMAGE } from '@/lib/site';

interface MeetingDetailPageProps {
  params: Promise<{ id: string }>;
}

const MAX_INT4 = 2_147_483_647; // SERIAL limit: larger ids would make PostgreSQL throw

// The page and generateMetadata both need the meeting: cache() runs the query once per request.
const getMeeting = cache(getMeetingById);

function parseId(id: string) {
  return /^\d+$/.test(id) && Number(id) >= 1 && Number(id) <= MAX_INT4 ? Number(id) : null;
}

export async function generateMetadata({ params }: MeetingDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const meetingId = parseId(id);
  const meeting = meetingId === null ? undefined : await getMeeting(meetingId);

  if (!meeting) {
    return { title: 'Meeting Not Found', robots: { index: false } };
  }

  const date = formatMeetingDate(meeting.date);
  const type =
    MEETING_TYPE_OPTIONS.find((option) => option.value === meeting.meetingType)?.label ??
    'Meeting';
  const title = `Program for ${date}`;
  const description = `${type} on ${date}. Presiding: ${meeting.presiding}. Conducting: ${meeting.conducting}. View the hymns, speakers, and ward business.`;

  return {
    title,
    description,
    openGraph: { title, description, images: [OG_IMAGE] },
  };
}

export default async function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const { id } = await params;

  // Only plain positive integers are valid ids ("abc", "1e3", "0x10" -> 404 page).
  if (!/^\d+$/.test(id) || Number(id) < 1 || Number(id) > MAX_INT4) {
    notFound();
  }

  const meeting = await getMeeting(Number(id));
  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}

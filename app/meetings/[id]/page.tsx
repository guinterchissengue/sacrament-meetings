import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getMeetingById } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

interface MeetingDetailPageProps {
  params: Promise<{ id: string }>;
}

async function fetchMeetingByIdFromApi(id: string): Promise<SacramentMeeting | null> {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return null;
  }

  try {
    const headersList = await headers();
    const host = headersList.get('host') ?? 'localhost:3000';
    const protocol =
      headersList.get('x-forwarded-proto') ??
      (host.includes('localhost') ? 'http' : 'https');

    const response = await fetch(`${protocol}://${host}/api/meetings/${numericId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data: SacramentMeeting = await response.json();
    return data;
  } catch {
    return getMeetingById(numericId);
  }
}

export default async function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const { id } = await params;
  const meeting = await fetchMeetingByIdFromApi(id);

  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}

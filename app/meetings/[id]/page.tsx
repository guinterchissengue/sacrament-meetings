import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getBaseUrl } from '@/lib/api';
import { getMeetingById } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

interface MeetingDetailPageProps {
  params: Promise<{ id: string }>;
}

async function fetchMeetingByIdFromApi(id: number): Promise<SacramentMeeting | null> {
  // Read headers outside the try/catch so Next.js can detect dynamic rendering.
  const baseUrl = await getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/meetings/${id}`, {
      cache: 'no-store',
    });
    if (response.status === 404 || response.status === 400) return null;
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    return (await response.json()) as SacramentMeeting;
  } catch (error) {
    console.error('Falling back to in-memory data:', error);
    return getMeetingById(id);
  }
}

export default async function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }

  const meeting = await fetchMeetingByIdFromApi(numericId);
  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}

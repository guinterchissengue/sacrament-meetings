import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getMeetingById } from '@/lib/meetings-db';

interface MeetingDetailPageProps {
  params: Promise<{ id: string }>;
}

const MAX_INT4 = 2_147_483_647; // SERIAL limit: larger ids would make PostgreSQL throw

export default async function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const { id } = await params;

  // Only plain positive integers are valid ids ("abc", "1e3", "0x10" -> 404 page).
  if (!/^\d+$/.test(id) || Number(id) < 1 || Number(id) > MAX_INT4) {
    notFound();
  }

  const meeting = await getMeetingById(Number(id));
  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}

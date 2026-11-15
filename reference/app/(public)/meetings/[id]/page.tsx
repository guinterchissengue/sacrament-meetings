import { notFound } from "next/navigation";
import { getMeetingById } from "@/lib/meetings-db";
import MeetingDetail from "@/components/MeetingDetail";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^\d+$/.test(id) || Number(id) < 1 || Number(id) > 2_147_483_647) {
    notFound();
  }

  const meeting = await getMeetingById(Number(id));
  if (!meeting) notFound();

  return <MeetingDetail meeting={meeting} />;
}

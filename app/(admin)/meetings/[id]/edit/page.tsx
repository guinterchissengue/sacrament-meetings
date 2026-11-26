import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MeetingForm from '@/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { meetingToFormValues } from '@/lib/meeting-form';
import { getMeetingById } from '@/lib/meetings-db';

const MAX_INT4 = 2_147_483_647; // SERIAL limit: larger ids would make PostgreSQL throw

export const metadata: Metadata = {
  title: 'Edit Meeting',
  description: 'Edit a sacrament meeting program.',
};

export default async function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Only plain positive integers are valid ids ("abc", "1e3", "0x10" -> not-found page).
  if (!/^\d+$/.test(id) || Number(id) < 1 || Number(id) > MAX_INT4) {
    notFound();
  }

  const meeting = await getMeetingById(Number(id));
  if (!meeting) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Meeting</h1>
        <p className="mt-1 text-slate-700">
          Update the program for meeting #{meeting.id}.
        </p>
      </div>

      <MeetingForm
        action={updateMeeting.bind(null, meeting.id)}
        initialValues={meetingToFormValues(meeting)}
        submitLabel="Save Changes"
      />
    </div>
  );
}

import type { Metadata } from 'next';
import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';

export const metadata: Metadata = {
  title: 'Create Meeting',
  description: 'Create a new sacrament meeting program.',
};

export default function NewMeetingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create Meeting</h1>
        <p className="mt-1 text-slate-700">
          Fill in the program for a new sacrament meeting.
        </p>
      </div>

      <MeetingForm action={createMeeting} submitLabel="Create Meeting" />
    </div>
  );
}

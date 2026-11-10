import Link from 'next/link';
import type { MeetingType, SacramentMeeting } from '@/lib/types';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

const badgeStyles: Record<MeetingType, { label: string; classes: string }> = {
  regular: {
    label: 'Regular Sacrament',
    classes: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  testimony: {
    label: 'Fast & Testimony',
    classes: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  stake: {
    label: 'Stake Conference (Non-Sacrament)',
    classes: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  general: {
    label: 'General Conference (Non-Sacrament)',
    classes: 'bg-purple-100 text-purple-900 border-purple-300',
  },
};

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const badge = badgeStyles[meeting.meetingType];
  const speakerCount = meeting.speakers.filter((s) => s.type === 'speaker').length;
  const musicCount = meeting.speakers.filter((s) => s.type === 'musical-number').length;

  return (
    <article className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span
            className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${badge.classes}`}
          >
            {badge.label}
          </span>
          <time
            dateTime={meeting.date}
            className="text-sm font-semibold text-slate-700"
          >
            {meeting.date}
          </time>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Sunday Service &mdash; {meeting.date}
        </h3>

        <dl className="text-sm text-slate-700 space-y-1 mb-4">
          <div className="flex justify-between">
            <dt className="font-semibold text-slate-800">Presiding:</dt>
            <dd>{meeting.presiding}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-semibold text-slate-800">Conducting:</dt>
            <dd>{meeting.conducting}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-semibold text-slate-800">Opening Hymn:</dt>
            <dd className="truncate max-w-[190px]" title={meeting.openingHymn.title}>
              #{meeting.openingHymn.number} {meeting.openingHymn.title}
            </dd>
          </div>
        </dl>

        <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-5 flex items-center justify-between">
          <span>
            <strong>{speakerCount}</strong> {speakerCount === 1 ? 'Speaker' : 'Speakers'}
          </span>
          <span>&bull;</span>
          <span>
            <strong>{musicCount}</strong> Musical {musicCount === 1 ? 'Number' : 'Numbers'}
          </span>
          <span>&bull;</span>
          <span>
            Stake Bus.: <strong>{meeting.stakeBusiness ? 'Yes' : 'No'}</strong>
          </span>
        </div>
      </div>

      <Link
        href={`/meetings/${meeting.id}`}
        aria-label={`View full program for ${meeting.date} (${badge.label})`}
        className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
      >
        View &amp; Print Program
      </Link>
    </article>
  );
}

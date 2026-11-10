'use client';

import Link from 'next/link';
import type { MeetingType, SacramentMeeting } from '@/lib/types';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

const typeDescriptions: Record<MeetingType, { title: string; isSacrament: boolean }> = {
  regular: { title: 'Regular Sacrament Meeting', isSacrament: true },
  testimony: { title: 'Fast & Testimony Sacrament Meeting', isSacrament: true },
  stake: { title: 'Stake Conference Session (Non-Sacrament Meeting)', isSacrament: false },
  general: { title: 'General Conference Session (Non-Sacrament Meeting)', isSacrament: false },
};

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const meetingMeta = typeDescriptions[meeting.meetingType];

  const handlePrint = () => {
    window.print();
  };

  return (
    <article className="max-w-3xl mx-auto">
      {/* Action Bar (hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
        <Link
          href="/meetings"
          className="inline-flex items-center text-sm font-semibold text-slate-800 hover:text-blue-800 bg-white border border-slate-300 px-3.5 py-2 rounded-lg shadow-xs transition-colors"
        >
          &larr; Back to All Meetings
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
        >
          <span>Print Program</span>
        </button>
      </div>

      {/* Printable Program Sheet */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-10 print:shadow-none print:border-none print:p-0">
        {/* Program Header */}
        <header className="text-center border-b-2 border-slate-800 pb-6 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-1">
            The Church of Jesus Christ of Latter-day Saints &bull; Maxixe Ward
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {meetingMeta.title}
          </h1>
          <p className="text-base font-semibold text-slate-800 mt-1">
            <time dateTime={meeting.date}>{meeting.date}</time>
          </p>

          <dl className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-800 max-w-lg mx-auto">
            <div>
              <dt className="inline font-bold">Presiding: </dt>
              <dd className="inline">{meeting.presiding}</dd>
            </div>
            <div>
              <dt className="inline font-bold">Conducting: </dt>
              <dd className="inline">{meeting.conducting}</dd>
            </div>
          </dl>
        </header>

        {/* Announcements */}
        <section aria-labelledby="announcements-heading" className="mb-6">
          <h2
            id="announcements-heading"
            className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-3"
          >
            Announcements
          </h2>
          {meeting.announcements && meeting.announcements.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-slate-800 space-y-1.5 bg-slate-50 p-4 rounded-lg border border-slate-200">
              {meeting.announcements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-700 italic">No announcements scheduled for this week.</p>
          )}
        </section>

        {/* Opening Exercises & Business */}
        <section aria-labelledby="opening-heading" className="mb-6 space-y-3">
          <h2
            id="opening-heading"
            className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5"
          >
            Opening Exercises &amp; Business
          </h2>

          <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-dotted border-slate-300 text-sm">
            <span className="font-bold text-slate-900">Opening Hymn</span>
            <span className="text-slate-800">
              #{meeting.openingHymn.number} &mdash; &ldquo;{meeting.openingHymn.title}&rdquo;
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-dotted border-slate-300 text-sm">
            <span className="font-bold text-slate-900">Invocation (Opening Prayer)</span>
            <span className="text-slate-800">{meeting.openingPrayer}</span>
          </div>

          <div className="py-2 border-b border-dotted border-slate-300 text-sm">
            <span className="font-bold text-slate-900 block mb-1">Ward Business</span>
            {meeting.wardBusiness.length > 0 ? (
              <ul className="list-disc list-inside text-slate-800 space-y-1 pl-1">
                {meeting.wardBusiness.map((wb, index) => (
                  <li key={index}>{wb.description}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-700 italic">None</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-dotted border-slate-300 text-sm">
            <span className="font-bold text-slate-900">Stake Business</span>
            <span className="text-slate-800 font-medium">
              {meeting.stakeBusiness ? 'Yes (Included in Agenda)' : 'No'}
            </span>
          </div>
        </section>

        {/* Sacrament Section */}
        <section aria-labelledby="sacrament-heading" className="mb-6 space-y-3">
          <h2
            id="sacrament-heading"
            className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5"
          >
            {meetingMeta.isSacrament ? 'Sacrament Ordinance' : 'Conference Devotional Hymn'}
          </h2>

          <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-dotted border-slate-300 text-sm">
            <span className="font-bold text-slate-900">Sacrament Hymn</span>
            <span className="text-slate-800">
              #{meeting.sacramentHymn.number} &mdash; &ldquo;{meeting.sacramentHymn.title}&rdquo;
            </span>
          </div>

          <div className="text-center py-2.5 px-4 bg-slate-100 rounded-md border border-slate-300 text-xs font-bold uppercase tracking-widest text-slate-800">
            {meetingMeta.isSacrament
              ? 'Administration of the Sacrament by the Priesthood'
              : `Note: ${meetingMeta.title} — Sacrament is not administered during this session`}
          </div>
        </section>

        {/* Speakers & Musical Numbers */}
        <section aria-labelledby="program-speakers-heading" className="mb-6 space-y-3">
          <h2
            id="program-speakers-heading"
            className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5"
          >
            Speakers &amp; Musical Numbers
          </h2>

          {meeting.speakers.length > 0 ? (
            <ol className="divide-y divide-dotted divide-slate-300">
              {meeting.speakers.map((item, idx) => (
                <li
                  key={idx}
                  className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm"
                >
                  <div>
                    <span className="font-bold text-slate-900">{item.name}</span>
                    {item.topic && (
                      <span className="text-slate-700 block text-xs sm:text-sm">
                        {item.type === 'musical-number' ? 'Selection: ' : 'Topic: '}
                        {item.topic}
                      </span>
                    )}
                  </div>
                  <span
                    className={`self-start sm:self-auto text-xs font-bold uppercase px-2.5 py-0.5 rounded border ${
                      item.type === 'musical-number'
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : 'bg-slate-100 text-slate-800 border-slate-300'
                    }`}
                  >
                    {item.type === 'musical-number' ? 'Musical Number' : 'Speaker'}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-700 italic">No speakers listed.</p>
          )}
        </section>

        {/* Closing Exercises */}
        <section aria-labelledby="closing-heading" className="space-y-3">
          <h2
            id="closing-heading"
            className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5"
          >
            Closing Exercises
          </h2>

          <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-dotted border-slate-300 text-sm">
            <span className="font-bold text-slate-900">Closing Hymn</span>
            <span className="text-slate-800">
              #{meeting.closingHymn.number} &mdash; &ldquo;{meeting.closingHymn.title}&rdquo;
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between py-2 text-sm">
            <span className="font-bold text-slate-900">Benediction (Closing Prayer)</span>
            <span className="text-slate-800">{meeting.closingPrayer}</span>
          </div>
        </section>
      </div>
    </article>
  );
}

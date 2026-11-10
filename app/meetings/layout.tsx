import Link from 'next/link';

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Sacrament Meetings &amp; Conference Agendas
          </h1>
          <p className="text-sm text-slate-700">
            Review weekly schedules, speakers, hymns, and printable Sunday bulletins.
          </p>
        </div>
        <nav aria-label="Meetings Section Navigation" className="flex flex-wrap gap-2">
          <Link
            href="/meetings"
            className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition-colors"
          >
            All Scheduled Meetings
          </Link>
          <Link
            href="/meetings/current"
            className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white transition-colors"
          >
            Jump to Current Sunday
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}

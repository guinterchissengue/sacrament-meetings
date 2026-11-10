import Link from 'next/link';
import { connection } from 'next/server';
import { getTodayISO, WARD_TIME_ZONE } from '@/lib/meetings-db';
import NavLinks from './NavLinks';

export default async function Header() {
  // Opt into request-time rendering so the date is today's, not the build date.
  await connection();
  const now = new Date();
  const currentDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: WARD_TIME_ZONE,
  });

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold tracking-tight text-white hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded"
          >
            Maxixe Ward Sacrament Planner
          </Link>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Inhambane Stake &bull; Weekly Agenda &amp; Program Directory
          </p>
        </div>
        <div className="text-xs sm:text-sm font-medium text-amber-200 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700 self-start sm:self-auto">
          <time dateTime={getTodayISO(now)}>
            {currentDate}
          </time>
        </div>
      </div>
      <NavLinks />
    </header>
  );
}

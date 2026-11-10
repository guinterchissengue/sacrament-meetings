import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10">
        <div className="lg:col-span-7 space-y-5">
          <span className="inline-block bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            WDD 430 &bull; Ward Leadership &amp; Member Portal
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Sacrament Meeting Planner &amp; Program Directory
          </h1>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
            Helping bishoprics and branch leaders organize reverent Sunday worship agendas while allowing ward members to view and print current and past programs.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/meetings/current"
              className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
            >
              View This Sunday&apos;s Program
            </Link>
            <Link
              href="/meetings"
              className="bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700"
            >
              Browse All Meetings
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Image
            src="/images/chapel-hero.png"
            alt="Illustration of a chapel sanctuary prepared for Sunday Sacrament Meeting"
            width={800}
            height={540}
            priority
            className="w-full h-auto rounded-xl border border-slate-200 shadow-sm"
          />
        </div>
      </section>

      {/* Feature Highlights */}
      <section aria-labelledby="features-heading" className="space-y-6">
        <h2 id="features-heading" className="text-2xl font-bold text-slate-900">
          Supported Meeting Formats &amp; Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-1">Regular &amp; Testimony</h3>
            <p className="text-sm text-slate-700">
              Full agendas with opening, sacrament, and closing hymns, prayers, ward business, speakers, and musical numbers.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-1">Stake &amp; General</h3>
            <p className="text-sm text-slate-700">
              Dedicated non-sacrament conference records tracking presiding authorities, stake business, and special sessions.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-1">Current Sunday Redirect</h3>
            <p className="text-sm text-slate-700">
              Instant one-click navigation that automatically resolves and opens the most recent Sunday&apos;s meeting program.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-1">Print-Ready Bulletin</h3>
            <p className="text-sm text-slate-700">
              Clean print stylesheet that hides navigation bars and formats any week&apos;s agenda into a crisp bulletin handout.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

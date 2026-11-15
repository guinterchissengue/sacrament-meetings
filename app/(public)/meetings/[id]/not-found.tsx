import Link from 'next/link';

export default function MeetingNotFound() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
      <h1 className="text-2xl font-bold">Meeting not found</h1>
      <p className="text-slate-700">
        We could not find a meeting with that ID.
      </p>
      <Link
        href="/meetings"
        className="inline-block bg-brand hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
      >
        Back to All Meetings
      </Link>
    </section>
  );
}

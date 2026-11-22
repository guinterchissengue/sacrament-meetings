import Link from 'next/link';

export default function EditMeetingNotFound() {
  return (
    <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="mb-3 text-2xl font-bold text-slate-900">
        Meeting not found
      </h2>

      <p className="mb-6 text-slate-600">
        We couldn&apos;t find the meeting you want to edit. It may have
        been deleted, or the link may be incorrect.
      </p>

      <Link
        href="/meetings"
        className="inline-block rounded-lg bg-brand px-5 py-2 font-semibold text-white hover:bg-brand-dark"
      >
        Back to Meetings
      </Link>
    </section>
  );
}

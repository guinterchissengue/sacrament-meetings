'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface MeetingsErrorViewProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Shared UI for the error.tsx files of the meetings routes.
 */
export default function MeetingsErrorView({
  error,
  reset,
}: MeetingsErrorViewProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      role="alert"
      className="mx-auto max-w-xl rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm"
    >
      <h2 className="mb-3 text-2xl font-bold text-slate-900">
        Something went wrong
      </h2>

      <p className="mb-6 text-slate-600">
        We couldn&apos;t complete that request. Your data is safe.
        Please try again, or go back to the list of meetings.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-brand px-5 py-2 font-semibold text-white hover:bg-brand-dark"
        >
          Try Again
        </button>

        <Link
          href="/meetings"
          className="rounded-lg border border-slate-300 px-5 py-2 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to Meetings
        </Link>
      </div>
    </section>
  );
}

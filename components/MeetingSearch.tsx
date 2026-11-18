'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // The URL is the source of truth: we read and write ?query= and ?page=.
  // The 300 ms debounce avoids a database round-trip on every keystroke.
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1'); // a new search always starts on page 1
    if (term.trim()) {
      params.set('query', term.trim());
    } else {
      params.delete('query');
    }

    const next = `${pathname}?${params.toString()}`;
    if (next !== `${pathname}?${searchParams.toString()}`) {
      // push (not replace) so the browser Back button returns to the previous search
      push(next, { scroll: false });
    }
  }, 300);

  // The input is uncontrolled (defaultValue), so when the user presses Back/Forward
  // we copy the query from the URL into the input to keep both in sync.
  useEffect(() => {
    const syncInputWithUrl = () => {
      if (inputRef.current) {
        inputRef.current.value =
          new URLSearchParams(window.location.search).get('query') ?? '';
      }
    };
    window.addEventListener('popstate', syncInputWithUrl);
    return () => window.removeEventListener('popstate', syncInputWithUrl);
  }, []);

  return (
    <div>
      <label htmlFor="meeting-search" className="sr-only">
        Search meetings
      </label>
      <input
        ref={inputRef}
        id="meeting-search"
        type="search"
        aria-label="Search meetings by speaker, presiding, conducting, or meeting type"
        placeholder="Search by speaker, presiding, conducting, or type..."
        defaultValue={searchParams.get('query') ?? ''}
        onChange={(event) => handleSearch(event.target.value)}
        className="w-full rounded-lg border border-slate-400 bg-white px-4 py-2.5 text-base text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-700"
      />
    </div>
  );
}

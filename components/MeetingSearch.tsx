"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // O URL é a fonte de verdade: lemos e escrevemos ?query= e ?page=.
  // Debounce de 300 ms evita uma consulta à BD por cada tecla.
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // uma pesquisa nova volta sempre à página 1
    if (term.trim()) {
      params.set("query", term.trim());
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="mb-6">
      <label htmlFor="meeting-search" className="sr-only">
        Search meetings
      </label>
      <input
        id="meeting-search"
        type="search"
        aria-label="Search meetings by speaker, presiding, conducting, or meeting type"
        placeholder="Search by speaker, presiding, conducting, or type..."
        defaultValue={searchParams.get("query") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full rounded-md border border-gray-400 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );
}

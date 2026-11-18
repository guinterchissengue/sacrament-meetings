"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  // Mantém o ?query= ativo e só muda o ?page=.
  const pageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  };

  const linkClass =
    "rounded-md border border-blue-700 px-4 py-2 font-medium text-blue-800 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600";
  const disabledClass =
    "rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-500";

  return (
    <nav aria-label="Meetings pagination" className="mt-8 flex items-center justify-center gap-4">
      {currentPage > 1 ? (
        <Link href={pageHref(currentPage - 1)} className={linkClass} rel="prev">
          Previous
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          Previous
        </span>
      )}

      <span aria-current="page" className="text-base font-semibold text-gray-900">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link href={pageHref(currentPage + 1)} className={linkClass} rel="next">
          Next
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          Next
        </span>
      )}
    </nav>
  );
}

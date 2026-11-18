// Skeleton mostrado enquanto a lista de reuniões carrega.
// Está dentro de (public)/meetings/, por isso só afeta estas rotas.
export default function MeetingsLoading() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading meetings">
      <div className="mb-6 h-9 w-72 animate-pulse rounded bg-gray-200" />
      <div className="mb-6 h-11 w-full animate-pulse rounded bg-gray-200" />
      <ul className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="h-24 animate-pulse rounded-md bg-gray-200" />
        ))}
      </ul>
      <span className="sr-only">Loading meetings...</span>
    </div>
  );
}

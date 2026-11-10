export default function MeetingsLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-20 space-y-4 bg-white rounded-xl border border-slate-200"
    >
      <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-brand animate-spin" />
      <p className="text-sm font-semibold text-slate-700">
        Loading sacrament meeting programs...
      </p>
    </div>
  );
}

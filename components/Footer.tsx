export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p className="font-medium text-white">
          Maxixe Ward &bull; Sacrament Meeting Planner
        </p>
        <p className="text-slate-300 text-center sm:text-right">
          &copy; {currentYear} WDD 430 Web Full-Stack Development. Designed for accessible viewing &amp; printing.
        </p>
      </div>
    </footer>
  );
}

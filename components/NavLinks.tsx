'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'All Meetings', href: '/meetings' },
  { label: "This Sunday's Program", href: '/meetings/current' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary Navigation"
      className="bg-slate-800 border-t border-slate-700/80"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap items-center gap-2 sm:gap-6">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : item.href === '/meetings'
              ? pathname === '/meetings'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`py-3 px-2 text-sm font-semibold border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                isActive
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-200 hover:text-white hover:border-slate-400'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

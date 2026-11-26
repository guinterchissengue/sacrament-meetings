import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { auth } from '@/auth';

// Pages for the bishopric only: they should not appear in search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Layout das rotas de liderança (admin).
// proxy.ts already redirects visitors with a callbackUrl; this check is the second
// line of defence if a request ever reaches the layout without a session.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <section aria-label="Admin area" className="mx-auto max-w-4xl px-4 py-8">
      {children}
    </section>
  );
}

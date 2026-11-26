import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to manage the Maxixe Ward sacrament meeting schedule.',
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ callbackUrl?: string | string[] }>;

/**
 * Auth.js sends the original address in ?callbackUrl=. Only the path and query are kept,
 * so a crafted link can never send the user to another website after signing in.
 */
function safeRedirectPath(raw?: string | string[]) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return '/meetings';

  try {
    const url = new URL(value, 'http://localhost');
    // Anything that is not a plain site path (e.g. "javascript:...") falls back to /meetings.
    if (!url.pathname.startsWith('/') || url.pathname === '/login') return '/meetings';
    return `${url.pathname}${url.search}`;
  } catch {
    return '/meetings';
  }
}

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const { callbackUrl } = await searchParams;

  return (
    <section aria-labelledby="login-heading" className="mx-auto max-w-md space-y-6">
      <div>
        <h1 id="login-heading" className="text-2xl font-bold text-slate-900">
          Bishopric sign in
        </h1>
        <p className="mt-1 text-slate-700">
          Sign in to create, edit, and delete sacrament meetings. Members can view
          every program without signing in.
        </p>
      </div>

      <LoginForm redirectTo={safeRedirectPath(callbackUrl)} />
    </section>
  );
}

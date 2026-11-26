'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/auth-actions';

const inputClass =
  'w-full rounded-lg border bg-white px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-700';

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, isPending] = useActionState(authenticate, undefined);
  const hasError = Boolean(state?.error);

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="redirectTo" value={redirectTo} />

      {/* Always rendered so screen readers announce the message when it appears */}
      <div id="login-error" role="alert" aria-live="polite">
        {state?.error && (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
            {state.error}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-800">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state?.email ?? ''}
          aria-invalid={hasError ? true : undefined}
          aria-describedby="login-error"
          className={`${inputClass} ${hasError ? 'border-red-600' : 'border-slate-300'}`}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-semibold text-slate-800">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={hasError ? true : undefined}
          aria-describedby="login-error"
          className={`${inputClass} ${hasError ? 'border-red-600' : 'border-slate-300'}`}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        aria-disabled={isPending}
        className="w-full rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

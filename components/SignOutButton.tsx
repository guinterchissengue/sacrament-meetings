import { signOutAction } from '@/lib/auth-actions';

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="rounded-md border border-slate-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-300 sm:text-sm"
      >
        Sign out
      </button>
    </form>
  );
}

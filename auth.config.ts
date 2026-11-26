import type { NextAuthConfig } from 'next-auth';

/** Pages only the bishopric may open: the meeting forms of the (admin) route group. */
function isProtectedPath(pathname: string) {
  return pathname === '/meetings/new' || /^\/meetings\/[^/]+\/edit\/?$/.test(pathname);
}

/**
 * Shared Auth.js configuration. It must NOT import the database or bcrypt:
 * proxy.ts uses this file, and only auth.ts adds the Credentials provider.
 */
export const authConfig = {
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 }, // sign in again after 8 hours
  callbacks: {
    // Runs in proxy.ts. Returning false sends the visitor to /login?callbackUrl=...
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);

      if (isProtectedPath(nextUrl.pathname)) {
        return isLoggedIn;
      }

      // A signed-in bishopric member has no reason to see the login form again.
      if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/meetings', nextUrl));
      }

      return true;
    },
  },
  providers: [], // added in auth.ts
} satisfies NextAuthConfig;

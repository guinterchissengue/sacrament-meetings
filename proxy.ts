import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Next.js 16 renamed middleware.ts to proxy.ts. Auth.js' `auth` is the default export
// and runs the `authorized` callback of auth.config.ts for the paths in `matcher`.
export default NextAuth(authConfig).auth;

export const config = {
  // Only these paths go through the proxy: the protected forms and the login page.
  matcher: ['/meetings/new', '/meetings/:id/edit', '/login'],
};

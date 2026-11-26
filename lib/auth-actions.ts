'use server';

import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';

export type LoginState = { error?: string; email?: string } | undefined;

/** Server Action for the login form (used with useActionState). */
export async function authenticate(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '');

  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        email,
        error:
          error.type === 'CredentialsSignin'
            ? 'Invalid email or password.'
            : 'Something went wrong. Please try again.',
      };
    }
    // signIn() redirects by throwing: any other error (including that redirect) must continue.
    throw error;
  }
}

/** Server Action for the "Sign out" button. */
export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}

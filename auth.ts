import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { authConfig } from './auth.config';
import { getUserByEmail } from '@/lib/users-db';

const CredentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

// Compared against when the e-mail does not exist, so the response time does not
// reveal which e-mails are registered.
let dummyHash: string | undefined;

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = CredentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await getUserByEmail(email);

        if (!user) {
          dummyHash ??= bcrypt.hashSync('not-a-real-password', 10);
          await bcrypt.compare(password, dummyHash);
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordsMatch) return null;

        // Never put the password hash in the session.
        return { id: String(user.id), name: user.name, email: user.email };
      },
    }),
  ],
});

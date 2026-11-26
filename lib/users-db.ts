import { db } from './meetings-db';

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
};

/** Finds a bishopric account by e-mail (case-insensitive). */
export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const sql = db();
  const rows = await sql`
    SELECT id, name, email, password_hash
    FROM users
    WHERE lower(email) = lower(${email})
    LIMIT 1`;

  const row = rows[0] as
    | { id: number; name: string; email: string; password_hash: string }
    | undefined;

  return row
    ? {
        id: row.id,
        name: row.name,
        email: row.email,
        passwordHash: row.password_hash,
      }
    : null;
}

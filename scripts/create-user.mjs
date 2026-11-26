// Creates (or updates the password of) a bishopric account.
//
//   node --env-file=.env scripts/create-user.mjs <email> <password> [name]
//
// The password is hashed with bcrypt before it is stored; it is never saved as plain text.
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const [email, password, name = 'Bishopric'] = process.argv.slice(2);

if (!email || !password) {
  console.error('Usage: node --env-file=.env scripts/create-user.mjs <email> <password> [name]');
  process.exit(1);
}
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  console.error('That does not look like a valid email address.');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Use a password with at least 8 characters.');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Run with: node --env-file=.env scripts/create-user.mjs ...');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const passwordHash = await bcrypt.hash(password, 10);

await sql`
  CREATE TABLE IF NOT EXISTS users (
    id            SERIAL        PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(255)  NOT NULL UNIQUE,
    password_hash TEXT          NOT NULL
  )`;

await sql`
  INSERT INTO users (name, email, password_hash)
  VALUES (${name}, ${email.toLowerCase()}, ${passwordHash})
  ON CONFLICT (email) DO UPDATE
    SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash`;

console.log(`User ${email.toLowerCase()} is ready. You can sign in at /login.`);

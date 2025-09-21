import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const { rows } = await sql<User>`
      SELECT
        id,
        email,
        name,
        password
      FROM users
      WHERE lower(email) = lower(${email})
      LIMIT 1;
    `;
    return rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return undefined;
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) return user;
        }
 
        console.log('Invalid credentials');
        return null;
        }
    }),
  ],
});
import { db } from '../drizzle/db.ts';
import { users } from '../drizzle/schema/index.ts';
import { and, eq } from 'drizzle-orm';
export async function login(
  username: string,
  password: string
) {
  const result = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.username, username),
        eq(users.password, password)
      )
    );

  return result[0] ?? null;
}
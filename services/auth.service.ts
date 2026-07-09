import { db } from '../drizzle/db';
import { users } from '../drizzle/schema/index';
import { and, eq } from 'drizzle-orm';
export async function login(
  username: string,
  password: string
) {
  const result = await db
    .select({
      id: users.id,
      username: users.username,
      role: users.role,
    })
    .from(users)
    .where(
      and(
        eq(users.username, username),
        eq(users.password, password)
      )
    );

  return result[0] ?? null;
}

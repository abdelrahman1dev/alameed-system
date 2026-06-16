import { db } from './../drizzle/db.ts';
import { users } from './../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function getAllUsers() {
  return await db.select().from(users);
}

export async function getUserById(id: number) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id));

  return result[0] ?? null;
}

export async function getUserByUsername(username: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  return result[0] ?? null;
}

export async function createUser(
  data: typeof users.$inferInsert
) {
  const result = await db
    .insert(users)
    .values(data)
    .returning();

  return result[0];
}

export async function updateUser(
  id: number,
  data: Partial<typeof users.$inferInsert>
) {
  const result = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();

  return result[0] ?? null;
}

export async function deleteUser(id: number) {
  const result = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning();

  return result[0] ?? null;
}
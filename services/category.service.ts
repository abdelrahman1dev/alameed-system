import { db } from './../drizzle/db.ts';
import { categories } from './../drizzle/schema/index.ts';
import { eq } from 'drizzle-orm';

export async function getAllCategories() {
  return await db.select().from(categories);
}

export async function getCategoryById(id: number) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id));

  return result[0] ?? null;
}

export async function createCategory(
  data: typeof categories.$inferInsert
) {
  const result = await db
    .insert(categories)
    .values(data)
    .returning();

  return result[0];
}

export async function updateCategory(
  id: number,
  data: Partial<typeof categories.$inferInsert>
) {
  const result = await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, id))
    .returning();

  return result[0] ?? null;
}

export async function deleteCategory(id: number) {
  const result = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning();

  return result[0] ?? null;
}
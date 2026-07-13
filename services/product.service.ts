import { db } from './../drizzle/db';
import { products } from './../drizzle/schema/index';
import { eq } from 'drizzle-orm';
import { exportToExcel } from "./export.service";

export async function getAllProducts() {
  return await db.select().from(products);
}

export async function getProductById(id: number) {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, id));

  return product[0] ?? null;
}



export async function getProductsByCat(id: number) {
  return await db
    .select()
    .from(products)
    .where(eq(products.categoryId, id));
}

export async function createProduct(
  data: typeof products.$inferInsert
) {
  const result = await db
    .insert(products)
    .values(data)
    .returning();

  return result[0];
}

export async function updateProduct(
  id: number,
  data: Partial<typeof products.$inferInsert>
) {
  const result = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();

  return result[0] ?? null;
}

export async function deleteProduct(id: number) {
  const result = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();

  return result[0] ?? null;
}

export async function exportProducts() {
  const data = await db.select().from(products);

  await exportToExcel(
    "Products",
    "Products",
    data,
  );
}
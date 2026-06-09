import { db } from './../drizzle/db';
import {
  sales,
  saleItems,
  products,
} from './../drizzle/schema';
import { eq, sql } from 'drizzle-orm';

export async function getAllSales() {
  return await db.select().from(sales);
}

export async function getSaleById(id: number) {
  const result = await db
    .select()
    .from(sales)
    .where(eq(sales.id, id));

  return result[0] ?? null;
}

export async function createSale(
  sale: typeof sales.$inferInsert,
  items: (typeof saleItems.$inferInsert)[]
) {
  return db.transaction(async (tx) => {
    const createdSale = await tx
      .insert(sales)
      .values(sale)
      .returning();

    const saleId = createdSale[0].id;

    for (const item of items) {
      const product = await tx
        .select()
        .from(products)
        .where(eq(products.id, item.productId));

      if (
        !product[0] ||
        product[0].quantity < item.quantity
      ) {
        throw new Error('Insufficient stock');
      }

      await tx.insert(saleItems).values({
        ...item,
        saleId,
      });

      await tx
        .update(products)
        .set({
          quantity: sql`${products.quantity} - ${item.quantity}`,
        })
        .where(eq(products.id, item.productId));
    }

    return createdSale[0];
  });
}
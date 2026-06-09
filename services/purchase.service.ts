import { db } from './../drizzle/db';
import {
  purchases,
  purchaseItems,
  products,
} from './../drizzle/schema';
import { eq, sql } from 'drizzle-orm';

export async function getAllPurchases() {
  return await db.select().from(purchases);
}

export async function getPurchaseById(id: number) {
  const result = await db
    .select()
    .from(purchases)
    .where(eq(purchases.id, id));

  return result[0] ?? null;
}

export async function createPurchase(
  purchase: typeof purchases.$inferInsert,
  items: (typeof purchaseItems.$inferInsert)[]
) {
  return db.transaction(async (tx) => {
    const createdPurchase = await tx
      .insert(purchases)
      .values(purchase)
      .returning();

    const purchaseId = createdPurchase[0].id;

    for (const item of items) {
      await tx.insert(purchaseItems).values({
        ...item,
        purchaseId,
      });

      await tx
        .update(products)
        .set({
          quantity: sql`${products.quantity} + ${item.quantity}`,
        })
        .where(eq(products.id, item.productId));
    }

    return createdPurchase[0];
  });
}
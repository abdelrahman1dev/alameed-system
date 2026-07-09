import { db } from "./../drizzle/db.ts";
import { sales, saleItems, products } from "./../drizzle/schema/index.ts";
import { eq, sql } from "drizzle-orm";

export async function getAllSales() {
  return await db.select().from(sales);
}

export async function getSaleById(id: number) {
  const result = await db.select().from(sales).where(eq(sales.id, id));

  return result[0] ?? null;
}

type CreateSaleItem = {
  productId: number;
  quantity: number;
};

export async function createSale(
  sale: typeof sales.$inferInsert,
  items: CreateSaleItem[],
) {
  return db.transaction(async (tx) => {
    const createdSale = await tx
      .insert(sales)
      .values({
        ...sale,
        soldAt: new Date().toISOString(),
      })
      .returning();

    const saleId = createdSale[0].id;

    for (const item of items) {
      const result = await tx
        .select()
        .from(products)
        .where(eq(products.id, item.productId));

      const currentProduct = result[0];

      if (!currentProduct) {
        throw new Error("Product not found");
      }

      if (currentProduct.quantity < item.quantity) {
        throw new Error("Insufficient stock");
      }

      await tx.insert(saleItems).values({
        saleId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: currentProduct.sellPrice,
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

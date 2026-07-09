import { sql } from "drizzle-orm";

import { db } from "../drizzle/db";
import { products, purchases, sales } from "../drizzle/schema/index";

export async function getDashboardStats() {
  const productCount = await db.select({ count: sql<number>`count(*)` }).from(products);
  const lowStockCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(sql`${products.quantity} <= 5`);
  const salesTotal = await db.select({ total: sql<number>`coalesce(sum(total_amount), 0)` }).from(sales);
  const purchasesTotal = await db.select({ total: sql<number>`coalesce(sum(total_amount), 0)` }).from(purchases);
  const recentSales = await db.select().from(sales).orderBy(sql`${sales.id} desc`).limit(5);
  const recentPurchases = await db.select().from(purchases).orderBy(sql`${purchases.id} desc`).limit(5);
  const lowStockProducts = await db
    .select()
    .from(products)
    .where(sql`${products.quantity} <= 5`)
    .orderBy(products.quantity)
    .limit(8);

  return {
    productCount: Number(productCount[0]?.count ?? 0),
    lowStockCount: Number(lowStockCount[0]?.count ?? 0),
    salesTotal: Number(salesTotal[0]?.total ?? 0),
    purchasesTotal: Number(purchasesTotal[0]?.total ?? 0),
    recentSales,
    recentPurchases,
    lowStockProducts,
  };
}

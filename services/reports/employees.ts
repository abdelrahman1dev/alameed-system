// Implement:
 // employee performance
 // join users -> sales/purchases by createdBy
import { eq, sql } from "drizzle-orm";
import { db } from "../../drizzle/db";
import {
  users,
  sales,
  purchases,
} from "../../drizzle/schema";

export async function getEmployeePerformance() {
  const employees = await db.select().from(users);

  const result = await Promise.all(
    employees.map(async (employee) => {
      const [salesData] = await db
        .select({
          count: sql<number>`count(*)`,
          total: sql<number>`coalesce(sum(${sales.totalAmount}),0)`,
        })
        .from(sales)
        .where(eq(sales.createdBy, employee.id));

      const [purchaseData] = await db
        .select({
          count: sql<number>`count(*)`,
          total: sql<number>`coalesce(sum(${purchases.totalAmount}),0)`,
        })
        .from(purchases)
        .where(eq(purchases.createdBy, employee.id));

      return {
        id: employee.id,

        username: employee.username,

        salesCount: Number(salesData.count),

        salesValue: Number(salesData.total),

        purchasesCount: Number(purchaseData.count),

        purchasesValue: Number(purchaseData.total),

        totalTransactions:
          Number(salesData.count) +
          Number(purchaseData.count),
      };
    }),
  );

  return result.sort(
    (a, b) =>
      b.salesValue - a.salesValue,
  );
}
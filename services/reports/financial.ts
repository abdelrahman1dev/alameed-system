// Implement:
 // totalSales
 // totalPurchases
 // grossProfit
 // inventoryValue
 // expectedProfit
 // monthly sales vs purchases grouped by strftime('%Y-%m', sold_at)


 import { and, gte, lte, sql } from "drizzle-orm";

import { db } from "../.././drizzle/db";
import {
  products,
  purchases,
  sales,
} from "../.././drizzle/schema";

export interface ReportFilters {
  from?: string;
  to?: string;
}

export interface FinancialSummary {
  productCount: number;
  lowStockCount: number;

  totalSales: number;
  totalPurchases: number;
  grossProfit: number;

  inventoryValue: number;
  expectedProfit: number;
}

export interface MonthlyFinancial {
  month: string;
  sales: number;
  purchases: number;
  profit: number;
}

function buildSalesFilter(filters: ReportFilters) {
  const conditions = [];

  if (filters.from) {
    conditions.push(gte(sales.soldAt, filters.from));
  }

  if (filters.to) {
    conditions.push(lte(sales.soldAt, filters.to));
  }

  return conditions.length ? and(...conditions) : undefined;
}

function buildPurchasesFilter(filters: ReportFilters) {
  const conditions = [];

  if (filters.from) {
    conditions.push(gte(purchases.purchasedAt, filters.from));
  }

  if (filters.to) {
    conditions.push(lte(purchases.purchasedAt, filters.to));
  }

  return conditions.length ? and(...conditions) : undefined;
}

export async function getFinancialSummary(
  filters: ReportFilters = {},
): Promise<FinancialSummary> {

  const [
    productCount,
    lowStockCount,
    salesResult,
    purchasesResult,
    inventoryResult,
  ] = await Promise.all([

    db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(products),

    db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(products)
      .where(lte(products.quantity, 5)),

    db
      .select({
        total: sql<number>`
          coalesce(sum(${sales.totalAmount}),0)
        `,
      })
      .from(sales)
      .where(buildSalesFilter(filters)),

    db
      .select({
        total: sql<number>`
          coalesce(sum(${purchases.totalAmount}),0)
        `,
      })
      .from(purchases)
      .where(buildPurchasesFilter(filters)),

    db
      .select({

        inventoryValue: sql<number>`
          coalesce(
            sum(
              ${products.quantity} *
              ${products.buyPrice}
            ),
          0)
        `,

        expectedProfit: sql<number>`
          coalesce(
            sum(
              ${products.quantity} *
              (
                ${products.sellPrice}
                -
                ${products.buyPrice}
              )
            ),
          0)
        `,
      })
      .from(products),

  ]);

  const totalSales =
    Number(salesResult[0]?.total ?? 0);

  const totalPurchases =
    Number(purchasesResult[0]?.total ?? 0);

  return {

    productCount:
      Number(productCount[0]?.count ?? 0),

    lowStockCount:
      Number(lowStockCount[0]?.count ?? 0),

    totalSales,

    totalPurchases,

    grossProfit:
      totalSales - totalPurchases,

    inventoryValue:
      Number(
        inventoryResult[0]?.inventoryValue ?? 0,
      ),

    expectedProfit:
      Number(
        inventoryResult[0]?.expectedProfit ?? 0,
      ),
  };
}

function monthLabel(value: string) {
  const date = new Date(`${value}-01`);

  return date.toLocaleDateString("ar-EG", {
    month: "short",
    year: "numeric",
  });
}

export async function getMonthlyChart(
  filters: ReportFilters = {},
): Promise<MonthlyFinancial[]> {

  const [salesRows, purchaseRows] = await Promise.all([

    db
      .select({

        month: sql<string>`
          strftime('%Y-%m', ${sales.soldAt})
        `,

        total: sql<number>`
          coalesce(sum(${sales.totalAmount}),0)
        `,
      })
      .from(sales)
      .where(buildSalesFilter(filters))
      .groupBy(
        sql`strftime('%Y-%m', ${sales.soldAt})`,
      )
      .orderBy(
        sql`strftime('%Y-%m', ${sales.soldAt})`,
      ),

    db
      .select({

        month: sql<string>`
          strftime('%Y-%m', ${purchases.purchasedAt})
        `,

        total: sql<number>`
          coalesce(sum(${purchases.totalAmount}),0)
        `,
      })
      .from(purchases)
      .where(buildPurchasesFilter(filters))
      .groupBy(
        sql`strftime('%Y-%m', ${purchases.purchasedAt})`,
      )
      .orderBy(
        sql`strftime('%Y-%m', ${purchases.purchasedAt})`,
      ),

  ]);

  const map = new Map<
    string,
    MonthlyFinancial
  >();

  for (const row of salesRows) {

    map.set(row.month, {

      month: monthLabel(row.month),

      sales: Number(row.total),

      purchases: 0,

      profit: Number(row.total),

    });

  }

  for (const row of purchaseRows) {

    const current = map.get(row.month);

    if (current) {

      current.purchases = Number(row.total);

      current.profit =
        current.sales - current.purchases;

    } else {

      map.set(row.month, {

        month: monthLabel(row.month),

        sales: 0,

        purchases: Number(row.total),

        profit: -Number(row.total),

      });

    }

  }

  return [...map.values()];
}
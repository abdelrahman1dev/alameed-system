import { desc, eq, sql } from "drizzle-orm";

import { db } from "../../drizzle/db";

import {
  purchases,
  purchaseItems,
  products,
  users,
} from "../../drizzle/schema";

export interface PurchaseSummary {

  invoices: number;

  totalPurchases: number;

  averageInvoice: number;

}

export interface SupplierReport {

  supplierName: string;

  invoices: number;

  totalAmount: number;

}

export interface PurchaseHistory {

  id: number;

  supplierName: string;

  employee: string | null;

  totalAmount: number;

  purchasedAt: string;

}

export async function getPurchaseSummary(): Promise<PurchaseSummary> {

  const [row] = await db

    .select({

      invoices:

        sql<number>`count(*)`,

      totalPurchases:

        sql<number>`

          coalesce(

            sum(${purchases.totalAmount}),

          0)

        `,

      averageInvoice:

        sql<number>`

          coalesce(

            avg(${purchases.totalAmount}),

          0)

        `,

    })

    .from(purchases);

  return {

    invoices:

      Number(row.invoices),

    totalPurchases:

      Number(row.totalPurchases),

    averageInvoice:

      Number(row.averageInvoice),

  };

}

export async function getSupplierReport() {

  const rows = await db

    .select({

      supplierName:

        purchases.supplierName,

      invoices:

        sql<number>`

          count(*)

        `,

      totalAmount:

        sql<number>`

          sum(${purchases.totalAmount})

        `,

    })

    .from(purchases)

    .groupBy(

      purchases.supplierName,

    )

    .orderBy(

      desc(

        sql`

          sum(${purchases.totalAmount})

        `,

      ),

    );

  return rows.map((row) => ({

    supplierName:

      row.supplierName,

    invoices:

      Number(row.invoices),

    totalAmount:

      Number(row.totalAmount),

  }));

}

export async function getRecentPurchases() {

  const rows = await db

    .select({

      id:

        purchases.id,

      supplierName:

        purchases.supplierName,

      totalAmount:

        purchases.totalAmount,

      purchasedAt:

        purchases.purchasedAt,

      employee:

        users.username,

    })

    .from(purchases)

    .leftJoin(

      users,

      eq(

        users.id,

        purchases.createdBy,

      ),

    )

    .orderBy(

      desc(

        purchases.purchasedAt,

      ),

    )

    .limit(15);

  return rows.map((row) => ({

    id:

      row.id,

    supplierName:

      row.supplierName,

    employee:

      row.employee,

    totalAmount:

      Number(row.totalAmount),

    purchasedAt:

      row.purchasedAt,

  }));

}

export async function getPurchaseHistory() {

  const rows = await db

    .select({

      id:

        purchases.id,

      supplierName:

        purchases.supplierName,

      totalAmount:

        purchases.totalAmount,

      purchasedAt:

        purchases.purchasedAt,

      employee:

        users.username,

    })

    .from(purchases)

    .leftJoin(

      users,

      eq(

        users.id,

        purchases.createdBy,

      ),

    )

    .orderBy(

      desc(

        purchases.purchasedAt,

      ),

    );

  return rows.map((row) => ({

    id:

      row.id,

    supplierName:

      row.supplierName,

    employee:

      row.employee,

    totalAmount:

      Number(row.totalAmount),

    purchasedAt:

      row.purchasedAt,

  }));

}

export interface TopPurchasedProduct {
  id: number;
  name: string;
  quantity: number;
  totalCost: number;
}

export async function getTopPurchasedProducts(): Promise<TopPurchasedProduct[]> {
  const rows = await db
    .select({
      id: products.id,

      name: products.name,

      quantity: sql<number>`
        coalesce(sum(${purchaseItems.quantity}), 0)
      `,

      totalCost: sql<number>`
        coalesce(
          sum(
            ${purchaseItems.quantity} *
            ${purchaseItems.unitPrice}
          ),
          0
        )
      `,
    })
    .from(purchaseItems)
    .innerJoin(
      products,
      eq(products.id, purchaseItems.productId),
    )
    .groupBy(products.id)
    .orderBy(
      desc(sql`sum(${purchaseItems.quantity})`),
    )
    .limit(10);

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    quantity: Number(row.quantity),
    totalCost: Number(row.totalCost),
  }));
}
import { desc, eq, sql } from "drizzle-orm";

import { db } from "../../drizzle/db";

import {
  products,
  sales,
  saleItems,
  users,
} from "../../drizzle/schema";

export interface BestSellingProduct {
  id: number;
  name: string;
  sold: number;
  revenue: number;
}

export interface CustomerReport {
  customerName: string;
  invoices: number;
  revenue: number;
}

export interface SaleHistory {
  id: number;

  customerName: string;

  employee: string | null;

  totalAmount: number;

  soldAt: string;
}

export interface SalesSummary {

  invoices: number;

  totalRevenue: number;

  averageInvoice: number;

}


export async function getSalesSummary(): Promise<SalesSummary> {

  const [row] = await db

    .select({

      invoices:

        sql<number>`count(*)`,

      totalRevenue:

        sql<number>`

          coalesce(

            sum(${sales.totalAmount}),

          0)

        `,

      averageInvoice:

        sql<number>`

          coalesce(

            avg(${sales.totalAmount}),

          0)

        `,

    })

    .from(sales);

  return {

    invoices:

      Number(row.invoices),

    totalRevenue:

      Number(row.totalRevenue),

    averageInvoice:

      Number(row.averageInvoice),

  };

}

export async function getBestSellingProducts() {

  const rows = await db

    .select({

      id: products.id,

      name: products.name,

      sold:

        sql<number>`

          coalesce(

            sum(${saleItems.quantity}),

          0)

        `,

      revenue:

        sql<number>`

          coalesce(

            sum(

              ${saleItems.quantity}

              *

              ${saleItems.unitPrice}

            ),

          0)

        `,

    })

    .from(saleItems)

    .innerJoin(

      products,

      eq(products.id, saleItems.productId),

    )

    .groupBy(products.id)

    .orderBy(

      desc(

        sql`

          sum(${saleItems.quantity})

        `,

      ),

    )

    .limit(10);

  return rows.map((row) => ({

    ...row,

    sold:

      Number(row.sold),

    revenue:

      Number(row.revenue),

  }));

}


export async function getCustomerReport() {

  const rows = await db

    .select({

      customerName:

        sql<string>`

          coalesce(

            ${sales.customerName},

            'عميل نقدي'

          )

        `,

      invoices:

        sql<number>`

          count(*)

        `,

      revenue:

        sql<number>`

          sum(${sales.totalAmount})

        `,

    })

    .from(sales)

    .groupBy(

      sales.customerName,

    )

    .orderBy(

      desc(

        sql`

          sum(${sales.totalAmount})

        `,

      ),

    );

  return rows.map((row) => ({

    customerName:

      row.customerName,

    invoices:

      Number(row.invoices),

    revenue:

      Number(row.revenue),

  }));

}

export async function getRecentSales() {

  const rows = await db

    .select({

      id: sales.id,

      customerName:

        sales.customerName,

      totalAmount:

        sales.totalAmount,

      soldAt:

        sales.soldAt,

      employee:

        users.username,

    })

    .from(sales)

    .leftJoin(

      users,

      eq(

        users.id,

        sales.createdBy,

      ),

    )

    .orderBy(

      desc(sales.soldAt),

    )

    .limit(15);

  return rows.map((row) => ({

    id:

      row.id,

    customerName:

      row.customerName ??

      "عميل نقدي",

    employee:

      row.employee,

    totalAmount:

      Number(row.totalAmount),

    soldAt:

      row.soldAt,

  }));

}

export async function getSalesHistory() {

  const rows = await db

    .select({

      id: sales.id,

      customerName:

        sales.customerName,

      totalAmount:

        sales.totalAmount,

      soldAt:

        sales.soldAt,

      employee:

        users.username,

    })

    .from(sales)

    .leftJoin(

      users,

      eq(

        users.id,

        sales.createdBy,

      ),

    )

    .orderBy(

      desc(sales.soldAt),

    );

  return rows.map((row) => ({

    id:

      row.id,

    customerName:

      row.customerName ??

      "عميل نقدي",

    employee:

      row.employee,

    totalAmount:

      Number(row.totalAmount),

    soldAt:

      row.soldAt,

  }));

}
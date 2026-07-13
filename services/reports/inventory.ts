// Implement:
 // inventory report
 // low stock
 // profitability
 // movement timeline (purchase_items + sale_items ordered by date)

 import {
  desc,
  eq,
  lte,
  sql,
} from "drizzle-orm";

import { db } from "../.././drizzle/db";

import {
  products,
  purchases,
  purchaseItems,
  sales,
  saleItems,
  users,
} from "../.././drizzle/schema";

export interface InventoryReport {

  id: number;

  name: string;

  quantity: number;

  buyPrice: number;

  sellPrice: number;

  inventoryValue: number;

  expectedProfit: number;

  status: "منخفض" | "متوسط" | "جيد";

}

export interface LowStockProduct {

  id: number;

  name: string;

  quantity: number;

}

export async function getInventoryReport() {

  const rows = await db

    .select({

      id: products.id,

      name: products.name,

      quantity: products.quantity,

      buyPrice: products.buyPrice,

      sellPrice: products.sellPrice,

      inventoryValue: sql<number>`

        ${products.quantity}

        *

        ${products.buyPrice}

      `,

      expectedProfit: sql<number>`

        ${products.quantity}

        *

        (

          ${products.sellPrice}

          -

          ${products.buyPrice}

        )

      `,

    })

    .from(products)

    .orderBy(products.name);

  return rows.map((row) => {

    let status:

      | "منخفض"

      | "متوسط"

      | "جيد";

    if (row.quantity <= 5)

      status = "منخفض";

    else if (row.quantity <= 20)

      status = "متوسط";

    else

      status = "جيد";

    return {

      ...row,

      inventoryValue:

        Number(row.inventoryValue),

      expectedProfit:

        Number(row.expectedProfit),

      status,

    };

  });

}
export async function getLowStockProducts() {

  return db

    .select({

      id: products.id,

      name: products.name,

      quantity: products.quantity,

    })

    .from(products)

    .where(

      lte(

        products.quantity,

        5,

      ),

    )

    .orderBy(

      products.quantity,

    );

}
export interface BestSellingProduct {
  id: number;
  name: string;
  sold: number;
  revenue: number;
}

export interface ProductProfitability {
  id: number;
  name: string;

  sold: number;

  revenue: number;

  estimatedCost: number;

  profit: number;

  margin: number;
}

export async function getBestSellingProducts() {

  const rows = await db

    .select({

      id: products.id,

      name: products.name,

      sold: sql<number>`

        coalesce(sum(${saleItems.quantity}),0)

      `,

      revenue: sql<number>`

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

    .groupBy(

      products.id,

    )

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

    sold: Number(row.sold),

    revenue: Number(row.revenue),

  }));

}
export async function getProductProfitability() {

  const rows = await db

    .select({

      id: products.id,

      name: products.name,

      buyPrice: products.buyPrice,

      sold: sql<number>`

        coalesce(

          sum(${saleItems.quantity}),

        0)

      `,

      revenue: sql<number>`

        coalesce(

          sum(

            ${saleItems.quantity}

            *

            ${saleItems.unitPrice}

          ),

        0)

      `,

    })

    .from(products)

    .leftJoin(

      saleItems,

      eq(products.id, saleItems.productId),

    )

    .groupBy(products.id);

  return rows.map((row) => {

    const sold = Number(row.sold);

    const revenue = Number(row.revenue);

    const estimatedCost =

      sold * Number(row.buyPrice);

    const profit =

      revenue - estimatedCost;

    const margin =

      revenue === 0

        ? 0

        : (profit / revenue) * 100;

    return {

      id: row.id,

      name: row.name,

      sold,

      revenue,

      estimatedCost,

      profit,

      margin,

    };

  })

  .sort(

    (a, b) =>

      b.profit - a.profit,

  );

}
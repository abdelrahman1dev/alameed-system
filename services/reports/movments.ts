import { desc, eq } from "drizzle-orm";

import { db } from "../../drizzle/db";

import {
  products,
  purchases,
  purchaseItems,
  sales,
  saleItems,
  users,
} from "../../drizzle/schema";

export type MovementType = "purchase" | "sale";

export interface InventoryMovement {
  id: string;

  type: MovementType;

  productId: number;

  productName: string;

  quantity: number;

  unitPrice: number;

  totalPrice: number;

  supplierOrCustomer: string;

  employee: string | null;

  date: string;
}

export async function getInventoryMovements() {

  const purchasesHistory = await db

    .select({

      id: purchaseItems.id,

      productId: products.id,

      productName: products.name,

      quantity: purchaseItems.quantity,

      unitPrice: purchaseItems.unitPrice,

      supplier: purchases.supplierName,

      employee: users.username,

      date: purchases.purchasedAt,

    })

    .from(purchaseItems)

    .innerJoin(
      products,
      eq(products.id, purchaseItems.productId),
    )

    .innerJoin(
      purchases,
      eq(purchases.id, purchaseItems.purchaseId),
    )

    .leftJoin(
      users,
      eq(users.id, purchases.createdBy),
    );

  const salesHistory = await db

    .select({

      id: saleItems.id,

      productId: products.id,

      productName: products.name,

      quantity: saleItems.quantity,

      unitPrice: saleItems.unitPrice,

      customer: sales.customerName,

      employee: users.username,

      date: sales.soldAt,

    })

    .from(saleItems)

    .innerJoin(
      products,
      eq(products.id, saleItems.productId),
    )

    .innerJoin(
      sales,
      eq(sales.id, saleItems.saleId),
    )

    .leftJoin(
      users,
      eq(users.id, sales.createdBy),
    );

  const movements: InventoryMovement[] = [

    ...purchasesHistory.map((row) => ({

      id: `purchase-${row.id}`,

      type: "purchase" as const,

      productId: row.productId,

      productName: row.productName,

      quantity: Number(row.quantity),

      unitPrice: Number(row.unitPrice),

      totalPrice:
        Number(row.quantity) *
        Number(row.unitPrice),

      supplierOrCustomer:
        row.supplier,

      employee:
        row.employee,

      date:
        row.date,

    })),

    ...salesHistory.map((row) => ({

      id: `sale-${row.id}`,

      type: "sale" as const,

      productId: row.productId,

      productName: row.productName,

      quantity: Number(row.quantity),

      unitPrice: Number(row.unitPrice),

      totalPrice:
        Number(row.quantity) *
        Number(row.unitPrice),

      supplierOrCustomer:
        row.customer ??
        "عميل نقدي",

      employee:
        row.employee,

      date:
        row.date,

    })),

  ];

  movements.sort(

    (a, b) =>

      new Date(b.date).getTime()

      -

      new Date(a.date).getTime(),

  );

  return movements;

}
import {
  sqliteTable,
  integer,
  real,
} from 'drizzle-orm/sqlite-core';

import { purchases } from './purchases';
import { products } from './products';

export const purchaseItems = sqliteTable('purchase_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  purchaseId: integer('purchase_id')
    .notNull()
    .references(() => purchases.id),

  productId: integer('product_id')
    .notNull()
    .references(() => products.id),

  quantity: integer('quantity').notNull(),

  unitPrice: real('unit_price').notNull(),
});
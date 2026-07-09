import {
  sqliteTable,
  integer,
  real,
} from 'drizzle-orm/sqlite-core';

import { sales } from './sales';
import { products } from './products';

export const saleItems = sqliteTable('sale_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  saleId: integer('sale_id')
    .notNull()
    .references(() => sales.id),

  productId: integer('product_id')
    .notNull()
    .references(() => products.id),

  quantity: integer('quantity').notNull(),

  unitPrice: real('unit_price').notNull(),
});

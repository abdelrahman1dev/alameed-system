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
    .references(() => sales.id , {
      onDelete: 'cascade',
    }),

  productId: integer('product_id')
    .notNull()
    .references(() => products.id , {
      onDelete: 'cascade',
    }),

  quantity: integer('quantity').notNull(),

  unitPrice: real('unit_price').notNull(),
});

import {
  sqliteTable,
  integer,
  text,
  real,
} from 'drizzle-orm/sqlite-core';

import { users } from './users.ts';

export const purchases = sqliteTable('purchases', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  supplierName: text('supplier_name').notNull(),

  totalAmount: real('total_amount')
    .notNull()
    .default(0),

  purchasedAt: text('purchased_at')
    .notNull()
    .default(new Date().toISOString()),

  createdBy: integer('created_by')
    .references(() => users.id),
});

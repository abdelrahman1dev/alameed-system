import {
  sqliteTable,
  integer,
  text,
  real,
} from 'drizzle-orm/sqlite-core';

import { users } from './users.ts';

export const sales = sqliteTable('sales', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  customerName: text('customer_name'),

  totalAmount: real('total_amount')
    .notNull()
    .default(0),

  soldAt: text('sold_at')
    .notNull()
    .default(new Date().toISOString()),

  createdBy: integer('created_by')
    .references(() => users.id),
});

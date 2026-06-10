import {
  sqliteTable,
  integer,
  text,
  real,
} from 'drizzle-orm/sqlite-core';

import { categories } from './categories.ts';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Basic info
  name: text('name').notNull(),
  sku: text('sku').notNull().unique(),
  barcode: text('barcode'),

  // Inventory
  quantity: integer('quantity').notNull().default(0),

  // Pricing
  buyPrice: real('buy_price').notNull(),
  sellPrice: real('sell_price').notNull(),

  // Product details
  brand: text('brand'),
  manufacturer: text('manufacturer'),

  // Compatibility
  carBrand: text('car_brand'), // Toyota
  carModel: text('car_model'), // Corolla



  position: text('position'), // Front / Rear / Left / Right

  // Part identifiers
  oemNumber: text('oem_number'),
  alternateNumber: text('alternate_number'),

  // Organization
  categoryId: integer('category_id')
    .references(() => categories.id),

  notes: text('notes'),
});
import { db } from './db.js';
import { products } from './schema/index.js';
import {eq} from 'drizzle-orm';
async function main() {
  // CREATE
  const created = await db.insert(products).values({
    name: 'Brake Pads',
    sku: 'BP-001',
    quantity: 10,
    buyPrice: 200,
    sellPrice: 300,
    brand: 'Bosch',
    carBrand: 'Toyota',
    carModel: 'Corolla',
  });

  console.log('Created:', created);

  // READ
  const allProducts = await db.select().from(products);

  console.log('Products:', allProducts);

  // UPDATE
  await db
    .update(products)
    .set({
      quantity: 25,
    })
    .where(eq(products.sku, 'BP-001'));

  console.log('Updated');

  // DELETE
  await db
    .delete(products)
    .where(eq(products.sku, 'BP-001'));

  console.log('Deleted');
}

main().catch(console.error);

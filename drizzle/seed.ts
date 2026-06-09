import { db } from './db';

import {
  categories,
  users,
  products,
} from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // Categories
  await db.insert(categories).values([
    { name: 'Brake System' },
    { name: 'Engine Parts' },
    { name: 'Suspension' },
    { name: 'Electrical' },
  ]);

  // Admin User
  await db.insert(users).values({
    username: 'admin',
    password: 'admin123', // hash later
    role: 'admin',
  });

  // Products
  await db.insert(products).values([
    {
      name: 'Front Brake Pads',
      sku: 'BP-001',
      quantity: 20,
      buyPrice: 250,
      sellPrice: 350,
      brand: 'Bosch',
      carBrand: 'Toyota',
      carModel: 'Corolla',
    },
    {
      name: 'Oil Filter',
      sku: 'OF-002',
      quantity: 40,
      buyPrice: 50,
      sellPrice: 80,
      brand: 'Mann',
      carBrand: 'Hyundai',
      carModel: 'Elantra',
    },
  ]);

  console.log('✅ Database seeded');
}

seed().catch(console.error);
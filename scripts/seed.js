// scripts/seed.js
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { users, customers, invoices, revenue } from '../app/lib/placeholder-data.js';

async function seedUsers(client) {
  // Extensión para gen_random_uuid()
  await client.sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const inserted = await Promise.all(
    users.map(async (u) => {
      const hashed = await bcrypt.hash(u.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${u.id}, ${u.name}, ${u.email}, ${hashed})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  console.log(`✅ Users: ${inserted.length} filas`);
}

async function seedCustomers(client) {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const inserted = await Promise.all(
    customers.map((c) => client.sql`
      INSERT INTO customers (id, name, email, image_url)
      VALUES (${c.id}, ${c.name}, ${c.email}, ${c.image_url})
      ON CONFLICT (id) DO NOTHING;
    `)
  );

  console.log(`✅ Customers: ${inserted.length} filas`);
}

async function seedInvoices(client) {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      customer_id UUID NOT NULL REFERENCES customers(id),
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const inserted = await Promise.all(
    invoices.map((inv) => client.sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${inv.customer_id}, ${inv.amount}, ${inv.status}, ${inv.date})
      ON CONFLICT (id) DO NOTHING;
    `)
  );

  console.log(`✅ Invoices: ${inserted.length} filas`);
}

async function seedRevenue(client) {
  await client.sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const inserted = await Promise.all(
    revenue.map((r) => client.sql`
      INSERT INTO revenue (month, revenue)
      VALUES (${r.month}, ${r.revenue})
      ON CONFLICT (month) DO NOTHING;
    `)
  );

  console.log(`✅ Revenue: ${inserted.length} filas`);
}

async function main() {
  const client = await db.connect();

  try {
    await seedUsers(client);
    await seedCustomers(client);
    await seedInvoices(client);
    await seedRevenue(client);
    console.log('🎉 Seed completado');
  } catch (err) {
    console.error('❌ Error en seed:', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();

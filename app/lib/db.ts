import { neon } from '@neondatabase/serverless';
import { menuItems as SEED_ITEMS } from '@/app/data/menu';

const sql = neon(process.env.DATABASE_URL!);
let initialized = false;

export async function initDB() {
  if (initialized) return;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id                    TEXT    PRIMARY KEY,
      order_number          TEXT    UNIQUE NOT NULL,
      status                TEXT    NOT NULL DEFAULT 'new',
      created_at            BIGINT  NOT NULL,
      customer_name         TEXT    NOT NULL,
      customer_phone        TEXT    NOT NULL,
      customer_neighborhood TEXT    NOT NULL,
      customer_address      TEXT    NOT NULL,
      customer_notes        TEXT,
      subtotal              NUMERIC NOT NULL,
      delivery_fee          NUMERIC NOT NULL,
      total                 NUMERIC NOT NULL,
      payment_method        TEXT    NOT NULL DEFAULT 'cash',
      items                 JSONB   NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id         TEXT    PRIMARY KEY,
      name       TEXT    NOT NULL,
      icon       TEXT    NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS menu_items (
      id          TEXT    PRIMARY KEY,
      name        TEXT    NOT NULL,
      name_ar     TEXT,
      description TEXT    NOT NULL,
      price       NUMERIC NOT NULL,
      category    TEXT    NOT NULL,
      image       TEXT    NOT NULL DEFAULT '',
      badge       TEXT,
      available   BOOLEAN NOT NULL DEFAULT true,
      sort_order  INTEGER NOT NULL DEFAULT 0
    )
  `;

  const catRows = await sql`SELECT COUNT(*)::int AS count FROM categories`;
  if (Number(catRows[0].count) === 0) {
    await sql`
      INSERT INTO categories (id, name, icon, sort_order) VALUES
        ('tajins',   'Tajins',   '🫕', 1),
        ('salads',   'Salades',  '🥗', 2),
        ('briwat',   'Briwat',   '🥟', 3),
        ('couscous', 'Couscous', '🍲', 4)
    `;
  }

  await Promise.all(
    SEED_ITEMS.map((item, i) =>
      sql`
        INSERT INTO menu_items (id, name, description, price, category, image, badge, available, sort_order)
        VALUES (
          ${item.id}, ${item.name}, ${item.description}, ${item.price},
          ${item.category}, ${item.image}, ${item.badge ?? null}, true, ${i}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          category = EXCLUDED.category,
          image = EXCLUDED.image,
          badge = EXCLUDED.badge,
          sort_order = EXCLUDED.sort_order
      `
    )
  );

  initialized = true;
}

export default sql;

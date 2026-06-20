import { neon } from '@neondatabase/serverless';

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
  initialized = true;
}

export default sql;

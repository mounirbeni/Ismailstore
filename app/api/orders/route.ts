/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import sql, { initDB } from '@/app/lib/db';
import { Order } from '@/app/types/order';
import { sendTelegramNotification, formatOrderMessage } from '@/app/lib/telegram';

function rowToOrder(r: any): Order {
  return {
    id: r.id,
    orderNumber: r.order_number,
    status: r.status,
    createdAt: Number(r.created_at),
    customer: {
      name: r.customer_name,
      phone: r.customer_phone,
      neighborhood: r.customer_neighborhood,
      address: r.customer_address,
      notes: r.customer_notes ?? '',
    },
    items: r.items,
    subtotal: Number(r.subtotal),
    deliveryFee: Number(r.delivery_fee),
    total: Number(r.total),
    paymentMethod: 'cash',
  };
}

export async function GET(request: NextRequest) {
  await initDB();
  const number = new URL(request.url).searchParams.get('number');
  if (number) {
    const rows = await sql`SELECT * FROM orders WHERE order_number = ${number.toUpperCase()} LIMIT 1`;
    return NextResponse.json(rows.length ? rowToOrder(rows[0]) : null);
  }
  const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
  return NextResponse.json(rows.map(rowToOrder));
}

export async function POST(request: NextRequest) {
  await initDB();
  const order: Order = await request.json();
  await sql`
    INSERT INTO orders (
      id, order_number, status, created_at,
      customer_name, customer_phone, customer_neighborhood, customer_address, customer_notes,
      subtotal, delivery_fee, total, payment_method, items
    ) VALUES (
      ${order.id}, ${order.orderNumber}, ${order.status}, ${order.createdAt},
      ${order.customer.name}, ${order.customer.phone}, ${order.customer.neighborhood},
      ${order.customer.address}, ${order.customer.notes || null},
      ${order.subtotal}, ${order.deliveryFee}, ${order.total}, ${order.paymentMethod},
      ${JSON.stringify(order.items)}
    )
  `;
  // Send Telegram notification (non-blocking)
  sendTelegramNotification(formatOrderMessage(order));

  return NextResponse.json({ success: true }, { status: 201 });
}

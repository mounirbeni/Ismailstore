/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import sql, { initDB } from '@/app/lib/db';

function rowToItem(r: any) {
  return {
    id: r.id,
    name: r.name,
    nameAr: r.name_ar ?? undefined,
    description: r.description,
    price: Number(r.price),
    category: r.category,
    image: r.image,
    badge: r.badge ?? undefined,
    available: r.available,
  };
}

export async function GET(request: NextRequest) {
  await initDB();
  const showAll = new URL(request.url).searchParams.get('all') === 'true';
  const items = showAll
    ? await sql`SELECT * FROM menu_items ORDER BY sort_order`
    : await sql`SELECT * FROM menu_items WHERE available = true ORDER BY sort_order`;
  const cats = await sql`SELECT * FROM categories ORDER BY sort_order`;
  const mappedItems = items.map(rowToItem);
  return NextResponse.json({
    items: mappedItems,
    categories: cats.map((c: any) => ({
      id: c.id, name: c.name, icon: c.icon,
      count: mappedItems.filter(i => i.category === c.id).length,
    })),
  });
}

export async function POST(request: NextRequest) {
  await initDB();
  const body = await request.json();
  const maxRows = await sql`SELECT COALESCE(MAX(sort_order), -1) AS max FROM menu_items`;
  const nextOrder = Number(maxRows[0].max) + 1;
  await sql`
    INSERT INTO menu_items (id, name, name_ar, description, price, category, image, badge, available, sort_order)
    VALUES (
      ${body.id ?? crypto.randomUUID()}, ${body.name}, ${body.nameAr ?? null},
      ${body.description}, ${body.price}, ${body.category},
      ${body.image ?? ''}, ${body.badge ?? null}, true, ${nextOrder}
    )
  `;
  return NextResponse.json({ success: true }, { status: 201 });
}

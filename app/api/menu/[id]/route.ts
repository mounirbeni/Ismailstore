import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  if ('available' in body) await sql`UPDATE menu_items SET available = ${body.available} WHERE id = ${id}`;
  if ('price' in body) await sql`UPDATE menu_items SET price = ${body.price} WHERE id = ${id}`;
  if ('name' in body) await sql`UPDATE menu_items SET name = ${body.name} WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await sql`DELETE FROM menu_items WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}

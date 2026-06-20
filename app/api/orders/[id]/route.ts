import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await request.json();
  await sql`UPDATE orders SET status = ${status} WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../login/route';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (verifyToken(token)) return NextResponse.json({ valid: true });
    return NextResponse.json({ valid: false }, { status: 401 });
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}

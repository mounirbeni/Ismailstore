import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/lib/db';

async function ensureSettingsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `;
}

export async function POST(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return NextResponse.json({ ok: false });

  const body = await request.json();
  const msg = body?.message;
  if (!msg) return NextResponse.json({ ok: true });

  const chatId = String(msg.chat?.id);
  const firstName = msg.chat?.first_name ?? 'Admin';

  await ensureSettingsTable();

  // Save the chat ID so notifications work even without env var
  await sql`
    INSERT INTO settings (key, value) VALUES ('telegram_chat_id', ${chatId})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;

  // Reply with confirmation
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text:
        `✅ <b>Dar Ismail bot activé!</b>\n\n` +
        `Bonjour ${firstName} 👋\n` +
        `Votre Chat ID est: <code>${chatId}</code>\n\n` +
        `Vous recevrez désormais une notification pour chaque nouvelle commande.`,
      parse_mode: 'HTML',
    }),
  });

  return NextResponse.json({ ok: true });
}

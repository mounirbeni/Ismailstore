import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/lib/db';

export async function GET(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not set' }, { status: 500 });
  }

  const host = request.headers.get('host') ?? '';
  const webhookUrl = `https://${host}/api/telegram/webhook`;

  // Register the webhook with Telegram
  const res = await fetch(
    `https://api.telegram.org/bot${token}/setWebhook`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl }),
    }
  );
  const data = await res.json();

  return NextResponse.json({
    webhook_registered: data.ok,
    webhook_url: webhookUrl,
    next_step: 'Now send any message to @Darismail_bot on Telegram. You will receive a confirmation reply with your Chat ID.',
  });
}

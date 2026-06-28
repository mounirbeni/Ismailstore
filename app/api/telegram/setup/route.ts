import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not set in environment variables' }, { status: 500 });
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
  const data = await res.json();

  if (!data.ok || !data.result?.length) {
    return NextResponse.json({
      instruction: 'No messages found. Please send /start to your bot first, then reload this page.',
      bot: 't.me/Darismail_bot',
    });
  }

  const update = data.result[data.result.length - 1];
  const chat = update.message?.chat ?? update.channel_post?.chat;

  return NextResponse.json({
    success: true,
    chat_id: chat?.id,
    chat_name: chat?.first_name ?? chat?.title ?? 'unknown',
    instruction: `Add TELEGRAM_CHAT_ID=${chat?.id} to your environment variables on Vercel.`,
  });
}

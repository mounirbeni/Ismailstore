import sql from './db';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function getChatId(): Promise<string | null> {
  // Prefer env var, fall back to value saved by the webhook
  if (process.env.TELEGRAM_CHAT_ID) return process.env.TELEGRAM_CHAT_ID;
  try {
    const rows = await sql`SELECT value FROM settings WHERE key = 'telegram_chat_id' LIMIT 1`;
    return rows[0]?.value ?? null;
  } catch {
    return null;
  }
}

export async function sendTelegramNotification(message: string): Promise<void> {
  if (!BOT_TOKEN) return;
  const chatId = await getChatId();
  if (!chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    });
  } catch {
    // Non-blocking — don't fail the order if Telegram is down
  }
}

export function formatOrderMessage(order: {
  orderNumber: string;
  customer: { name: string; phone: string; neighborhood: string; address: string; notes: string };
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}): string {
  const itemLines = order.items
    .map(i => `  • ${i.name} x${i.quantity} — ${(i.price * i.quantity).toFixed(0)} DH`)
    .join('\n');

  const notes = order.customer.notes ? `\n📝 Notes: ${order.customer.notes}` : '';

  return (
    `🔔 <b>Nouvelle commande #${order.orderNumber}</b>\n\n` +
    `👤 ${order.customer.name}\n` +
    `📞 ${order.customer.phone}\n` +
    `📍 ${order.customer.neighborhood} — ${order.customer.address}` +
    notes +
    `\n\n🧾 <b>Articles:</b>\n${itemLines}\n\n` +
    `💰 Sous-total: ${order.subtotal} DH\n` +
    `🚚 Livraison: ${order.deliveryFee} DH\n` +
    `✅ <b>Total: ${order.total} DH</b>`
  );
}

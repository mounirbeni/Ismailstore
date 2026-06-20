import { Order } from '@/app/types/order';

const KEY = 'dar_ismail_orders';

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(KEY, JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent('ordersUpdated'));
}

export function updateOrderStatus(id: string, status: Order['status']): void {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx !== -1) {
    orders[idx].status = status;
    localStorage.setItem(KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('ordersUpdated'));
  }
}

export function generateOrderNumber(): string {
  const t = new Date();
  const h = t.getHours().toString().padStart(2, '0');
  const m = t.getMinutes().toString().padStart(2, '0');
  const r = Math.floor(Math.random() * 99).toString().padStart(2, '0');
  return `DI-${h}${m}${r}`;
}

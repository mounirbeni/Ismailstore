'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getOrders, updateOrderStatus } from '@/app/lib/orders';
import { Order, OrderStatus } from '@/app/types/order';
import { LogOut, RefreshCw, Phone, MapPin, Clock, Bell, BellOff } from 'lucide-react';

async function requestNotificationPermission() {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}

function showOrderNotification(newCount: number) {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    new Notification('🫕 Dar Ismail — Nouvelle commande !', {
      body: `${newCount} nouvelle${newCount > 1 ? 's' : ''} commande${newCount > 1 ? 's' : ''} en attente`,
      icon: '/favicon.ico',
      tag: 'new-order',
    });
  }
}

function playNewOrderSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    for (let ring = 0; ring < 3; ring++) {
      const t0 = ctx.currentTime + ring * 1.1;
      [440, 480].forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t0);
        gain.gain.linearRampToValueAtTime(0.18, t0 + 0.05);
        gain.gain.setValueAtTime(0.18, t0 + 0.65);
        gain.gain.linearRampToValueAtTime(0, t0 + 0.75);
        osc.start(t0);
        osc.stop(t0 + 0.75);
      });
    }
  } catch {}
}

const ADMIN_PASSWORD = 'darIsmail123';

const STATUS_CONFIG: Record<OrderStatus, { label: string; textColor: string; bgColor: string; border: string }> = {
  new:        { label: '🔴 Nouveau',         textColor: 'text-orange-700', bgColor: 'bg-orange-100',  border: 'border-orange-400' },
  preparing:  { label: '🟡 En préparation',  textColor: 'text-yellow-700', bgColor: 'bg-yellow-100',  border: 'border-yellow-400' },
  on_the_way: { label: '🔵 En route',        textColor: 'text-blue-700',   bgColor: 'bg-blue-100',    border: 'border-blue-400' },
  delivered:  { label: '🟢 Livré',           textColor: 'text-green-700',  bgColor: 'bg-green-100',   border: 'border-green-400' },
  cancelled:  { label: '⚫ Annulé',          textColor: 'text-gray-500',   bgColor: 'bg-gray-100',    border: 'border-gray-300' },
};

const NEXT_STATUS: Partial<Record<OrderStatus, { status: OrderStatus; label: string; cls: string }>> = {
  new:        { status: 'preparing',  label: 'Commencer la préparation', cls: 'bg-yellow-500 hover:bg-yellow-600' },
  preparing:  { status: 'on_the_way', label: 'Envoyer en livraison',     cls: 'bg-blue-500 hover:bg-blue-600' },
  on_the_way: { status: 'delivered',  label: '✓ Marquer comme livré',    cls: 'bg-green-500 hover:bg-green-600' },
};

const categoryEmojis: Record<string, string> = {
  tajins: '🫕', salads: '🥗', briwat: '🥟', couscous: '🍲',
};

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 60000);
  if (diff < 1) return 'À l\'instant';
  if (diff < 60) return `il y a ${diff} min`;
  const h = Math.floor(diff / 60);
  return `il y a ${h}h`;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('adminAuthed') === '1') {
      setAuthed(true);
    }
  }, []);

  const [orders, setOrders] = useState<Order[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const prevNewCountRef = useRef(0);
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, [authed]);

  const loadOrders = useCallback(async () => {
    const fresh = await getOrders();
    setOrders(fresh);
    setLastRefresh(new Date());

    const currentNewCount = fresh.filter(o => o.status === 'new').length;
    if (!isFirstLoadRef.current && currentNewCount > prevNewCountRef.current) {
      showOrderNotification(currentNewCount);
      if (soundEnabled) playNewOrderSound();
    }
    prevNewCountRef.current = currentNewCount;
    isFirstLoadRef.current = false;
  }, [soundEnabled]);

  useEffect(() => {
    if (!authed) return;
    isFirstLoadRef.current = true;
    loadOrders();
    const interval = setInterval(loadOrders, 20000);
    window.addEventListener('ordersUpdated', loadOrders);
    return () => {
      clearInterval(interval);
      window.removeEventListener('ordersUpdated', loadOrders);
    };
  }, [authed, loadOrders]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuthed', '1');
      setAuthed(true);
      requestNotificationPermission();
    } else {
      setLoginError('Mot de passe incorrect');
    }
  }

  async function handleStatusUpdate(id: string, status: OrderStatus) {
    await updateOrderStatus(id, status);
    loadOrders();
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter(o => o.createdAt >= today.getTime());
  const activeCount = orders.filter(o => ['new', 'preparing', 'on_the_way'].includes(o.status)).length;
  const newCount = orders.filter(o => o.status === 'new').length;
  const todayRevenue = todayOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);

  const displayed = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  /* ─── Login screen ─── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">🫕</div>
            <h1 className="text-2xl font-black text-gray-900">Dar Ismail</h1>
            <p className="text-gray-500 text-sm mt-1">Espace administrateur</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                placeholder="Mot de passe"
                autoFocus
                className={`w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-colors ${
                  loginError ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-400'
                }`}
              />
              {loginError && <p className="text-red-500 text-xs mt-1">{loginError}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-colors"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ─── Admin dashboard ─── */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🫕</span>
            <div>
              <h1 className="font-black text-gray-900 leading-none">Dar Ismail</h1>
              <p className="text-gray-400 text-xs">Tableau de bord</p>
            </div>
            {newCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full animate-pulse">
                {newCount} nouveau{newCount > 1 ? 'x' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {notifPermission !== 'granted' && notifPermission !== 'denied' && (
              <button
                onClick={async () => {
                  await requestNotificationPermission();
                  if ('Notification' in window) setNotifPermission(Notification.permission);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
              >
                📲 Activer les notifications
              </button>
            )}
            {notifPermission === 'denied' && (
              <span className="text-xs text-gray-400 hidden sm:block">Notifications bloquées</span>
            )}
            <button
              onClick={() => setSoundEnabled(s => !s)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                soundEnabled ? 'bg-amber-100 hover:bg-amber-200' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title={soundEnabled ? 'Désactiver le son' : 'Activer le son'}
            >
              {soundEnabled
                ? <Bell className="w-4 h-4 text-amber-600" />
                : <BellOff className="w-4 h-4 text-gray-400" />
              }
            </button>
            <button
              onClick={loadOrders}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              title="Actualiser"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => { localStorage.removeItem('adminAuthed'); setAuthed(false); }}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <p className="text-3xl font-black text-orange-500">{activeCount}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">En cours</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <p className="text-3xl font-black text-gray-900">{todayOrders.length}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Aujourd'hui</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <p className="text-3xl font-black text-green-600">{todayRevenue}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">DH livrés</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {(['all', 'new', 'preparing', 'on_the_way', 'delivered', 'cancelled'] as const).map(f => {
            const count = f === 'all' ? orders.length : orders.filter(o => o.status === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  filter === f
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {f === 'all' ? `Toutes (${orders.length})` : `${STATUS_CONFIG[f].label} (${count})`}
              </button>
            );
          })}
        </div>

        {/* Orders list */}
        {displayed.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-900 font-semibold text-lg">Aucune commande</p>
            <p className="text-gray-400 text-sm mt-1">
              {filter === 'all'
                ? 'Les nouvelles commandes apparaîtront ici automatiquement'
                : `Aucune commande avec le statut sélectionné`}
            </p>
            {lastRefresh && (
              <p className="text-gray-300 text-xs mt-4">
                Actualisé à {lastRefresh.toLocaleTimeString('fr-MA')}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {lastRefresh && (
              <p className="text-xs text-gray-400 text-right">
                Actualisé à {lastRefresh.toLocaleTimeString('fr-MA')}
              </p>
            )}

            {displayed.map(order => {
              const nextAction = NEXT_STATUS[order.status];
              const cfg = STATUS_CONFIG[order.status];
              const isNew = order.status === 'new';

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden border-l-4 ${cfg.border} ${
                    isNew ? 'ring-2 ring-orange-200' : ''
                  }`}
                >
                  <div className="p-5">
                    {/* Order header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-gray-900 text-lg">{order.orderNumber}</h3>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${cfg.bgColor} ${cfg.textColor}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-gray-400 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{timeAgo(order.createdAt)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900 text-xl">{order.total} DH</p>
                        <p className="text-xs text-gray-400">💵 Espèces</p>
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{order.customer.name}</span>
                        <a
                          href={`tel:${order.customer.phone}`}
                          className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700"
                        >
                          <Phone className="w-3 h-3" />
                          {order.customer.phone}
                        </a>
                      </div>
                      <div className="flex items-start gap-1.5 text-xs text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{order.customer.neighborhood} — {order.customer.address}</span>
                      </div>
                      {order.customer.notes && (
                        <p className="text-xs text-gray-500">📝 {order.customer.notes}</p>
                      )}
                    </div>

                    {/* Items */}
                    <div className="space-y-1.5 mb-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-2 text-sm">
                          <span className="text-base">{categoryEmojis[item.category] ?? '🍽️'}</span>
                          <span className="flex-1 text-gray-700">{item.name}</span>
                          <span className="text-gray-400 text-xs">×{item.quantity}</span>
                          <span className="font-semibold text-gray-900 w-16 text-right">
                            {item.price * item.quantity} DH
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between text-xs text-gray-400 pt-1.5 border-t border-gray-100">
                        <span>Livraison</span>
                        <span>{order.deliveryFee} DH</span>
                      </div>
                    </div>

                    {/* Actions */}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <div className="flex gap-2">
                        {nextAction && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, nextAction.status)}
                            className={`flex-1 py-3 text-white rounded-xl font-bold text-sm transition-colors ${nextAction.cls}`}
                          >
                            {nextAction.label}
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                          className="px-4 py-3 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

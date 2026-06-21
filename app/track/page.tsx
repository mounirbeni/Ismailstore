'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, ChefHat, Bike, CheckCircle2, XCircle, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { getOrderByNumber } from '@/app/lib/orders';
import { Order } from '@/app/types/order';

const STEPS = [
  { status: 'new',        Icon: Package,     label: 'Commande reçue',  desc: 'Votre commande a bien été reçue par le restaurant' },
  { status: 'preparing',  Icon: ChefHat,      label: 'En préparation',  desc: 'Le chef prépare votre commande avec soin' },
  { status: 'on_the_way', Icon: Bike,         label: 'En route',         desc: 'Votre livreur est en chemin vers vous' },
  { status: 'delivered',  Icon: CheckCircle2, label: 'Livré !',          desc: 'Bon appétit !' },
];

const STATUS_ORDER = ['new', 'preparing', 'on_the_way', 'delivered'];
const categoryEmojis: Record<string, string> = { tajins: '🫕', salads: '🥗', briwat: '🥟', couscous: '🍲' };

function TrackContent() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function search(num?: string) {
    const query = (num ?? input).trim().toUpperCase();
    if (!query) return;
    setLoading(true);
    try {
      const found = await getOrderByNumber(query);
      if (found) { setOrder(found); setNotFound(false); } else { setOrder(null); setNotFound(true); }
      setSearched(true);
    } finally { setLoading(false); }
  }

  useEffect(() => {
    const param = searchParams.get('order');
    if (param) { const upper = param.toUpperCase(); setInput(upper); search(upper); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!order || order.status === 'delivered' || order.status === 'cancelled') return;
    const interval = setInterval(() => search(order.orderNumber), 10000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const currentStep = order?.status === 'cancelled' ? -1 : STATUS_ORDER.indexOf(order?.status ?? '');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"><ArrowLeft className="w-4 h-4 text-gray-600" /></Link>
          <div><h1 className="font-black text-gray-900 leading-none">Suivi de commande</h1><p className="text-gray-400 text-xs">Dar Ismail · Marrakech</p></div>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Numéro de commande</label>
          <div className="flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && search()} placeholder="Ex: DI-142537" className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-amber-400 transition-colors font-mono tracking-widest" />
            <button onClick={() => search()} disabled={loading} className="px-5 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2"><Search className="w-4 h-4" />{loading ? '...' : 'Chercher'}</button>
          </div>
        </div>
        {notFound && !order && (<div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100"><div className="text-4xl mb-3">🔍</div><p className="font-semibold text-gray-900">Commande introuvable</p><p className="text-gray-400 text-sm mt-1">Vérifiez votre numéro et réessayez</p></div>)}
        {order?.status === 'cancelled' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"><XCircle className="w-7 h-7 text-red-500" /></div>
              <div><p className="font-black text-gray-900 text-lg">Commande annulée</p><p className="text-red-500 font-mono font-bold">{order.orderNumber}</p></div>
            </div>
          </div>
        )}
        {order && order.status !== 'cancelled' && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div><p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Commande</p><p className="font-black text-amber-600 text-2xl font-mono">{order.orderNumber}</p></div>
                {order.status !== 'delivered' ? <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />En direct</div> : <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full font-semibold">✓ Livré</div>}
              </div>
              <div>
                {STEPS.map((step, idx) => {
                  const { Icon, label, desc } = step;
                  const isDone = idx < currentStep; const isActive = idx === currentStep; const isPending = idx > currentStep; const isLast = idx === STEPS.length - 1;
                  return (
                    <div key={step.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isDone ? 'bg-green-500' : isActive ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-gray-100'}`}><Icon className={`w-5 h-5 ${isDone || isActive ? 'text-white' : 'text-gray-400'}`} /></div>
                        {!isLast && <div className={`w-0.5 h-8 mt-1 rounded-full transition-all duration-500 ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />}
                      </div>
                      <div className={`pt-1.5 ${isLast ? 'pb-0' : 'pb-5'}`}>
                        <p className={`font-bold text-sm leading-none ${isPending ? 'text-gray-300' : 'text-gray-900'}`}>{label}</p>
                        {isActive && <p className="text-amber-600 text-xs mt-1">{desc}</p>}
                        {isDone && <p className="text-green-500 text-xs mt-1">✓ Complété</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
              {order.status === 'delivered' && (<div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"><span className="text-2xl">🎉</span><div><p className="font-bold text-green-800 text-sm">Commande livrée !</p><p className="text-green-600 text-xs">Merci pour votre confiance. Bon appétit !</p></div></div>)}
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm mb-4">Détails de la commande</h3>
              <div className="flex items-start gap-2 mb-4 text-sm"><MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" /><span className="text-gray-600">{order.customer.neighborhood} — {order.customer.address}</span></div>
              <div className="space-y-2">
                {order.items.map(item => (<div key={item.id} className="flex items-center gap-2 text-sm"><span className="text-base">{categoryEmojis[item.category] ?? '🍽️'}</span><span className="flex-1 text-gray-700">{item.name}</span><span className="text-gray-400 text-xs">×{item.quantity}</span><span className="font-semibold text-gray-900 w-16 text-right">{item.price * item.quantity} DH</span></div>))}
                <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-100"><span>Livraison</span><span>{order.deliveryFee} DH</span></div>
                <div className="flex justify-between font-bold text-gray-900 text-sm pt-1"><span>Total</span><span>{order.total} DH</span></div>
              </div>
            </div>
            {order.status !== 'delivered' && (<p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5"><Clock className="w-3 h-3" />Actualisation automatique toutes les 10 secondes</p>)}
          </>
        )}
        {!searched && (<div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100"><div className="text-6xl mb-4">📦</div><p className="font-bold text-gray-900 text-lg">Suivez votre commande</p><p className="text-gray-400 text-sm mt-2">Entrez votre numéro de commande<br />pour voir l&apos;état en temps réel</p></div>)}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return <Suspense><TrackContent /></Suspense>;
}

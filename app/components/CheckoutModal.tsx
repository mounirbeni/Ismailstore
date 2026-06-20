'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  X, ChevronRight, ChevronLeft, MapPin, User, Phone,
  CheckCircle, Clock, MessageCircle, Banknote, Package,
} from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { saveOrder, generateOrderNumber } from '@/app/lib/orders';
import { Order, CustomerInfo } from '@/app/types/order';

const NEIGHBORHOODS = [
  'Médina', 'Guéliz', 'Hivernage', 'Majorelle', "M'Hamid",
  'Massira', 'Daoudiate', 'Amerchich', 'Targa', 'Bab Doukkala',
  'Mellah', 'Hay Mohammadi', 'Sidi Ghanem', 'Palmeraie',
  'Annakhil', 'Route de Fès', "Route d'Ourika", 'Route de Casablanca',
];

const RESTAURANT_PHONE = '212600000000'; // Update with real number

const categoryEmojis: Record<string, string> = {
  tajins: '🫕', salads: '🥗', briwat: '🥟', couscous: '🍲',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: Props) {
  const { state, dispatch, totalPrice } = useCart();
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '', phone: '', neighborhood: '', address: '', notes: '',
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const deliveryFee = 15;
  const total = totalPrice + deliveryFee;

  function validateStep1() {
    const e: Partial<CustomerInfo> = {};
    if (!customer.name.trim()) e.name = 'Ce champ est requis';
    if (!customer.phone.trim()) e.phone = 'Ce champ est requis';
    else if (!/^(\+?212|0)[5-7][0-9]{8}$/.test(customer.phone.replace(/[\s-]/g, ''))) {
      e.phone = 'Numéro invalide (ex: 06XXXXXXXX)';
    }
    setErrors(e);
    return !Object.keys(e).length;
  }

  function validateStep2() {
    const e: Partial<CustomerInfo> = {};
    if (!customer.neighborhood) e.neighborhood = 'Veuillez choisir un quartier';
    if (!customer.address.trim()) e.address = 'Ce champ est requis';
    setErrors(e);
    return !Object.keys(e).length;
  }

  function handleNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(s => s + 1);
  }

  function handleBack() {
    setErrors({});
    setStep(s => s - 1);
  }

  function handleConfirmOrder() {
    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber: generateOrderNumber(),
      items: state.items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        category: i.category,
      })),
      customer,
      subtotal: totalPrice,
      deliveryFee,
      total,
      status: 'new',
      paymentMethod: 'cash',
      createdAt: Date.now(),
    };
    saveOrder(order);
    setPlacedOrder(order);
    dispatch({ type: 'CLEAR_CART' });
    setStep(4);
  }

  function buildWhatsAppUrl(order: Order): string {
    const items = order.items
      .map(i => `  • ${i.name} ×${i.quantity} — ${i.price * i.quantity} DH`)
      .join('\n');
    const msg = [
      '🍽️ *Nouvelle commande - Dar Ismail*',
      `📋 Commande N° *${order.orderNumber}*`,
      '',
      `👤 *Client:* ${order.customer.name}`,
      `📞 *Tél:* ${order.customer.phone}`,
      `📍 *Quartier:* ${order.customer.neighborhood}`,
      `🏠 *Adresse:* ${order.customer.address}`,
      order.customer.notes ? `📝 *Notes:* ${order.customer.notes}` : null,
      '',
      '*🛒 Commande:*',
      items,
      '',
      `📦 Livraison: ${order.deliveryFee} DH`,
      `💰 *Total: ${order.total} DH*`,
      '💵 Paiement à la livraison',
    ].filter(Boolean).join('\n');
    return `https://wa.me/${RESTAURANT_PHONE}?text=${encodeURIComponent(msg)}`;
  }

  function handleClose() {
    setStep(1);
    setCustomer({ name: '', phone: '', neighborhood: '', address: '', notes: '' });
    setErrors({});
    setPlacedOrder(null);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={step === 4 ? handleClose : undefined}
      />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[95vh]">

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              {step > 1 && step < 4 && (
                <button
                  onClick={handleBack}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
              )}
              <h2 className="font-bold text-gray-900 text-lg">
                {step === 1 && 'Vos coordonnées'}
                {step === 2 && 'Adresse de livraison'}
                {step === 3 && 'Récapitulatif'}
                {step === 4 && 'Commande confirmée !'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {step <= 3 && (
            <div className="px-6 pt-4 pb-0 flex-shrink-0">
              <div className="flex items-center gap-2 mb-1">
                {[1, 2, 3].map(s => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      s <= step ? 'bg-amber-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mb-3">Étape {step} sur 3</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-6 py-4">

            {step === 1 && (
              <div className="space-y-5">
                <div className="bg-amber-50 rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-2xl">🛵</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Livraison à Marrakech uniquement</p>
                    <p className="text-gray-500 text-xs">30–45 min · Paiement en espèces à la livraison</p>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 text-amber-500" />
                    Prénom & Nom
                  </label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))}
                    placeholder="Ex: Mohammed Alami"
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                      errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-400'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-amber-500" />
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))}
                    placeholder="06XXXXXXXX ou 07XXXXXXXX"
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                      errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-400'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    Quartier
                  </label>
                  <select
                    value={customer.neighborhood}
                    onChange={e => setCustomer(c => ({ ...c, neighborhood: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors appearance-none bg-white ${
                      errors.neighborhood ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-400'
                    }`}
                  >
                    <option value="">Choisir un quartier...</option>
                    {NEIGHBORHOODS.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  {errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse précise</label>
                  <textarea
                    value={customer.address}
                    onChange={e => setCustomer(c => ({ ...c, address: e.target.value }))}
                    placeholder="Rue, numéro, bâtiment, étage, appartement..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none ${
                      errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-400'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instructions supplémentaires{' '}
                    <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <textarea
                    value={customer.notes}
                    onChange={e => setCustomer(c => ({ ...c, notes: e.target.value }))}
                    placeholder="Code d'accès, sonnez à la porte, commentaires..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">{customer.name}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-600">{customer.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {customer.neighborhood} — {customer.address}
                    </span>
                  </div>
                  {customer.notes && (
                    <div className="flex items-start gap-2 text-sm text-gray-500">
                      <span>📝</span>
                      <span>{customer.notes}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-3">Votre commande</h3>
                  <div className="space-y-2">
                    {state.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <span className="text-xl">{categoryEmojis[item.category] ?? '🍽️'}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">×{item.quantity}</span>
                        <span className="font-semibold text-gray-900 text-sm w-16 text-right">
                          {item.price * item.quantity} DH
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Sous-total</span>
                    <span>{totalPrice} DH</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Frais de livraison</span>
                    <span>{deliveryFee} DH</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{total} DH</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4">
                  <Banknote className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-800 text-sm">Paiement à la livraison</p>
                    <p className="text-green-600 text-xs">Préparez {total} DH en espèces</p>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && placedOrder && (
              <div className="flex flex-col items-center text-center py-4 gap-5">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-11 h-11 text-green-500" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Merci {customer.name.split(' ')[0]} !
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">Votre commande est confirmée</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 w-full">
                  <p className="text-xs text-amber-600 uppercase tracking-wider font-semibold">N° de commande</p>
                  <p className="text-3xl font-black text-amber-700 mt-1">{placedOrder.orderNumber}</p>
                </div>

                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-2xl px-5 py-3 w-full">
                  <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="text-sm">
                    Livraison estimée: <strong>30–45 minutes</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 bg-green-50 rounded-2xl px-5 py-3 w-full">
                  <Banknote className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">
                    Préparez <strong>{placedOrder.total} DH</strong> à la livraison
                  </span>
                </div>

                <Link
                  href={`/track?order=${placedOrder.orderNumber}`}
                  onClick={handleClose}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-colors w-full justify-center"
                >
                  <Package className="w-5 h-5" />
                  Suivre ma commande
                </Link>

                <a
                  href={buildWhatsAppUrl(placedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3.5 rounded-2xl font-semibold text-sm transition-colors w-full justify-center"
                >
                  <MessageCircle className="w-5 h-5" />
                  Notifier via WhatsApp
                </a>

                <button
                  onClick={handleClose}
                  className="text-gray-400 font-semibold text-sm hover:text-gray-600 transition-colors"
                >
                  ← Retourner au menu
                </button>
              </div>
            )}
          </div>

          {step <= 3 && (
            <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  Continuer
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleConfirmOrder}
                  className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-200"
                >
                  <CheckCircle className="w-5 h-5" />
                  Confirmer la commande · {total} DH
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

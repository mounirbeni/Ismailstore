'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

const badgeConfig: Record<string, { label: string; className: string; icon: string }> = {
  popular:    { label: 'Populaire',  className: 'bg-amber-100 text-amber-700',  icon: '⭐' },
  new:        { label: 'Nouveau',    className: 'bg-blue-100 text-blue-700',    icon: '✨' },
  vegetarian: { label: 'Végétarien', className: 'bg-green-100 text-green-700',  icon: '🌿' },
  spicy:      { label: 'Épicé',      className: 'bg-red-100 text-red-700',      icon: '🌶️' },
};

const categoryGradients: Record<string, string> = {
  tajins:   'from-amber-400 to-orange-500',
  salads:   'from-green-400 to-emerald-500',
  briwat:   'from-yellow-400 to-amber-500',
  couscous: 'from-orange-400 to-red-500',
};

const categoryEmojis: Record<string, string> = {
  tajins:   '🫕',
  salads:   '🥗',
  briwat:   '🥟',
  couscous: '🍲',
};

export default function ProductModal() {
  const { state, dispatch } = useCart();
  const item = state.selectedProduct;
  const cartItem = item ? state.items.find(i => i.id === item.id) : null;
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (item) setQty(cartItem?.quantity ?? 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  function close() {
    dispatch({ type: 'SET_SELECTED_PRODUCT', payload: null });
  }

  function handleAdd() {
    if (!item) return;
    if (qty === 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: item.id });
    } else if (cartItem) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: qty } });
    } else {
      dispatch({ type: 'ADD_ITEM', payload: item });
      if (qty > 1) {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: qty } });
      }
    }
    close();
  }

  if (!item) return null;

  const badge = item.badge ? badgeConfig[item.badge] : null;
  const gradient = categoryGradients[item.category] ?? 'from-gray-400 to-gray-500';
  const emoji = categoryEmojis[item.category] ?? '🍽️';
  const totalPrice = qty * item.price;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={close}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center">
        <div className="w-full max-w-[430px] bg-white rounded-t-3xl shadow-2xl overflow-hidden">

          {/* Hero image */}
          <div className={`relative h-52 overflow-hidden ${!item.image ? `bg-gradient-to-br ${gradient} flex items-center justify-center` : ''}`}>
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-8xl drop-shadow-lg">{emoji}</span>
            )}
            <button
              onClick={close}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            {badge && (
              <span className={`absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${badge.className}`}>
                <span>{badge.icon}</span>
                {badge.label}
              </span>
            )}
          </div>

          {/* Handle */}
          <div className="flex justify-center pt-3 pb-0">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Content */}
          <div className="px-6 pt-4 pb-6">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="font-black text-gray-900 text-xl leading-tight flex-1">{item.name}</h2>
              <span className="text-amber-600 font-black text-xl whitespace-nowrap">{item.price} DH</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>

            <div className="h-px bg-gray-100 my-5" />

            {/* Quantity + CTA */}
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center bg-gray-100 rounded-2xl p-1 gap-1">
                <button
                  onClick={() => setQty(q => Math.max(0, q - 1))}
                  className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-700 active:scale-90 transition-transform"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-black text-gray-900 text-lg tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white active:scale-90 transition-transform"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add button */}
              <button
                onClick={handleAdd}
                className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-between px-4 ${
                  qty === 0
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                <span>
                  {qty === 0
                    ? 'Retirer du panier'
                    : cartItem
                    ? 'Modifier'
                    : 'Ajouter au panier'}
                </span>
                {qty > 0 && (
                  <span className="bg-white/25 px-2.5 py-0.5 rounded-lg text-sm font-black">
                    {totalPrice} DH
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

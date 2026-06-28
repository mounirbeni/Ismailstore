'use client';

import { X, Minus, Plus, ShoppingBag, Trash2, AlertCircle } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

const MIN_ORDER = 50;

const categoryEmojis: Record<string, string> = {
  tajins:   '🫕',
  salads:   '🥗',
  briwat:   '🥟',
  couscous: '🍲',
};

export default function CartDrawer() {
  const { state, dispatch, totalItems, totalPrice } = useCart();

  const total = totalPrice;
  const canCheckout = totalPrice >= MIN_ORDER;
  const remaining = MIN_ORDER - totalPrice;

  function openCheckout() {
    dispatch({ type: 'SET_CART_OPEN', payload: false });
    dispatch({ type: 'SET_CHECKOUT_OPEN', payload: true });
  }

  if (!state.isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
      />

      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center">
        <div className="w-full max-w-[430px] bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[88vh]">

          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="font-black text-gray-900 text-lg">Votre panier</h2>
              {totalItems > 0 && (
                <span className="bg-amber-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <button
              onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Restaurant banner */}
          <div className="mx-4 mb-1 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 flex-shrink-0">
            <span className="text-xl">🫕</span>
            <div>
              <p className="font-bold text-gray-900 text-sm">Dar Ismail</p>
              <p className="text-gray-400 text-xs">Livraison · Marrakech</p>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8 py-16">
                <div className="text-6xl">🛒</div>
                <p className="text-gray-900 font-bold text-lg">Panier vide</p>
                <p className="text-gray-400 text-sm">Ajoutez des plats depuis le menu</p>
                <button
                  onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
                  className="mt-1 px-6 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors"
                >
                  Voir le menu
                </button>
              </div>
            ) : (
              <div className="px-4 pt-2 pb-4 space-y-1">
                {state.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                    {/* Emoji thumb */}
                    <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-xl flex-shrink-0">
                      {categoryEmojis[item.category] ?? '🍽️'}
                    </div>

                    {/* Name + price */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm leading-snug truncate">{item.name}</p>
                      <p className="text-amber-600 font-black text-sm">{item.price} DH</p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 } })}
                        className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 active:scale-90 transition-transform"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-black text-gray-900 text-sm tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}
                        className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white active:scale-90 transition-transform"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="px-4 pb-6 pt-3 border-t border-gray-100 space-y-3 flex-shrink-0">
              {!canCheckout && (
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <p className="text-orange-700 text-xs font-medium">
                    Minimum 50 DH — encore <span className="font-black">{remaining} DH</span> à ajouter
                  </p>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Sous-total</span>
                  <span className="font-semibold text-gray-700">{totalPrice} DH</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Livraison</span>
                  <span className="font-semibold text-green-600">Gratuite 🎉</span>
                </div>
                <div className="flex justify-between font-black text-gray-900 text-base pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{total} DH</span>
                </div>
              </div>

              <button
                onClick={openCheckout}
                disabled={!canCheckout}
                className={`w-full py-4 rounded-2xl font-black text-base transition-all active:scale-95 ${
                  canCheckout
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {canCheckout
                  ? `Commander · ${totalPrice} DH`
                  : `Minimum 50 DH requis`}
              </button>

              <p className="text-center text-xs text-gray-400">💵 Paiement en espèces à la livraison</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

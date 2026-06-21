'use client';

import { X, Minus, Plus, ShoppingBag, Trash2, AlertCircle } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

const MIN_ORDER = 50;

export default function CartDrawer() {
  const { state, dispatch, totalItems, totalPrice } = useCart();

  const deliveryFee = 15;
  const total = totalPrice + deliveryFee;
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

      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="w-full max-w-[430px] bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] pointer-events-auto">

          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-lg text-gray-900">Votre panier</h2>
              {totalItems > 0 && (
                <span className="bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
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

          {/* Restaurant info */}
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-3 flex-shrink-0">
            <span className="text-2xl">🫕</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Dar Ismail</p>
              <p className="text-gray-500 text-xs">Livraison Marrakech · 30–60 min</p>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8 py-12">
                <div className="text-6xl">🛒</div>
                <p className="text-gray-900 font-semibold text-lg">Panier vide</p>
                <p className="text-gray-400 text-sm">Ajoutez des plats depuis le menu</p>
                <button
                  onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
                  className="mt-2 px-6 py-2.5 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors"
                >
                  Voir le menu
                </button>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {state.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl flex-shrink-0">
                      {item.category === 'tajins' ? '🫕'
                        : item.category === 'salads' ? '🥗'
                        : item.category === 'briwat' ? '🥟'
                        : '🍲'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                      <p className="text-amber-600 font-bold text-sm">{item.price} DH</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 } })
                        }
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}
                        className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white hover:bg-amber-600 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary & Checkout */}
          {state.items.length > 0 && (
            <div className="p-5 border-t border-gray-100 space-y-4 flex-shrink-0">
              {!canCheckout && (
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <p className="text-orange-700 text-xs font-medium">
                    Minimum 50 DH — ajoutez encore{' '}
                    <span className="font-bold">{remaining} DH</span> pour commander
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Sous-total</span>
                  <span>{totalPrice} DH</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Livraison</span>
                  <span className="text-green-500 font-medium">{deliveryFee} DH</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                  <span>Total estimé</span>
                  <span>{total} DH</span>
                </div>
              </div>

              <button
                onClick={openCheckout}
                disabled={!canCheckout}
                className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95 ${
                  canCheckout
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-200'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {canCheckout ? `Commander · ${total} DH` : `Minimum 50 DH requis`}
              </button>
              <p className="text-center text-xs text-gray-400">💵 Paiement en espèces à la livraison</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

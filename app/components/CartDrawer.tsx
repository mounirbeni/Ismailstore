'use client';

import { X, Minus, Plus, ShoppingBag, Trash2, CheckCircle } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useState } from 'react';

export default function CartDrawer() {
  const { state, dispatch, totalItems, totalPrice } = useCart();
  const [ordered, setOrdered] = useState(false);

  const deliveryFee = totalPrice > 0 ? 15 : 0;
  const total = totalPrice + deliveryFee;

  function handleOrder() {
    setOrdered(true);
    setTimeout(() => {
      dispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'SET_CART_OPEN', payload: false });
      setOrdered(false);
    }, 2500);
  }

  if (!state.isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-lg text-gray-900">Your Order</h2>
            {totalItems > 0 && (
              <span className="bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>
            )}
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-3">
          <span className="text-2xl">🫕</span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Dar Ismail</p>
            <p className="text-gray-500 text-xs">Delivery: 25-40 min</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <div className="text-6xl">🛒</div>
              <p className="text-gray-900 font-semibold text-lg">Your cart is empty</p>
              <p className="text-gray-400 text-sm">Add items from the menu to get started</p>
              <button
                onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
                className="mt-2 px-6 py-2.5 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {state.items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl flex-shrink-0">
                    {item.category === 'tajins' ? '🫕' : item.category === 'salads' ? '🥗' : item.category === 'briwat' ? '🥟' : '🍲'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-amber-600 font-bold text-sm">{item.price} DH</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 } })}
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
        {state.items.length > 0 && (
          <div className="p-5 border-t border-gray-100 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>{totalPrice} DH</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery fee</span><span className="text-green-500 font-medium">{deliveryFee} DH</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>Total</span><span>{total} DH</span>
              </div>
            </div>
            <button
              onClick={handleOrder}
              disabled={ordered}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
                ordered ? 'bg-green-500 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95 shadow-lg shadow-amber-200'
              }`}
            >
              {ordered ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Order Placed!
                </span>
              ) : (
                `Place Order · ${total} DH`
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

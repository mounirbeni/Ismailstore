'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

export default function CartButton() {
  const { dispatch, totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pb-6 pointer-events-none flex justify-center">
      <div className="w-full max-w-[430px] px-4 pointer-events-auto">
        <button
          onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: true })}
          className="w-full flex items-center justify-between gap-4 bg-amber-500 hover:bg-amber-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-amber-300/50 transition-all active:scale-95 font-bold"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-white text-amber-600 text-xs font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </div>
            <span>Voir le panier</span>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-xl text-sm">{totalPrice} DH</span>
        </button>
      </div>
    </div>
  );
}

'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useEffect, useRef, useState } from 'react';

export default function CartButton() {
  const { dispatch, totalItems, totalPrice } = useCart();
  const prevItems = useRef(totalItems);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (totalItems > prevItems.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 400);
      prevItems.current = totalItems;
      return () => clearTimeout(t);
    }
    prevItems.current = totalItems;
  }, [totalItems]);

  if (totalItems === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 pb-5 pointer-events-none flex justify-center">
      <div className="w-full max-w-[430px] px-4 pointer-events-auto">
        <button
          onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: true })}
          className={`w-full flex items-center justify-between gap-4 bg-amber-500 hover:bg-amber-600 text-white px-5 py-4 rounded-2xl shadow-2xl shadow-amber-300/60 font-black transition-all active:scale-95 ${
            bump ? 'scale-105' : 'scale-100'
          }`}
          style={{ transition: bump ? 'transform 0.15s ease-out' : 'transform 0.25s ease-in' }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-white text-amber-600 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </div>
            <span>Voir le panier</span>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-xl text-sm font-black">{totalPrice} DH</span>
        </button>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { X, Truck, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'free-delivery-banner-dismissed';

export default function FreeDeliveryBanner() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, '1');
    }, 300);
  }

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-24 left-0 right-0 z-[60] flex justify-center px-4 transition-all duration-300 ease-out ${
        closing ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="w-full max-w-[400px] bg-green-500 text-white rounded-2xl shadow-2xl shadow-green-500/50 flex items-center gap-3 px-4 py-3.5">
        {/* Truck icon with ping ring */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Truck className="w-5 h-5 text-white animate-bounce" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-80" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-400" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span className="text-[10px] font-bold text-green-100 uppercase tracking-wide">Offre limitée</span>
          </div>
          <p className="font-black text-white text-sm leading-tight">
            Livraison gratuite sur toutes les commandes !
          </p>
        </div>

        <button
          onClick={dismiss}
          className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center flex-shrink-0 transition-colors active:scale-90"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

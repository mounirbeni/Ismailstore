'use client';

import { Star, Package, MapPin, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const OPEN_H = 10, OPEN_M = 30, CLOSE_H = 21, CLOSE_M = 30;

function checkOpen(): boolean {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Casablanca', hour: 'numeric', minute: 'numeric', hour12: false,
  }).formatToParts(new Date());
  const h = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0');
  const m = parseInt(parts.find(p => p.type === 'minute')?.value ?? '0');
  const t = h * 60 + m;
  return t >= OPEN_H * 60 + OPEN_M && t < CLOSE_H * 60 + CLOSE_M;
}

export default function DesktopHeader() {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    setOpen(checkOpen());
    const id = setInterval(() => setOpen(checkOpen()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center gap-5 sticky top-0 z-50 shadow-sm">
      {/* Logo + name */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md shadow-amber-200 flex-shrink-0">
          <img src="/images/profile.jpg" alt="Dar Ismail" className="w-full h-full object-cover object-top" />
        </div>
        <div>
          <h1 className="font-black text-gray-900 text-xl leading-none">Dar Ismail</h1>
          <p className="text-gray-400 text-xs mt-0.5">Cuisine marocaine · Marrakech</p>
        </div>
      </div>

      <div className="h-8 w-px bg-gray-100 flex-shrink-0" />

      {/* Stats row */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="font-bold text-gray-800">4.8</span>
          <span className="text-gray-400 text-xs">(312)</span>
        </div>
        <span className="text-gray-200">·</span>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span>Marrakech</span>
        </div>
        <span className="text-gray-200">·</span>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-green-500" />
          <span className="text-green-600 font-semibold">Livraison gratuite 🎉</span>
        </div>
        <span className="text-gray-200">·</span>
        <span>Min. 50 DH</span>
      </div>

      <div className="flex-1" />

      {/* Open/closed */}
      <div className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold flex-shrink-0 ${open ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        {open ? 'Ouvert · 10h30–21h30' : 'Fermé · Ouvre à 10h30'}
      </div>

      {/* Track */}
      <Link
        href="/track"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-bold hover:bg-amber-100 transition-colors flex-shrink-0"
      >
        <Package className="w-4 h-4" />
        Suivre ma commande
      </Link>
    </header>
  );
}

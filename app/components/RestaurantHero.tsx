'use client';

import { Clock, Star, MapPin, Heart, Package, ChevronRight, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const OPEN_H = 10, OPEN_M = 30;
const CLOSE_H = 21, CLOSE_M = 30;

function getMoroccoMinutes(): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Casablanca',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(new Date());
  const h = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0');
  const m = parseInt(parts.find(p => p.type === 'minute')?.value ?? '0');
  return h * 60 + m;
}

function checkOpen(): boolean {
  const t = getMoroccoMinutes();
  return t >= OPEN_H * 60 + OPEN_M && t < CLOSE_H * 60 + CLOSE_M;
}

export default function RestaurantHero() {
  const [liked, setLiked] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(checkOpen());
    const id = setInterval(() => setOpen(checkOpen()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative bg-white">
      {/* ── Banner ──────────────────────────────────────────────────────── */}
      <div
        className="w-full h-56 relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #431407 0%, #7c2d12 25%, #b45309 60%, #f59e0b 100%)' }}
      >
        {/* Moroccan hexagon pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpolygon points='30,3 54,16 54,44 30,57 6,44 6,16' fill='none' stroke='white' stroke-width='1.5'/%3E%3Ccircle cx='30' cy='30' r='7' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Decorative floating emojis */}
        <span className="absolute top-8 left-5 text-5xl opacity-[0.14] rotate-[-15deg] select-none pointer-events-none">🫕</span>
        <span className="absolute bottom-10 right-5 text-4xl opacity-[0.14] rotate-[12deg] select-none pointer-events-none">🥘</span>
        <span className="absolute top-5 right-14 text-3xl opacity-[0.10] select-none pointer-events-none">🌿</span>
        <span className="absolute bottom-6 left-14 text-2xl opacity-[0.10] select-none pointer-events-none">✨</span>
        <span className="absolute inset-0 flex items-center justify-center text-[130px] opacity-[0.07] select-none pointer-events-none">🫕</span>

        {/* Bottom scrim */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Top nav */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-1 bg-black/25 backdrop-blur-sm rounded-full px-3 py-1.5">
            <span className="text-white/70 text-xs">Accueil</span>
            <ChevronRight className="w-3 h-3 text-white/50" />
            <span className="text-white font-bold text-xs">Dar Ismail</span>
          </div>
          <button
            onClick={() => setLiked(!liked)}
            className="w-9 h-9 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-90"
          >
            <Heart className={`w-5 h-5 transition-all duration-200 ${liked ? 'text-red-400 fill-red-400 scale-110' : 'text-white'}`} />
          </button>
        </div>

        {/* Banner badges */}
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          {open ? (
            <span className="flex items-center gap-1.5 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-green-900/30">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Ouvert maintenant
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              Fermé · Ouvre à 10h30
            </span>
          )}
          <span className="flex items-center gap-1 bg-amber-500/85 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
            <Zap className="w-3 h-3" />
            Livraison rapide
          </span>
        </div>
      </div>

      {/* ── Info card ───────────────────────────────────────────────────── */}
      <div className="mx-3 -mt-5 bg-white rounded-3xl shadow-2xl shadow-black/10 border border-gray-100 p-4 relative z-10">

        {/* Logo + name */}
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-[68px] h-[68px] rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center text-3xl shadow-xl shadow-amber-300/50 border-4 border-white -mt-9">
              🫕
            </div>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${open ? 'bg-green-400' : 'bg-gray-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-white ${open ? 'animate-pulse' : 'opacity-60'}`} />
            </div>
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-gray-900 leading-tight">Dar Ismail</h1>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase tracking-wide">Halal</span>
            </div>
            <p className="text-gray-400 text-xs mt-0.5">Cuisine marocaine authentique · Marrakech</p>

            {/* Stat pills */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <div className="flex items-center gap-1 bg-amber-50 rounded-lg px-2 py-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="font-black text-gray-800 text-xs">4.8</span>
                <span className="text-gray-400 text-[10px]">(312)</span>
              </div>
              <div className="flex items-center gap-1 bg-green-50 rounded-lg px-2 py-1">
                <Clock className="w-3 h-3 text-green-500" />
                <span className="font-bold text-gray-700 text-xs">25–45 min</span>
              </div>
              <div className="flex items-center gap-1 bg-blue-50 rounded-lg px-2 py-1">
                <MapPin className="w-3 h-3 text-blue-400" />
                <span className="font-bold text-gray-700 text-xs">Marrakech</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 mt-3.5 mb-3" />

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {['🫕 Tajine', '🍲 Couscous', '🥟 Briwat', '🌿 Naturel', '🕌 Traditionnel'].map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold border border-gray-100">
              {tag}
            </span>
          ))}
        </div>

        {/* Info grid */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="bg-green-50 rounded-xl px-3 py-2.5 text-center">
            <p className="text-[10px] text-gray-400 font-medium mb-0.5">Livraison</p>
            <p className="text-xs font-black text-green-700">15–25 DH</p>
          </div>
          <div className="bg-amber-50 rounded-xl px-3 py-2.5 text-center">
            <p className="text-[10px] text-gray-400 font-medium mb-0.5">Minimum</p>
            <p className="text-xs font-black text-amber-700">50 DH</p>
          </div>
          <div className={`rounded-xl px-3 py-2.5 text-center ${open ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="text-[10px] text-gray-400 font-medium mb-0.5">Horaires</p>
            <p className={`text-xs font-black ${open ? 'text-green-700' : 'text-red-600'}`}>10h30–21h30</p>
          </div>
        </div>

        {/* Track order */}
        <Link
          href="/track"
          className="mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-colors active:scale-[0.98]"
        >
          <Package className="w-3.5 h-3.5" />
          Suivre ma commande
        </Link>
      </div>
    </div>
  );
}

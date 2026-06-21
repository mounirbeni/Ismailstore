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

const BANNER_STYLE = {
  background: 'linear-gradient(150deg, #431407 0%, #7c2d12 25%, #b45309 60%, #f59e0b 100%)',
};

const PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpolygon points='30,3 54,16 54,44 30,57 6,44 6,16' fill='none' stroke='white' stroke-width='1.5'/%3E%3Ccircle cx='30' cy='30' r='7' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`;

export default function RestaurantHero() {
  const [liked, setLiked] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(checkOpen());
    const id = setInterval(() => setOpen(checkOpen()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          MOBILE HERO  (hidden on lg+)
      ══════════════════════════════════════════════════════ */}
      <div className="lg:hidden relative bg-white">
        {/* Banner */}
        <div className="w-full h-52 relative overflow-hidden" style={BANNER_STYLE}>
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: PATTERN, backgroundSize: '60px 60px' }} />
          <span className="absolute top-8 left-5 text-5xl opacity-[0.15] rotate-[-15deg] select-none pointer-events-none">🫕</span>
          <span className="absolute top-6 right-5 text-4xl opacity-[0.12] rotate-[12deg] select-none pointer-events-none">🥘</span>
          <span className="absolute inset-0 flex items-center justify-center text-[120px] opacity-[0.07] select-none pointer-events-none">🫕</span>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
          {/* Top nav */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4">
            <div className="flex items-center gap-1 bg-black/25 backdrop-blur-sm rounded-full px-3 py-1.5">
              <span className="text-white/70 text-xs">Accueil</span>
              <ChevronRight className="w-3 h-3 text-white/50" />
              <span className="text-white font-bold text-xs">Dar Ismail</span>
            </div>
            <button onClick={() => setLiked(!liked)} className="w-9 h-9 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-90">
              <Heart className={`w-5 h-5 transition-all duration-200 ${liked ? 'text-red-400 fill-red-400 scale-110' : 'text-white'}`} />
            </button>
          </div>
          <div className="absolute top-14 left-4">
            <span className="flex items-center gap-1 bg-amber-500/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <Zap className="w-3 h-3" />Livraison rapide
            </span>
          </div>
        </div>

        {/* Info card */}
        <div className="mx-3 -mt-5 bg-white rounded-3xl shadow-2xl shadow-black/10 border border-gray-100 p-4 relative z-10">
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-[68px] h-[68px] rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center text-3xl shadow-xl shadow-amber-300/50 border-4 border-white -mt-9">🫕</div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${open ? 'bg-green-400' : 'bg-gray-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-white ${open ? 'animate-pulse' : 'opacity-60'}`} />
              </div>
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-gray-900 leading-tight">Dar Ismail</h1>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase tracking-wide">Halal</span>
              </div>
              <p className="text-gray-400 text-xs mt-0.5">Cuisine marocaine authentique · Marrakech</p>
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

          {/* Open/closed status bar */}
          <div className={`mt-3 flex items-center justify-between rounded-xl px-3 py-2 ${open ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${open ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span className={`text-xs font-bold ${open ? 'text-green-700' : 'text-red-700'}`}>
                {open ? 'Ouvert maintenant' : 'Fermé · Ouvre à 10h30'}
              </span>
            </div>
            <span className={`text-xs font-semibold ${open ? 'text-green-600' : 'text-red-500'}`}>10h30 – 21h30</span>
          </div>

          <div className="h-px bg-gray-100 mt-3 mb-3" />

          {/* Tags */}
          <div className="flex gap-1.5 flex-wrap">
            {['🫕 Tajine', '🍲 Couscous', '🥟 Briwat', '🌿 Naturel', '🕌 Traditionnel'].map(tag => (
              <span key={tag} className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold border border-gray-100">{tag}</span>
            ))}
          </div>

          {/* Delivery info grid */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-green-50 rounded-xl px-3 py-2.5 text-center border border-green-100">
              <p className="text-[10px] text-gray-400 font-medium mb-0.5">Livraison</p>
              <p className="text-sm font-black text-green-700">15 – 25 DH</p>
            </div>
            <div className="bg-amber-50 rounded-xl px-3 py-2.5 text-center border border-amber-100">
              <p className="text-[10px] text-gray-400 font-medium mb-0.5">Commande minimum</p>
              <p className="text-sm font-black text-amber-700">50 DH</p>
            </div>
          </div>

          <Link href="/track" className="mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-colors active:scale-[0.98]">
            <Package className="w-3.5 h-3.5" />Suivre ma commande
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP HERO  (hidden below lg)
      ══════════════════════════════════════════════════════ */}
      <div className="hidden lg:block relative">
        {/* Wide banner */}
        <div className="w-full h-72 relative overflow-hidden" style={BANNER_STYLE}>
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: PATTERN, backgroundSize: '70px 70px' }} />
          <span className="absolute top-10 left-10 text-7xl opacity-[0.12] rotate-[-15deg] select-none pointer-events-none">🫕</span>
          <span className="absolute bottom-12 right-24 text-6xl opacity-[0.10] rotate-[12deg] select-none pointer-events-none">🥘</span>
          <span className="absolute top-8 right-8 text-4xl opacity-[0.08] select-none pointer-events-none">🌿</span>
          <span className="absolute top-12 left-1/3 text-3xl opacity-[0.08] select-none pointer-events-none">✨</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[220px] opacity-[0.06] select-none pointer-events-none">🫕</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Title overlay */}
          <div className="absolute bottom-8 left-10">
            <div className="flex items-center gap-3 mb-2">
              {open ? (
                <span className="flex items-center gap-1.5 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />Ouvert maintenant
                </span>
              ) : (
                <span className="flex items-center gap-1.5 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60" />Fermé · Ouvre à 10h30
                </span>
              )}
              <span className="flex items-center gap-1 bg-amber-500/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <Zap className="w-3 h-3" />Livraison rapide
              </span>
            </div>
            <h1 className="text-5xl font-black text-white drop-shadow-lg">Dar Ismail</h1>
            <p className="text-white/80 text-lg mt-1.5">Cuisine marocaine authentique · Marrakech</p>
          </div>

          {/* Top right: like */}
          <div className="absolute top-5 right-6">
            <button onClick={() => setLiked(!liked)} className="w-10 h-10 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
              <Heart className={`w-5 h-5 transition-all duration-200 ${liked ? 'text-red-400 fill-red-400' : 'text-white'}`} />
            </button>
          </div>
        </div>

        {/* Desktop info bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-3xl shadow-lg -mt-10 border-4 border-white flex-shrink-0">
              🫕
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-amber-50 rounded-xl px-3 py-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-black text-gray-800 text-sm">4.8</span>
                <span className="text-gray-400 text-xs">(312 avis)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 rounded-xl px-3 py-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="font-bold text-gray-700 text-sm">25–45 min</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 rounded-xl px-3 py-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-gray-700 text-sm">Marrakech</span>
              </div>
              <span className="h-5 w-px bg-gray-200" />
              <span className="text-sm text-green-700 font-bold">Livraison 15–25 DH</span>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-500">Minimum 50 DH</span>
              <span className="text-gray-300">·</span>
              <span className={`text-sm font-bold ${open ? 'text-green-600' : 'text-red-500'}`}>10h30 – 21h30</span>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Tags */}
            <div className="hidden xl:flex items-center gap-2">
              {['🫕 Tajine', '🍲 Couscous', '🥟 Briwat'].map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold border border-gray-100">{tag}</span>
              ))}
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-black rounded-full">Halal</span>
            </div>

            {/* Track link */}
            <Link href="/track" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-sm font-bold hover:bg-amber-100 transition-colors flex-shrink-0">
              <Package className="w-4 h-4" />Suivre ma commande
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

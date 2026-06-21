'use client';

import { Clock, Star, MapPin, Heart, Package, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function RestaurantHero() {
  const [liked, setLiked] = useState(false);

  return (
    <div className="relative bg-white">
      {/* Banner */}
      <div
        className="w-full h-48 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #d97706 70%, #f59e0b 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 20 L10 0 L20 20 L10 40Z' fill='white'/%3E%3Cpath d='M20 20 L30 0 L40 20 L30 40Z' fill='white'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[100px] opacity-20 select-none">🫕</span>
        </div>

        {/* Top nav */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-1 text-white/80 text-xs">
            <span>Accueil</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">Dar Ismail</span>
          </div>
          <button
            onClick={() => setLiked(!liked)}
            className="w-9 h-9 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center"
          >
            <Heart className={`w-5 h-5 transition-colors ${liked ? 'text-red-400 fill-red-400' : 'text-white'}`} />
          </button>
        </div>
      </div>

      {/* Info card */}
      <div className="mx-4 -mt-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 relative z-10">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl shadow-lg flex-shrink-0 border-4 border-white -mt-8">
            🫕
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-gray-900 leading-tight">Dar Ismail</h1>
            <p className="text-gray-500 text-xs mt-0.5">Cuisine marocaine authentique · Marrakech</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-gray-800 text-xs">4.8</span>
                <span className="text-gray-400 text-xs">(312)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Clock className="w-3.5 h-3.5 text-green-500" />
                <span>25–45 min</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>Marrakech</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {['Tajine', 'Couscous', 'Briwat', 'Halal', 'Traditionnel'].map(tag => (
            <span key={tag} className="px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-100">
              {tag}
            </span>
          ))}
        </div>

        {/* Delivery info */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-3 text-gray-500">
            <span className="text-green-600 font-semibold">Livraison 15–20 DH</span>
            <span>·</span>
            <span>Min. 50 DH</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-600 font-semibold">Ouvert</span>
          </div>
        </div>

        <Link
          href="/track"
          className="mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-colors"
        >
          <Package className="w-3.5 h-3.5" />
          Suivre ma commande
        </Link>
      </div>
    </div>
  );
}

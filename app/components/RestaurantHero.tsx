'use client';

import { Clock, Star, MapPin, ChevronRight, Heart, Package } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function RestaurantHero() {
  const [liked, setLiked] = useState(false);

  return (
    <div className="relative">
      <div
        className="w-full h-56 md:h-72 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 30%, #CD853F 60%, #DAA520 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-8xl mb-4 opacity-30">🫕</div>
        </div>
        <div className="absolute top-4 left-4 flex items-center gap-1 text-white/80 text-sm">
          <span>Home</span><ChevronRight className="w-4 h-4" /><span>Restaurants</span><ChevronRight className="w-4 h-4" /><span className="text-white font-medium">Dar Ismail</span>
        </div>
        <button onClick={() => setLiked(!liked)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30">
          <Heart className={`w-5 h-5 transition-colors ${liked ? 'text-red-400 fill-red-400' : 'text-white'}`} />
        </button>
      </div>
      <div className="bg-white mx-4 -mt-8 rounded-2xl shadow-xl p-5 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-4xl shadow-lg flex-shrink-0 -mt-10 border-4 border-white">🫕</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">Dar Ismail</h1>
            <p className="text-gray-500 text-sm mt-0.5">Authentic Moroccan Cuisine · Marrakech</p>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /><span className="font-semibold text-gray-800 text-sm">4.8</span><span className="text-gray-400 text-xs">(312 reviews)</span></div>
              <div className="flex items-center gap-1 text-gray-500 text-sm"><Clock className="w-4 h-4 text-green-500" /><span>25–40 min</span></div>
              <div className="flex items-center gap-1 text-gray-500 text-sm"><MapPin className="w-4 h-4 text-blue-500" /><span>1.2 km</span></div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {['Moroccan', 'Tagine', 'Couscous', 'Traditional', 'Halal'].map(tag => (
            <span key={tag} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200">{tag}</span>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-green-500 font-semibold">Livraison gratuite</span><span>·</span><span>Min. 50 DH</span>
          </div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /><span className="text-green-600 font-medium text-xs">Ouvert</span></div>
        </div>
        <Link href="/track" className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-sm font-semibold hover:bg-amber-100 transition-colors">
          <Package className="w-4 h-4" />Suivre ma commande
        </Link>
      </div>
    </div>
  );
}

'use client';

import { Plus, Minus, Flame, Leaf, Star } from 'lucide-react';
import { MenuItem } from '@/app/data/menu';
import { useCart } from '@/app/context/CartContext';

interface Props {
  item: MenuItem;
}

const badgeConfig = {
  popular: { label: 'Popular', icon: <Star className="w-3 h-3" />, className: 'bg-amber-100 text-amber-700' },
  new: { label: 'New', icon: null, className: 'bg-blue-100 text-blue-700' },
  vegetarian: { label: 'Veg', icon: <Leaf className="w-3 h-3" />, className: 'bg-green-100 text-green-700' },
  spicy: { label: 'Spicy', icon: <Flame className="w-3 h-3" />, className: 'bg-red-100 text-red-700' },
};

const categoryColors: Record<string, string> = {
  tajins: 'from-amber-400 to-orange-500',
  salads: 'from-green-400 to-emerald-500',
  briwat: 'from-yellow-400 to-amber-500',
  couscous: 'from-orange-400 to-red-500',
};

const categoryEmojis: Record<string, string> = {
  tajins: '🫕',
  salads: '🥗',
  briwat: '🥟',
  couscous: '🍲',
};

export default function MenuCard({ item }: Props) {
  const { state, dispatch } = useCart();
  const cartItem = state.items.find(i => i.id === item.id);
  const qty = cartItem?.quantity ?? 0;
  const badge = item.badge ? badgeConfig[item.badge] : null;
  const gradient = categoryColors[item.category] ?? 'from-gray-400 to-gray-500';
  const emoji = categoryEmojis[item.category] ?? '🍽️';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      <div className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{emoji}</span>
        {badge && (
          <span className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
            {badge.icon}{badge.label}
          </span>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-gray-800 font-bold text-sm">{item.price} DH</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base leading-tight">{item.name}</h3>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-amber-600 font-bold text-lg">{item.price} DH</span>
          {qty === 0 ? (
            <button
              onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-1">
              <button
                onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: qty - 1 } })}
                className="w-7 h-7 rounded-lg bg-white border border-amber-200 flex items-center justify-center text-amber-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-gray-900 text-sm">{qty}</span>
              <button
                onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}
                className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white hover:bg-amber-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

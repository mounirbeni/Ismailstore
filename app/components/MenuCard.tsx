'use client';

import { Plus, Minus } from 'lucide-react';
import { MenuItem } from '@/app/data/menu';
import { useCart } from '@/app/context/CartContext';

interface Props {
  item: MenuItem;
}

const badgeConfig: Record<string, { label: string; className: string }> = {
  popular:    { label: '⭐ Populaire',  className: 'bg-amber-100 text-amber-700' },
  new:        { label: '✨ Nouveau',    className: 'bg-blue-100 text-blue-700' },
  vegetarian: { label: '🌿 Végétarien', className: 'bg-green-100 text-green-700' },
  spicy:      { label: '🌶️ Épicé',      className: 'bg-red-100 text-red-700' },
};

const categoryGradients: Record<string, string> = {
  tajins:   'from-amber-400 to-orange-500',
  salads:   'from-green-400 to-emerald-500',
  briwat:   'from-yellow-400 to-amber-500',
  couscous: 'from-orange-400 to-red-500',
};

const categoryEmojis: Record<string, string> = {
  tajins:   '🫕',
  salads:   '🥗',
  briwat:   '🥟',
  couscous: '🍲',
};

export default function MenuCard({ item }: Props) {
  const { state, dispatch } = useCart();
  const cartItem = state.items.find(i => i.id === item.id);
  const qty = cartItem?.quantity ?? 0;

  const badge = item.badge ? badgeConfig[item.badge] : null;
  const gradient = categoryGradients[item.category] ?? 'from-gray-400 to-gray-500';
  const emoji = categoryEmojis[item.category] ?? '🍽️';

  function openDetail() {
    dispatch({ type: 'SET_SELECTED_PRODUCT', payload: item });
  }

  return (
    <div
      className="flex items-center gap-3 py-4 border-b border-gray-100 cursor-pointer active:bg-gray-50 transition-colors"
      onClick={openDetail}
    >
      {/* Image + qty control */}
      <div className="relative flex-shrink-0">
        <div className={`w-[90px] h-[90px] rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
          <span className="text-4xl">{emoji}</span>
        </div>

        {qty === 0 ? (
          <button
            onClick={e => {
              e.stopPropagation();
              dispatch({ type: 'ADD_ITEM', payload: item });
            }}
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-amber-500 shadow-lg shadow-amber-200 flex items-center justify-center active:scale-90 transition-transform"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        ) : (
          <div
            className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-amber-500 rounded-xl px-1.5 py-1 shadow-lg shadow-amber-200"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: qty - 1 } })}
              className="w-5 h-5 flex items-center justify-center active:scale-90 transition-transform"
            >
              <Minus className="w-3 h-3 text-white" />
            </button>
            <span className="text-white text-xs font-black w-4 text-center tabular-nums">{qty}</span>
            <button
              onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}
              className="w-5 h-5 flex items-center justify-center active:scale-90 transition-transform"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Text side */}
      <div className="flex-1 min-w-0 pl-1">
        {badge && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mb-1.5 ${badge.className}`}>
            {badge.label}
          </span>
        )}
        <h3 className="font-bold text-gray-900 text-sm leading-snug">{item.name}</h3>
        <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
        <p className="text-amber-600 font-black text-base mt-2">{item.price} DH</p>
      </div>
    </div>
  );
}

'use client';

import { MenuItem } from '@/app/data/menu';
import { useCart } from '@/app/context/CartContext';
import MenuCard from './MenuCard';
import { Plus } from 'lucide-react';

interface Props {
  activeCategory: string;
  menuItems: MenuItem[];
}

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

const sectionTitles: Record<string, { title: string; subtitle: string; icon: string }> = {
  tajins:   { title: 'Tajins & Tanjia', subtitle: 'Mijotés à la marocaine',    icon: '🫕' },
  salads:   { title: 'Salades',         subtitle: 'Entrées et accompagnements', icon: '🥗' },
  briwat:   { title: 'Briwat',          subtitle: 'Feuilletés croustillants',   icon: '🥟' },
  couscous: { title: 'Couscous',        subtitle: 'Semoule à la vapeur',        icon: '🍲' },
};

function PopularCard({ item }: { item: MenuItem }) {
  const { state, dispatch } = useCart();
  const cartItem = state.items.find(i => i.id === item.id);
  const qty = cartItem?.quantity ?? 0;
  const gradient = categoryGradients[item.category] ?? 'from-gray-400 to-gray-500';
  const emoji = categoryEmojis[item.category] ?? '🍽️';

  return (
    <div
      className="flex-shrink-0 w-36 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible cursor-pointer active:scale-95 transition-transform"
      onClick={() => dispatch({ type: 'SET_SELECTED_PRODUCT', payload: item })}
    >
      <div className={`relative h-28 bg-gradient-to-br ${gradient} rounded-t-2xl flex items-center justify-center`}>
        <span className="text-5xl">{emoji}</span>
        {qty > 0 && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
            {qty}
          </span>
        )}
      </div>
      <div className="p-3 relative">
        <p className="font-bold text-gray-900 text-xs leading-snug line-clamp-2">{item.name}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-amber-600 font-black text-sm">{item.price} DH</span>
          <button
            onClick={e => {
              e.stopPropagation();
              dispatch({ type: 'ADD_ITEM', payload: item });
            }}
            className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center shadow-md shadow-amber-200 active:scale-90 transition-transform"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ cat }: { cat: string }) {
  const info = sectionTitles[cat];
  if (!info) return null;
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white sticky top-[49px] z-10 border-b border-gray-50">
      <span className="text-xl">{info.icon}</span>
      <div>
        <h2 className="font-black text-gray-900 text-base leading-none">{info.title}</h2>
        <p className="text-gray-400 text-xs mt-0.5">{info.subtitle}</p>
      </div>
    </div>
  );
}

export default function MenuSection({ activeCategory, menuItems }: Props) {
  const popular = menuItems.filter(i => i.badge === 'popular');

  if (activeCategory !== 'all') {
    const filtered = menuItems.filter(i => i.category === activeCategory);
    return (
      <div className="bg-white pb-32 lg:pb-8">
        <SectionHeader cat={activeCategory} />
        <div className="px-4 lg:grid lg:grid-cols-2 lg:gap-x-6">
          {filtered.map(item => <MenuCard key={item.id} item={item} />)}
        </div>
      </div>
    );
  }

  const ORDER = ['tajins', 'salads', 'briwat', 'couscous'];

  return (
    <div className="bg-white pb-32 lg:pb-8">
      {/* Popular section */}
      {popular.length > 0 && (
        <div className="mb-2">
          <div className="px-4 pt-4 pb-3">
            <h2 className="font-black text-gray-900 text-base">⭐ Les plus populaires</h2>
            <p className="text-gray-400 text-xs mt-0.5">Les plats préférés de nos clients</p>
          </div>
          <div className="flex gap-3 px-4 pb-4 overflow-x-auto scrollbar-hide">
            {popular.map(item => <PopularCard key={item.id} item={item} />)}
          </div>
          <div className="h-2 bg-gray-50" />
        </div>
      )}

      {/* All categories */}
      {ORDER.map(cat => {
        const items = menuItems.filter(i => i.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat}>
            <SectionHeader cat={cat} />
            <div className="px-4 lg:grid lg:grid-cols-2 lg:gap-x-6">
              {items.map(item => <MenuCard key={item.id} item={item} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

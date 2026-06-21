'use client';

import { Category } from '@/app/data/menu';

interface Props {
  active: string;
  onSelect: (id: string) => void;
  categories: Category[];
}

export default function DesktopCategorySidebar({ active, onSelect, categories }: Props) {
  return (
    <nav className="px-3 py-5">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-3">Menu</p>
      <div className="space-y-0.5">
        {categories.map(cat => {
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-200/60'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg leading-none">{cat.icon}</span>
                <span>{cat.name}</span>
              </div>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center ${
                isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Info block */}
      <div className="mt-6 mx-1 p-3 bg-amber-50 rounded-2xl border border-amber-100">
        <p className="text-xs font-bold text-amber-800 mb-1">🕌 Halal · Traditionnel</p>
        <p className="text-[11px] text-amber-700 leading-relaxed">Plats préparés à la marocaine, avec des épices fraîches.</p>
      </div>
    </nav>
  );
}

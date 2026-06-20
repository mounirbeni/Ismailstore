'use client';

import { categories } from '@/app/data/menu';

interface Props {
  active: string;
  onSelect: (id: string) => void;
}

export default function CategoryTabs({ active, onSelect }: Props) {
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 flex-shrink-0 ${
              active === cat.id
                ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              active === cat.id ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-500'
            }`}>{cat.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

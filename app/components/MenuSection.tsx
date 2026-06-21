'use client';

import { MenuItem } from '@/app/data/menu';
import MenuCard from './MenuCard';

interface Props {
  activeCategory: string;
  menuItems: MenuItem[];
}

const sectionTitles: Record<string, { title: string; subtitle: string; icon: string }> = {
  tajins:   { title: 'Tajins & Tanjia', subtitle: 'Slow-cooked Moroccan classics', icon: '🫕' },
  salads:   { title: 'Salades',         subtitle: 'Fresh starters & sides',        icon: '🥗' },
  briwat:   { title: 'Briwat',          subtitle: 'Crispy pastry bites',           icon: '🥟' },
  couscous: { title: 'Couscous',        subtitle: 'Steamed semolina dishes',       icon: '🍲' },
};

export default function MenuSection({ activeCategory, menuItems }: Props) {
  if (activeCategory === 'all') {
    return (
      <div className="space-y-8 p-4 pb-32">
        {['tajins', 'salads', 'briwat', 'couscous'].map(cat => {
          const items = menuItems.filter(i => i.category === cat);
          if (items.length === 0) return null;
          const info = sectionTitles[cat];
          return (
            <section key={cat}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{info.icon}</span>
                <div><h2 className="font-bold text-gray-900 text-lg">{info.title}</h2><p className="text-gray-400 text-xs">{info.subtitle}</p></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{items.map(item => <MenuCard key={item.id} item={item} />)}</div>
            </section>
          );
        })}
      </div>
    );
  }
  const filtered = menuItems.filter(i => i.category === activeCategory);
  const info = sectionTitles[activeCategory] ?? { title: activeCategory, subtitle: '', icon: '🍽️' };
  return (
    <div className="p-4 pb-32">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{info.icon}</span>
        <div><h2 className="font-bold text-gray-900 text-lg">{info.title}</h2><p className="text-gray-400 text-xs">{info.subtitle}</p></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{filtered.map(item => <MenuCard key={item.id} item={item} />)}</div>
    </div>
  );
}

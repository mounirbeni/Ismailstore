'use client';

import { useState } from 'react';
import RestaurantHero from '@/app/components/RestaurantHero';
import CategoryTabs from '@/app/components/CategoryTabs';
import MenuSection from '@/app/components/MenuSection';
import CartButton from '@/app/components/CartButton';
import CartDrawer from '@/app/components/CartDrawer';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <main className="min-h-screen bg-gray-50">
      <RestaurantHero />
      <CategoryTabs active={activeCategory} onSelect={setActiveCategory} />
      <MenuSection activeCategory={activeCategory} />
      <CartButton />
      <CartDrawer />
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import RestaurantHero from '@/app/components/RestaurantHero';
import CategoryTabs from '@/app/components/CategoryTabs';
import MenuSection from '@/app/components/MenuSection';
import CartButton from '@/app/components/CartButton';
import CartDrawer from '@/app/components/CartDrawer';
import CheckoutModal from '@/app/components/CheckoutModal';
import ProductModal from '@/app/components/ProductModal';
import DesktopCartPanel from '@/app/components/DesktopCartPanel';
import { useCart } from '@/app/context/CartContext';
import { MenuItem, Category, menuItems as staticItems, categories as staticCats } from '@/app/data/menu';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(staticItems);
  const [categories, setCategories] = useState<Category[]>(staticCats);
  const { state, dispatch } = useCart();

  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.json())
      .then(data => {
        setMenuItems(data.items);
        setCategories([
          { id: 'all', name: 'Tout', icon: '🍽️', count: data.items.length },
          ...data.categories,
        ]);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-white">

      {/* ── DESKTOP: two-column layout ─────────────────────────────── */}
      <div className="hidden lg:flex lg:h-screen lg:overflow-hidden">
        {/* Left: scrollable menu */}
        <div className="flex-1 overflow-y-auto">
          <RestaurantHero />
          <div className="sticky top-0 z-20">
            <CategoryTabs active={activeCategory} onSelect={setActiveCategory} categories={categories} />
          </div>
          <MenuSection activeCategory={activeCategory} menuItems={menuItems} />
        </div>
        {/* Right: sticky cart sidebar */}
        <aside className="w-[400px] flex-shrink-0 flex flex-col sticky top-0 h-screen overflow-hidden">
          <DesktopCartPanel />
        </aside>
      </div>

      {/* ── MOBILE: stacked layout ─────────────────────────────────── */}
      <div className="lg:hidden">
        <RestaurantHero />
        <CategoryTabs active={activeCategory} onSelect={setActiveCategory} categories={categories} />
        <MenuSection activeCategory={activeCategory} menuItems={menuItems} />
        <CartButton />
        <CartDrawer />
      </div>

      {/* ── Shared modals ──────────────────────────────────────────── */}
      <ProductModal />
      <CheckoutModal
        isOpen={state.isCheckoutOpen}
        onClose={() => dispatch({ type: 'SET_CHECKOUT_OPEN', payload: false })}
      />
    </main>
  );
}

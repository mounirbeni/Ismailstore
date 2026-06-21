'use client';

import { useState, useEffect } from 'react';
import RestaurantHero from '@/app/components/RestaurantHero';
import CategoryTabs from '@/app/components/CategoryTabs';
import MenuSection from '@/app/components/MenuSection';
import CartButton from '@/app/components/CartButton';
import CartDrawer from '@/app/components/CartDrawer';
import CheckoutModal from '@/app/components/CheckoutModal';
import ProductModal from '@/app/components/ProductModal';
import DesktopHeader from '@/app/components/DesktopHeader';
import DesktopCartPanel from '@/app/components/DesktopCartPanel';
import DesktopCategorySidebar from '@/app/components/DesktopCategorySidebar';
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

      {/* ═══════════════════════════════════════════════════════
          DESKTOP LAYOUT  — 3 columns (hidden on mobile)
      ═══════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:flex-col lg:h-screen lg:overflow-hidden">

        {/* Sticky top header */}
        <DesktopHeader />

        {/* Body: banner + 3 columns */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* Left sidebar — category nav */}
          <aside className="w-52 flex-shrink-0 border-r border-gray-100 overflow-y-auto bg-white">
            <DesktopCategorySidebar
              active={activeCategory}
              onSelect={setActiveCategory}
              categories={categories}
            />
          </aside>

          {/* Center — banner + menu */}
          <div className="flex-1 overflow-y-auto bg-gray-50/30">
            <RestaurantHero />
            <div className="bg-white">
              <MenuSection activeCategory={activeCategory} menuItems={menuItems} />
            </div>
          </div>

          {/* Right sidebar — cart */}
          <aside className="w-[390px] flex-shrink-0 flex flex-col overflow-hidden border-l border-gray-100 bg-white">
            <DesktopCartPanel />
          </aside>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MOBILE LAYOUT  (hidden on desktop)
      ═══════════════════════════════════════════════════════ */}
      <div className="lg:hidden">
        <RestaurantHero />
        <CategoryTabs active={activeCategory} onSelect={setActiveCategory} categories={categories} />
        <MenuSection activeCategory={activeCategory} menuItems={menuItems} />
        <CartButton />
        <CartDrawer />
      </div>

      {/* Shared modals */}
      <ProductModal />
      <CheckoutModal
        isOpen={state.isCheckoutOpen}
        onClose={() => dispatch({ type: 'SET_CHECKOUT_OPEN', payload: false })}
      />
    </main>
  );
}

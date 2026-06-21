'use client';

import { useState, useEffect } from 'react';
import RestaurantHero from '@/app/components/RestaurantHero';
import CategoryTabs from '@/app/components/CategoryTabs';
import MenuSection from '@/app/components/MenuSection';
import CartButton from '@/app/components/CartButton';
import CartDrawer from '@/app/components/CartDrawer';
import CheckoutModal from '@/app/components/CheckoutModal';
import ProductModal from '@/app/components/ProductModal';
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
      <RestaurantHero />
      <CategoryTabs active={activeCategory} onSelect={setActiveCategory} categories={categories} />
      <MenuSection activeCategory={activeCategory} menuItems={menuItems} />
      <CartButton />
      <CartDrawer />
      <ProductModal />
      <CheckoutModal
        isOpen={state.isCheckoutOpen}
        onClose={() => dispatch({ type: 'SET_CHECKOUT_OPEN', payload: false })}
      />
    </main>
  );
}

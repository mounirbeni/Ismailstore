export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  badge?: 'popular' | 'new' | 'vegetarian' | 'spicy';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const menuItems: MenuItem[] = [
  // Tajins
  { id: 'tajin-poulet-citron', name: 'Tajin Poulet Citron', description: 'Tender chicken slow-cooked with preserved lemon, green olives, saffron and aromatic spices', price: 85, category: 'tajins', image: '/images/tajin-poulet.jpg', badge: 'popular' },
  { id: 'tajin-viand', name: 'Tajin Viand', description: 'Slow-braised beef with caramelized onions, honey, almonds and cinnamon', price: 95, category: 'tajins', image: '/images/tajin-viand.jpg', badge: 'popular' },
  { id: 'tajin-viand-legume', name: 'Tajin Viand & Legume', description: 'Hearty beef tagine with seasonal vegetables, zucchini, carrots and Moroccan spices', price: 90, category: 'tajins', image: '/images/tajin-legume.jpg' },
  { id: 'tajin-kefta', name: 'Tajin Kefta', description: 'Spiced minced meat balls simmered in a rich tomato sauce with eggs and fresh herbs', price: 80, category: 'tajins', image: '/images/tajin-kefta.jpg', badge: 'spicy' },
  { id: 'tajin-kabab', name: 'Tajin Kabab', description: 'Grilled kabab pieces braised in a savory sauce with peppers and tomatoes', price: 90, category: 'tajins', image: '/images/tajin-kabab.jpg' },
  { id: 'tanjia-marrakechia-viand', name: 'Tanjia Marrakechia (Viand)', description: 'The famous Marrakech specialty - beef slow-cooked in an earthen pot with argan oil and spices', price: 110, category: 'tajins', image: '/images/tanjia.jpg', badge: 'popular' },
  { id: 'tanjia-marrakech-lump', name: 'Tanjia Marrakech (Agneau)', description: 'Marrakech-style lamb slow-cooked in an earthen pot with preserved lemon and chermoula', price: 120, category: 'tajins', image: '/images/tanjia-lump.jpg' },
  { id: 'tajin-vegitarian', name: 'Tajin Vegitarien', description: 'Colorful medley of seasonal vegetables, chickpeas and dried fruits in a spiced broth', price: 70, category: 'tajins', image: '/images/tajin-veg.jpg', badge: 'vegetarian' },
  { id: 'tajin-poulet-legume', name: 'Tajin Poulet & Legume', description: 'Chicken tagine with garden vegetables, olives and preserved lemon in saffron sauce', price: 85, category: 'tajins', image: '/images/tajin-poulet-leg.jpg' },
  // Salads
  { id: 'salad-marrocain', name: 'Salade Marocaine', description: 'Fresh tomatoes, cucumber, onion and parsley dressed with olive oil and cumin', price: 30, category: 'salads', image: '/images/salade.jpg', badge: 'vegetarian' },
  { id: 'taktoka', name: 'Taktoka', description: 'Roasted green peppers and tomatoes cooked with garlic, cumin and olive oil', price: 30, category: 'salads', image: '/images/taktoka.jpg', badge: 'vegetarian' },
  { id: 'zealouk', name: 'Zealouk', description: 'Smoky roasted eggplant and tomato salad with garlic, paprika and fresh cilantro', price: 30, category: 'salads', image: '/images/zealouk.jpg', badge: 'vegetarian' },
  // Briwat
  { id: 'briwat-kfta', name: 'Briwat Kefta', description: 'Crispy pastry triangles filled with spiced minced meat, herbs and lemon zest', price: 45, category: 'briwat', image: '/images/briwat-kfta.jpg', badge: 'popular' },
  { id: 'briwat-poulet', name: 'Briwat Poulet', description: 'Golden fried pastry parcels filled with seasoned shredded chicken and spices', price: 45, category: 'briwat', image: '/images/briwat-poulet.jpg' },
  { id: 'briwat-vegitarian', name: 'Briwat Vegitarien', description: 'Crispy pastry filled with cheese, herbs and roasted vegetables', price: 40, category: 'briwat', image: '/images/briwat-veg.jpg', badge: 'vegetarian' },
  // Couscous
  { id: 'couscous-poulet', name: 'Couscous Poulet', description: 'Steamed semolina with tender chicken, seven vegetables and a rich broth', price: 90, category: 'couscous', image: '/images/couscous-poulet.jpg' },
  { id: 'couscous-viand', name: 'Couscous Viand', description: 'Traditional couscous with slow-cooked beef, vegetables and harissa on the side', price: 100, category: 'couscous', image: '/images/couscous-viand.jpg', badge: 'popular' },
  { id: 'couscous-royal', name: 'Couscous Royal', description: 'The grand couscous - lamb, chicken, merguez sausage, seven vegetables and two sauces', price: 130, category: 'couscous', image: '/images/couscous-royal.jpg', badge: 'popular' },
  { id: 'couscous-vegitarian', name: 'Couscous Vegitarien', description: 'Light and fragrant couscous with seven seasonal vegetables and herbs, dairy-free broth', price: 75, category: 'couscous', image: '/images/couscous-veg.jpg', badge: 'vegetarian' },
];

export const categories: Category[] = [
  { id: 'all', name: 'All', icon: '🍽️', count: menuItems.length },
  { id: 'tajins', name: 'Tajins', icon: '🫕', count: menuItems.filter(i => i.category === 'tajins').length },
  { id: 'salads', name: 'Salades', icon: '🥗', count: menuItems.filter(i => i.category === 'salads').length },
  { id: 'briwat', name: 'Briwat', icon: '🥟', count: menuItems.filter(i => i.category === 'briwat').length },
  { id: 'couscous', name: 'Couscous', icon: '🍲', count: menuItems.filter(i => i.category === 'couscous').length },
];

'use client';
import { ChefHat, Salad, Cookie, Soup, Utensils } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { FC } from 'react';

const map: Record<string, FC<LucideProps>> = {
  all:      Utensils,
  tajins:   ChefHat,
  salads:   Salad,
  briwat:   Cookie,
  couscous: Soup,
};

interface Props extends LucideProps { category: string; }

export default function CategoryIcon({ category, ...props }: Props) {
  const Icon = map[category] ?? Utensils;
  return <Icon {...props} />;
}

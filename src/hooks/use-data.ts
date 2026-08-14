import { useMemo } from 'react';
import { PRODUCTS, CATEGORIES, GUIDES } from '../lib/data/mock';

export function useProducts() {
  return useMemo(() => PRODUCTS, []);
}

export function useCategories() {
  return useMemo(() => CATEGORIES, []);
}

export function useGuides() {
  return useMemo(() => GUIDES, []);
}

export function useProductBySlug(slug: string) {
  return useMemo(() => PRODUCTS.find(p => p.slug === slug), [slug]);
}

export function useTrendingProducts() {
  return useMemo(() => PRODUCTS.slice(0, 4), []);
}

export function useDeals() {
  return useMemo(() => PRODUCTS.filter(p => p.discountPercent > 0), []);
}

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { publicMenuApi, PublicMenuResponse, MenuProduct as ApiMenuProduct, MenuCategory as ApiMenuCategory } from '@/lib/api';

// ==================== INTERFACES ====================

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
  schedule?: {
    startTime: string;
    endTime: string;
    days: string[];
  };
}

interface MenuVariation {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
}

interface MenuExtra {
  id: string;
  name: string;
  price: number;
  maxQuantity?: number;
}

interface MenuProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  cost: number;
  category: string;
  categoryId: string;
  image?: string;
  isActive: boolean;
  isAvailable: boolean;
  isPromotion: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  allergens: string[];
  preparationTime: number;
  order: number;
  variations?: MenuVariation[];
  extras?: MenuExtra[];
  schedule?: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
}

interface Table {
  id: string;
  number: string;
  qrCode: string;
  isActive: boolean;
}

interface RestaurantInfo {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  phone?: string;
}

interface WhiteLabelConfig {
  primaryColor: string;
  secondaryColor: string;
}

interface MenuContextType {
  // Restaurant
  restaurant: RestaurantInfo | null;
  whiteLabel: WhiteLabelConfig | null;
  
  // Data
  categories: MenuCategory[];
  products: MenuProduct[];
  tables: Table[];
  
  // Loading
  isLoading: boolean;
  error: string | null;
  
  // Actions (read-only for public menu)
  loadMenu: (slug: string) => Promise<void>;
  refreshMenu: () => Promise<void>;
  
  // Helpers
  generateTableQR: (tableNumber: string) => string;
  getPublicMenu: (restaurantSlug?: string) => {
    categories: MenuCategory[];
    products: MenuProduct[];
  };
  getAvailableProducts: () => MenuProduct[];
  getProductById: (id: string) => MenuProduct | undefined;
  getProductsByCategory: (categoryId: string) => MenuProduct[];
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);

  // ==================== MAPPERS ====================

  const mapCategoryFromApi = (cat: ApiMenuCategory, index: number): MenuCategory => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    image: cat.image,
    order: index,
    isActive: true,
  });

  const mapProductFromApi = (prod: ApiMenuProduct, categoryName: string, categoryId: string, index: number): MenuProduct => ({
    id: prod.id,
    name: prod.name,
    description: prod.description,
    price: prod.price,
    cost: 0,
    category: categoryName,
    categoryId: categoryId,
    image: prod.image,
    isActive: true,
    isAvailable: prod.isAvailable,
    isPromotion: false,
    isBestSeller: prod.tags?.includes('popular') || prod.tags?.includes('bestseller') || false,
    isNew: prod.tags?.includes('new') || prod.tags?.includes('novo') || false,
    allergens: prod.allergens || [],
    preparationTime: prod.preparationTime || 15,
    order: index,
    variations: prod.variations?.map((v, i) => ({
      id: `${prod.id}-var-${i}`,
      name: v.name,
      price: v.price,
      isDefault: i === 0,
    })),
    extras: prod.extras?.map((e, i) => ({
      id: `${prod.id}-ext-${i}`,
      name: e.name,
      price: e.price,
    })),
    tags: prod.tags || [],
  });

  // ==================== DATA LOADING ====================

  const loadMenu = useCallback(async (slug: string) => {
    if (!slug) return;
    
    setIsLoading(true);
    setError(null);
    setCurrentSlug(slug);

    try {
      const response = await publicMenuApi.getMenu(slug);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        const data = response.data;
        
        // Set restaurant info
        setRestaurant(data.restaurant);
        
        // Set white label config
        setWhiteLabel(data.whiteLabel);
        
        // Map categories
        const mappedCategories = data.categories.map((cat, index) => 
          mapCategoryFromApi(cat, index)
        );
        setCategories(mappedCategories);
        
        // Map products from all categories
        const allProducts: MenuProduct[] = [];
        data.categories.forEach((cat, catIndex) => {
          cat.products.forEach((prod, prodIndex) => {
            allProducts.push(mapProductFromApi(prod, cat.name, cat.id, prodIndex));
          });
        });
        setProducts(allProducts);
      }
    } catch (err) {
      console.error('Error loading menu:', err);
      setError('Erro ao carregar o cardápio');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshMenu = useCallback(async () => {
    if (currentSlug) {
      await loadMenu(currentSlug);
    }
  }, [currentSlug, loadMenu]);

  // ==================== HELPERS ====================

  const generateTableQR = (tableNumber: string): string => {
    const slug = restaurant?.slug || 'restaurante';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/menu/${slug}?table=${tableNumber}`;
  };

  const getPublicMenu = useCallback((restaurantSlug?: string) => {
    // If a different slug is requested, we'd need to load that menu
    // For now, return current loaded menu
    if (restaurantSlug && restaurantSlug !== currentSlug) {
      console.log('Loading menu for:', restaurantSlug);
    }

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const availableCategories = categories.filter((category) => {
      if (!category.isActive) return false;

      if (category.schedule) {
        const { startTime, endTime, days } = category.schedule;
        if (!days.includes(currentDay)) return false;
        if (currentTime < startTime || currentTime > endTime) return false;
      }

      return true;
    });

    const availableProducts = products.filter((product) => {
      if (!product.isActive || !product.isAvailable) return false;

      if (product.schedule) {
        const { startTime, endTime, days } = product.schedule;
        if (!days.includes(currentDay)) return false;
        if (currentTime < startTime || currentTime > endTime) return false;
      }

      return availableCategories.some((cat) => cat.id === product.categoryId);
    });

    return {
      categories: availableCategories,
      products: availableProducts,
    };
  }, [categories, products, currentSlug]);

  const getAvailableProducts = useCallback((): MenuProduct[] => {
    return products.filter((product) => product.isActive && product.isAvailable);
  }, [products]);

  const getProductById = useCallback((id: string): MenuProduct | undefined => {
    return products.find((product) => product.id === id);
  }, [products]);

  const getProductsByCategory = useCallback((categoryId: string): MenuProduct[] => {
    return products.filter((product) => product.categoryId === categoryId && product.isAvailable);
  }, [products]);

  // ==================== CONTEXT VALUE ====================

  return (
    <MenuContext.Provider
      value={{
        // Restaurant
        restaurant,
        whiteLabel,
        
        // Data
        categories,
        products,
        tables,
        
        // Loading
        isLoading,
        error,
        
        // Actions
        loadMenu,
        refreshMenu,
        
        // Helpers
        generateTableQR,
        getPublicMenu,
        getAvailableProducts,
        getProductById,
        getProductsByCategory,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { categoriesApi, productsApi, tablesApi } from '@/lib/api';

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
  _count?: {
    products: number;
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
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';
  qrCode?: string;
  isActive: boolean;
}

interface MenuContextType {
  // State
  categories: MenuCategory[];
  products: MenuProduct[];
  tables: Table[];
  isLoading: boolean;
  
  // Category Actions
  addCategory: (category: Partial<MenuCategory>) => Promise<void>;
  updateCategory: (id: string, category: Partial<MenuCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (categoryIds: string[]) => Promise<void>;
  
  // Product Actions
  addProduct: (product: Partial<MenuProduct>) => Promise<void>;
  updateProduct: (id: string, product: Partial<MenuProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductAvailability: (id: string) => Promise<void>;
  reorderProducts: (categoryId: string, productIds: string[]) => Promise<void>;
  
  // Table Actions
  addTable: (table: Partial<Table>) => Promise<void>;
  updateTable: (id: string, table: Partial<Table>) => Promise<void>;
  deleteTable: (id: string) => Promise<void>;
  updateTableStatus: (id: string, status: string) => Promise<void>;
  generateTableQR: (tableId: string) => Promise<string>;
  
  // Helpers
  getPublicMenu: () => { categories: MenuCategory[]; products: MenuProduct[] };
  getAvailableProducts: () => MenuProduct[];
  
  // Refresh
  refreshCategories: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshTables: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const restaurantId = user?.currentRestaurant?.id;

  // ==================== MAPPERS ====================

  const mapCategoryFromApi = (c: any): MenuCategory => ({
    id: c.id,
    name: c.name || '',
    description: c.description || '',
    image: c.image,
    order: c.order || 0,
    isActive: c.isActive !== false,
    schedule: c.schedule,
    _count: c._count
  });

  const mapProductFromApi = (p: any, categoryName?: string): MenuProduct => ({
    id: p.id,
    name: p.name || '',
    description: p.description || '',
    price: p.price || 0,
    originalPrice: p.originalPrice,
    cost: p.cost || 0,
    category: categoryName || p.category?.name || '',
    categoryId: p.categoryId || '',
    image: p.image,
    isActive: p.isActive !== false,
    isAvailable: p.isAvailable !== false,
    isPromotion: p.isPromotion || false,
    isBestSeller: p.isBestSeller || false,
    isNew: p.isNew || false,
    allergens: p.allergens || [],
    preparationTime: p.preparationTime || 0,
    order: p.order || 0,
    variations: p.variations || [],
    extras: p.extras || [],
    schedule: p.schedule,
    nutritionalInfo: p.nutritionalInfo,
    tags: p.tags || []
  });

  const mapTableFromApi = (t: any): Table => ({
    id: t.id,
    number: t.number || '',
    capacity: t.capacity || 4,
    status: t.status || 'AVAILABLE',
    qrCode: t.qrCode,
    isActive: t.isActive !== false
  });

  // ==================== DATA LOADING ====================

  const refreshCategories = useCallback(async () => {
    if (!restaurantId) return;
    
    try {
      const response = await categoriesApi.list(restaurantId);
      if (response.data) {
        const responseData = response.data as any;
        const apiData = Array.isArray(responseData) ? responseData : responseData.data || [];
        const mapped = apiData.map(mapCategoryFromApi) as MenuCategory[];
        setCategories(mapped.sort((a: MenuCategory, b: MenuCategory) => a.order - b.order));
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  }, [restaurantId]);

  const refreshProducts = useCallback(async () => {
    if (!restaurantId) return;
    
    try {
      const response = await productsApi.list(restaurantId);
      if (response.data) {
        const responseData = response.data as any;
        const apiData = Array.isArray(responseData) ? responseData : responseData.data || [];
        
        // Map products with category names
        const mappedProducts = apiData.map((p: any) => {
          const category = categories.find(c => c.id === p.categoryId);
          return mapProductFromApi(p, category?.name);
        }) as MenuProduct[];
        
        setProducts(mappedProducts.sort((a: MenuProduct, b: MenuProduct) => a.order - b.order));
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }, [restaurantId, categories]);

  const refreshTables = useCallback(async () => {
    if (!restaurantId) return;
    
    try {
      const response = await tablesApi.list(restaurantId);
      if (response.data) {
        const responseData = response.data as any;
        const apiData = Array.isArray(responseData) ? responseData : responseData.data || [];
        setTables(apiData.map(mapTableFromApi));
      }
    } catch (error) {
      console.error('Erro ao carregar mesas:', error);
    }
  }, [restaurantId]);

  const refreshAll = useCallback(async () => {
    if (!restaurantId) return;
    
    setIsLoading(true);
    try {
      await refreshCategories();
      await refreshProducts();
      await refreshTables();
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, refreshCategories, refreshProducts, refreshTables]);

  // ==================== EFFECTS ====================

  useEffect(() => {
    if (isAuthenticated && restaurantId) {
      refreshAll();
    }
  }, [isAuthenticated, restaurantId]);

  // Refresh products when categories change (to get category names)
  useEffect(() => {
    if (categories.length > 0 && restaurantId) {
      refreshProducts();
    }
  }, [categories, restaurantId]);

  // ==================== CATEGORY ACTIONS ====================

  const addCategory = async (categoryData: Partial<MenuCategory>) => {
    if (!restaurantId) return;
    
    const response = await categoriesApi.create(categoryData, restaurantId);
    if (response.data) {
      await refreshCategories();
    } else {
      throw new Error(response.error || 'Erro ao criar categoria');
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<MenuCategory>) => {
    if (!restaurantId) return;
    
    const response = await categoriesApi.update(id, categoryData, restaurantId);
    if (response.data) {
      await refreshCategories();
    } else {
      throw new Error(response.error || 'Erro ao atualizar categoria');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!restaurantId) return;
    
    const response = await categoriesApi.delete(id, restaurantId);
    if (response.status === 200 || response.status === 204) {
      await refreshCategories();
    } else {
      throw new Error(response.error || 'Erro ao deletar categoria');
    }
  };

  const reorderCategories = async (categoryIds: string[]) => {
    if (!restaurantId) return;
    
    const response = await categoriesApi.reorder(categoryIds, restaurantId);
    if (response.data || response.status === 200) {
      await refreshCategories();
    } else {
      throw new Error(response.error || 'Erro ao reordenar categorias');
    }
  };

  // ==================== PRODUCT ACTIONS ====================

  const addProduct = async (productData: Partial<MenuProduct>) => {
    if (!restaurantId) return;
    
    const response = await productsApi.create(productData, restaurantId);
    if (response.data) {
      await refreshProducts();
    } else {
      throw new Error(response.error || 'Erro ao criar produto');
    }
  };

  const updateProduct = async (id: string, productData: Partial<MenuProduct>) => {
    if (!restaurantId) return;
    
    const response = await productsApi.update(id, productData, restaurantId);
    if (response.data) {
      await refreshProducts();
    } else {
      throw new Error(response.error || 'Erro ao atualizar produto');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!restaurantId) return;
    
    const response = await productsApi.delete(id, restaurantId);
    if (response.status === 200 || response.status === 204) {
      await refreshProducts();
    } else {
      throw new Error(response.error || 'Erro ao deletar produto');
    }
  };

  const toggleProductAvailability = async (id: string) => {
    if (!restaurantId) return;
    
    const response = await productsApi.toggle(id, restaurantId);
    if (response.data || response.status === 200) {
      await refreshProducts();
    } else {
      throw new Error(response.error || 'Erro ao alterar disponibilidade');
    }
  };

  const reorderProducts = async (categoryId: string, productIds: string[]) => {
    if (!restaurantId) return;
    
    const response = await productsApi.reorder(categoryId, productIds, restaurantId);
    if (response.data || response.status === 200) {
      await refreshProducts();
    } else {
      throw new Error(response.error || 'Erro ao reordenar produtos');
    }
  };

  // ==================== TABLE ACTIONS ====================

  const addTable = async (tableData: Partial<Table>) => {
    if (!restaurantId) return;
    
    const response = await tablesApi.create(tableData, restaurantId);
    if (response.data) {
      await refreshTables();
    } else {
      throw new Error(response.error || 'Erro ao criar mesa');
    }
  };

  const updateTable = async (id: string, tableData: Partial<Table>) => {
    if (!restaurantId) return;
    
    const response = await tablesApi.update(id, tableData, restaurantId);
    if (response.data) {
      await refreshTables();
    } else {
      throw new Error(response.error || 'Erro ao atualizar mesa');
    }
  };

  const deleteTable = async (id: string) => {
    if (!restaurantId) return;
    
    const response = await tablesApi.delete(id, restaurantId);
    if (response.status === 200 || response.status === 204) {
      await refreshTables();
    } else {
      throw new Error(response.error || 'Erro ao deletar mesa');
    }
  };

  const updateTableStatus = async (id: string, status: string) => {
    if (!restaurantId) return;
    
    const response = await tablesApi.updateStatus(id, status, restaurantId);
    if (response.data || response.status === 200) {
      await refreshTables();
    } else {
      throw new Error(response.error || 'Erro ao atualizar status da mesa');
    }
  };

  const generateTableQR = async (tableId: string): Promise<string> => {
    if (!restaurantId) return '';
    
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const response = await tablesApi.generateQRCode(tableId, baseUrl, restaurantId);
    
    if (response.data) {
      await refreshTables();
      return response.data.qrCode || response.data.url || '';
    } else {
      throw new Error(response.error || 'Erro ao gerar QR Code');
    }
  };

  // ==================== HELPERS ====================

  const getPublicMenu = () => {
    return {
      categories: categories.filter(c => c.isActive).sort((a, b) => a.order - b.order),
      products: products.filter(p => p.isActive && p.isAvailable).sort((a, b) => a.order - b.order)
    };
  };

  const getAvailableProducts = () => {
    return products.filter(p => p.isActive && p.isAvailable);
  };

  // ==================== CONTEXT VALUE ====================

  return (
    <MenuContext.Provider
      value={{
        // State
        categories,
        products,
        tables,
        isLoading,
        
        // Category Actions
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        
        // Product Actions
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        reorderProducts,
        
        // Table Actions
        addTable,
        updateTable,
        deleteTable,
        updateTableStatus,
        generateTableQR,
        
        // Helpers
        getPublicMenu,
        getAvailableProducts,
        
        // Refresh
        refreshCategories,
        refreshProducts,
        refreshTables,
        refreshAll,
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

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
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

interface MenuContextType {
  categories: MenuCategory[];
  products: MenuProduct[];
  tables: Table[];
  addCategory: (category: Omit<MenuCategory, 'id'>) => void;
  updateCategory: (id: string, category: Partial<MenuCategory>) => void;
  deleteCategory: (id: string) => void;
  addProduct: (product: Omit<MenuProduct, 'id'>) => void;
  updateProduct: (id: string, product: Partial<MenuProduct>) => void;
  deleteProduct: (id: string) => void;
  reorderProducts: (categoryId: string, productIds: string[]) => void;
  generateTableQR: (tableNumber: string) => string;
  getPublicMenu: (restaurantSlug?: string) => {
    categories: MenuCategory[];
    products: MenuProduct[];
  };
  getAvailableProducts: () => MenuProduct[];
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    // Inicializa dados sempre, independente do login
    initializeMenuData();
  }, [user]);

  const generateQRCode = (tableNumber: string): string => {
    const restaurantSlug = user?.currentRestaurant?.name
      .toLowerCase()
      .replace(/\s+/g, '-') || 'restaurante';
    const origin =
      typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/menu/${restaurantSlug}?table=${tableNumber}`;
  };

  const initializeMenuData = () => {
    // Categorias mockadas
    const mockCategories: MenuCategory[] = [
      {
        id: '1',
        name: 'Pizzas',
        description: 'Pizzas artesanais com massa tradicional',
        order: 1,
        isActive: true,
      },
      {
        id: '2',
        name: 'Lanches',
        description: 'Hambúrguers e sanduíches gourmet',
        order: 2,
        isActive: true,
      },
      {
        id: '3',
        name: 'Bebidas',
        description: 'Refrigerantes, sucos e bebidas especiais',
        order: 3,
        isActive: true,
      },
      {
        id: '4',
        name: 'Sobremesas',
        description: 'Doces e sobremesas da casa',
        order: 4,
        isActive: true,
      },
      {
        id: '5',
        name: 'Pratos Executivos',
        description: 'Pratos completos para o almoço',
        order: 5,
        isActive: true,
        schedule: {
          startTime: '11:00',
          endTime: '15:00',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        },
      },
    ];

    // Produtos mockados
    const mockProducts: MenuProduct[] = [
      {
        id: '1',
        name: 'Pizza Margherita',
        description:
          'Molho de tomate, mussarela, manjericão fresco e azeite',
        price: 45.9,
        cost: 18.5,
        category: 'Pizzas',
        categoryId: '1',
        image:
          'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
        isActive: true,
        isAvailable: true,
        isPromotion: false,
        isBestSeller: true,
        isNew: false,
        allergens: ['Glúten', 'Lactose'],
        preparationTime: 15,
        order: 1,
        variations: [
          { id: '1', name: 'Pequena', price: 35.9, isDefault: false },
          { id: '2', name: 'Média', price: 45.9, isDefault: true },
          { id: '3', name: 'Grande', price: 55.9, isDefault: false },
        ],
        extras: [
          { id: '1', name: 'Borda recheada', price: 8.0 },
          { id: '2', name: 'Queijo extra', price: 5.0 },
          { id: '3', name: 'Azeitona', price: 3.0 },
        ],
        nutritionalInfo: {
          calories: 280,
          protein: 12,
          carbs: 35,
          fat: 10,
        },
        tags: ['Vegetariano', 'Clássico'],
      },
      {
        id: '2',
        name: 'Pizza Pepperoni',
        description: 'Molho de tomate, mussarela e pepperoni',
        price: 52.9,
        cost: 22.0,
        category: 'Pizzas',
        categoryId: '1',
        image:
          'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400',
        isActive: true,
        isAvailable: true,
        isPromotion: true,
        originalPrice: 58.9,
        isBestSeller: false,
        isNew: false,
        allergens: ['Glúten', 'Lactose'],
        preparationTime: 15,
        order: 2,
        variations: [
          { id: '1', name: 'Pequena', price: 42.9, isDefault: false },
          { id: '2', name: 'Média', price: 52.9, isDefault: true },
          { id: '3', name: 'Grande', price: 62.9, isDefault: false },
        ],
        tags: ['Picante'],
      },
      {
        id: '3',
        name: 'Hambúrguer Artesanal',
        description:
          'Pão brioche, carne 180g, queijo cheddar, alface, tomate e molho especial',
        price: 32.9,
        cost: 15.2,
        category: 'Lanches',
        categoryId: '2',
        image:
          'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
        isActive: true,
        isAvailable: true,
        isPromotion: false,
        isBestSeller: true,
        isNew: true,
        allergens: ['Glúten', 'Lactose'],
        preparationTime: 12,
        order: 1,
        variations: [
          { id: '1', name: 'Simples', price: 32.9, isDefault: true },
          { id: '2', name: 'Duplo', price: 42.9, isDefault: false },
        ],
        extras: [
          { id: '1', name: 'Bacon', price: 6.0 },
          { id: '2', name: 'Ovo', price: 4.0 },
          { id: '3', name: 'Batata frita', price: 8.0 },
        ],
        tags: ['Artesanal', 'Gourmet'],
      },
      {
        id: '4',
        name: 'Refrigerante Lata',
        description: 'Coca-Cola, Pepsi, Guaraná ou Fanta - 350ml',
        price: 6.5,
        cost: 2.8,
        category: 'Bebidas',
        categoryId: '3',
        image:
          'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400',
        isActive: true,
        isAvailable: true,
        isPromotion: false,
        isBestSeller: false,
        isNew: false,
        allergens: [],
        preparationTime: 1,
        order: 1,
        variations: [
          { id: '1', name: 'Coca-Cola', price: 6.5, isDefault: true },
          { id: '2', name: 'Pepsi', price: 6.5, isDefault: false },
          { id: '3', name: 'Guaraná', price: 6.5, isDefault: false },
          { id: '4', name: 'Fanta', price: 6.5, isDefault: false },
        ],
        tags: ['Gelado'],
      },
      {
        id: '5',
        name: 'Pudim de Leite',
        description: 'Pudim caseiro com calda de caramelo',
        price: 12.9,
        cost: 4.5,
        category: 'Sobremesas',
        categoryId: '4',
        image:
          'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400',
        isActive: true,
        isAvailable: false,
        isPromotion: false,
        isBestSeller: false,
        isNew: false,
        allergens: ['Lactose', 'Ovo'],
        preparationTime: 5,
        order: 1,
        nutritionalInfo: {
          calories: 220,
          protein: 6,
          carbs: 35,
          fat: 8,
        },
        tags: ['Caseiro', 'Tradicional'],
      },
      {
        id: '6',
        name: 'Prato Executivo - Frango Grelhado',
        description:
          'Frango grelhado, arroz, feijão, batata frita e salada',
        price: 24.9,
        cost: 12.0,
        category: 'Pratos Executivos',
        categoryId: '5',
        image:
          'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=400',
        isActive: true,
        isAvailable: true,
        isPromotion: false,
        isBestSeller: true,
        isNew: false,
        allergens: [],
        preparationTime: 20,
        order: 1,
        schedule: {
          startTime: '11:00',
          endTime: '15:00',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        },
        nutritionalInfo: {
          calories: 650,
          protein: 45,
          carbs: 60,
          fat: 18,
        },
        tags: ['Completo', 'Saudável'],
      },
    ];

    // Mesas mockadas
    const mockTables: Table[] = [
      { id: '1', number: '01', qrCode: generateQRCode('01'), isActive: true },
      { id: '2', number: '02', qrCode: generateQRCode('02'), isActive: true },
      { id: '3', number: '03', qrCode: generateQRCode('03'), isActive: true },
      { id: '4', number: '04', qrCode: generateQRCode('04'), isActive: true },
      { id: '5', number: '05', qrCode: generateQRCode('05'), isActive: true },
    ];

    setCategories(mockCategories);
    setProducts(mockProducts);
    setTables(mockTables);
  };

  const addCategory = (categoryData: Omit<MenuCategory, 'id'>) => {
    const newCategory: MenuCategory = {
      ...categoryData,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, categoryData: Partial<MenuCategory>) => {
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, ...categoryData } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    setProducts(products.filter((p) => p.categoryId !== id));
  };

  const addProduct = (productData: Omit<MenuProduct, 'id'>) => {
    const newProduct: MenuProduct = {
      ...productData,
      id: Date.now().toString(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<MenuProduct>) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, ...productData } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const reorderProducts = (categoryId: string, productIds: string[]) => {
    const updatedProducts = products.map((product) => {
      if (product.categoryId === categoryId) {
        const newOrder = productIds.indexOf(product.id);
        return { ...product, order: newOrder };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const generateTableQR = (tableNumber: string): string => {
    return generateQRCode(tableNumber);
  };

  const getPublicMenu = (restaurantSlug?: string) => {
    // O slug pode ser usado futuramente para buscar cardápio de restaurantes específicos
    console.log('Loading menu for:', restaurantSlug);
    
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDay = now
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();

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
  };

  const getAvailableProducts = (): MenuProduct[] => {
    return products.filter((product) => product.isActive && product.isAvailable);
  };

  return (
    <MenuContext.Provider
      value={{
        categories,
        products,
        tables,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        reorderProducts,
        generateTableQR,
        getPublicMenu,
        getAvailableProducts,
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

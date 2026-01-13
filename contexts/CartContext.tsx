'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { couponApi } from '@/lib/api';

// Types
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  extras?: CartExtra[];
  notes?: string;
  image?: string;
}

interface CartExtra {
  id: string;
  name: string;
  price: number;
}

interface DeliveryAddress {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
  reference?: string;
}

interface OrderInfo {
  type: 'dine-in' | 'delivery' | 'takeaway';
  tableNumber?: string;
  deliveryAddress?: DeliveryAddress;
  deliveryFee?: number;
  estimatedTime?: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  cpf?: string;
}

interface CartContextType {
  // Cart Items
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  
  // Quantities
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  
  // Totals
  itemsCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  
  // Order Info
  orderInfo: OrderInfo | null;
  setOrderInfo: (info: OrderInfo) => void;
  
  // Customer Info
  customerInfo: CustomerInfo | null;
  setCustomerInfo: (info: CustomerInfo) => void;
  
  // Coupon
  couponCode: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  
  // Restaurant
  restaurantSlug: string | null;
  setRestaurantSlug: (slug: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'gastrobi_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [restaurantSlug, setRestaurantSlug] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          setItems(parsed.items || []);
          setOrderInfo(parsed.orderInfo || null);
          setCustomerInfo(parsed.customerInfo || null);
          setCouponCode(parsed.couponCode || null);
          setDiscount(parsed.discount || 0);
          setRestaurantSlug(parsed.restaurantSlug || null);
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
        items,
        orderInfo,
        customerInfo,
        couponCode,
        discount,
        restaurantSlug,
      }));
    }
  }, [items, orderInfo, customerInfo, couponCode, discount, restaurantSlug]);

  // Generate unique ID
  const generateId = () => `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Add item to cart
  const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: generateId(),
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  // Update item in cart
  const updateItem = useCallback((id: string, updates: Partial<CartItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  // Remove item from cart
  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
    setOrderInfo(null);
    setCouponCode(null);
    setDiscount(0);
  }, []);

  // Increase quantity
  const increaseQuantity = useCallback((id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  }, []);

  // Decrease quantity
  const decreaseQuantity = useCallback((id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        if (item.quantity <= 1) {
          return item; // Will be removed separately if needed
        }
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }));
  }, []);

  // Calculate totals
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = items.reduce((sum, item) => {
    const extrasTotal = item.extras?.reduce((e, extra) => e + extra.price, 0) || 0;
    return sum + (item.price + extrasTotal) * item.quantity;
  }, 0);

  const deliveryFee = orderInfo?.deliveryFee || 0;
  
  const total = subtotal + deliveryFee - discount;

  // Apply coupon
  const applyCoupon = useCallback(async (code: string): Promise<boolean> => {
    if (!restaurantSlug) return false;

    try {
      const response = await couponApi.validate(restaurantSlug, {
        code,
        restaurantSlug,
        subtotal,
      });

      if (response.data?.valid) {
        setCouponCode(response.data.code);
        setDiscount(response.data.calculatedDiscount);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error validating coupon:', error);
      return false;
    }
  }, [subtotal, restaurantSlug]);

  // Remove coupon
  const removeCoupon = useCallback(() => {
    setCouponCode(null);
    setDiscount(0);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        itemsCount,
        subtotal,
        deliveryFee,
        discount,
        total,
        orderInfo,
        setOrderInfo,
        customerInfo,
        setCustomerInfo,
        couponCode,
        applyCoupon,
        removeCoupon,
        restaurantSlug,
        setRestaurantSlug,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

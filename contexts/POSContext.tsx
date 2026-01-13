'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { ordersApi, tablesApi } from '@/lib/api';
import { useMenu } from './MenuContext';

// ==================== INTERFACES ====================

interface POSProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  isActive: boolean;
  preparationTime: number;
}

interface POSOrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  observations?: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  addedAt: Date;
}

interface POSOrder {
  id: string;
  type: 'balcao' | 'delivery' | 'mesa' | 'comanda';
  items: POSOrderItem[];
  total: number;
  status: 'open' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  tableNumber?: string;
  tableId?: string;
  comandaNumber?: string;
  customer?: {
    id?: string;
    name: string;
    phone: string;
    address?: string;
    neighborhood?: string;
    deliveryFee?: number;
  };
  paymentMethod?: 'dinheiro' | 'cartao' | 'pix';
  waiterName?: string;
  notes?: string;
}

interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';
  currentOrderId?: string;
  waiter?: string;
}

interface Comanda {
  number: string;
  tableNumber?: string;
  waiterName: string;
  orders: string[];
  status: 'open' | 'closed';
  openedAt: Date;
  total: number;
}

interface KitchenItem extends POSOrderItem {
  orderId: string;
  orderType: string;
  tableNumber?: string;
  comandaNumber?: string;
}

interface POSContextType {
  // Products (from menu)
  products: POSProduct[];
  
  // Orders
  orders: POSOrder[];
  isLoading: boolean;
  addOrder: (order: Omit<POSOrder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateOrder: (id: string, updates: Partial<POSOrder>) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  
  // Tables
  tables: Table[];
  updateTableStatus: (id: string, status: string) => Promise<void>;
  
  // Comandas (local state - no API endpoint)
  comandas: Comanda[];
  createComanda: (tableNumber: string, waiterName: string) => string;
  closeComanda: (number: string) => void;
  
  // Kitchen
  getKitchenOrders: () => KitchenItem[];
  updateItemStatus: (orderId: string, itemId: string, status: POSOrderItem['status']) => void;
  
  // Delivery
  deliveryFees: { [neighborhood: string]: number };
  calculateDeliveryFee: (neighborhood: string) => number;
  
  // Refresh
  refreshOrders: () => Promise<void>;
  refreshKitchen: () => Promise<void>;
  
  // Real-time updates
  subscribeToUpdates: (callback: () => void) => () => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export function POSProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { products: menuProducts, tables: menuTables, refreshTables } = useMenu();
  
  const [orders, setOrders] = useState<POSOrder[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [comandas, setComandasState] = useState<Comanda[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const updateCallbacksRef = useRef<(() => void)[]>([]);

  const restaurantId = user?.currentRestaurant?.id;

  // Delivery fees configuration
  const deliveryFees: { [neighborhood: string]: number } = {
    'Centro': 5.0,
    'Bairro Alto': 7.0,
    'Vila Nova': 8.0,
    'Jardim América': 10.0,
    'Periferia': 12.0,
  };

  // ==================== MAPPERS ====================

  const mapOrderTypeFromApi = (type: string): 'balcao' | 'delivery' | 'mesa' | 'comanda' => {
    switch (type?.toUpperCase()) {
      case 'DINE_IN': return 'mesa';
      case 'TAKEOUT': return 'balcao';
      case 'DELIVERY': return 'delivery';
      default: return 'balcao';
    }
  };

  const mapOrderTypeToApi = (type: string): string => {
    switch (type) {
      case 'mesa': return 'DINE_IN';
      case 'balcao': return 'TAKEOUT';
      case 'delivery': return 'DELIVERY';
      case 'comanda': return 'DINE_IN';
      default: return 'TAKEOUT';
    }
  };

  const mapOrderStatusFromApi = (status: string): 'open' | 'preparing' | 'ready' | 'completed' | 'cancelled' => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
      case 'CONFIRMED': return 'open';
      case 'PREPARING': return 'preparing';
      case 'READY': return 'ready';
      case 'DELIVERED':
      case 'COMPLETED': return 'completed';
      case 'CANCELLED': return 'cancelled';
      default: return 'open';
    }
  };

  const mapOrderFromApi = (o: any): POSOrder => ({
    id: o.id,
    type: mapOrderTypeFromApi(o.type),
    items: (o.items || []).map((item: any) => ({
      id: item.id || Date.now().toString(),
      productId: item.productId,
      productName: item.productName || item.product?.name || '',
      price: item.price || 0,
      quantity: item.quantity || 1,
      observations: item.observations || item.notes,
      status: mapItemStatusFromApi(item.status),
      addedAt: item.addedAt ? new Date(item.addedAt) : new Date()
    })),
    total: o.total || 0,
    status: mapOrderStatusFromApi(o.status),
    createdAt: o.createdAt ? new Date(o.createdAt) : new Date(),
    updatedAt: o.updatedAt ? new Date(o.updatedAt) : new Date(),
    tableNumber: o.table?.number || o.tableNumber,
    tableId: o.tableId,
    customer: o.customer ? {
      id: o.customer.id,
      name: o.customer.name || '',
      phone: o.customer.phone || '',
      address: o.customer.address,
      neighborhood: o.customer.neighborhood,
      deliveryFee: o.deliveryFee
    } : undefined,
    paymentMethod: o.paymentMethod?.toLowerCase(),
    notes: o.notes
  });

  const mapItemStatusFromApi = (status: string): 'pending' | 'preparing' | 'ready' | 'delivered' => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'pending';
      case 'PREPARING': return 'preparing';
      case 'READY': return 'ready';
      case 'DELIVERED': return 'delivered';
      default: return 'pending';
    }
  };

  const mapTableFromMenu = (t: any): Table => ({
    id: t.id,
    number: t.number,
    capacity: t.capacity || 4,
    status: t.status || 'AVAILABLE',
    currentOrderId: t.currentOrderId,
    waiter: t.waiter
  });

  // ==================== PRODUCTS (from Menu) ====================

  const products: POSProduct[] = menuProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    image: p.image,
    isActive: p.isActive && p.isAvailable,
    preparationTime: p.preparationTime
  }));

  // ==================== DATA LOADING ====================

  const refreshOrders = useCallback(async () => {
    if (!restaurantId) return;
    
    try {
      const response = await ordersApi.list(restaurantId);
      if (response.data) {
        const apiData = Array.isArray(response.data) ? response.data : response.data.data || [];
        setOrders(apiData.map(mapOrderFromApi));
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  }, [restaurantId]);

  const refreshKitchen = useCallback(async () => {
    if (!restaurantId) return;
    
    try {
      const response = await ordersApi.kitchen(restaurantId);
      if (response.data) {
        const apiData = Array.isArray(response.data) ? response.data : response.data.data || [];
        // Update orders with kitchen data
        setOrders(prev => {
          const kitchenOrders = apiData.map(mapOrderFromApi);
          const existingIds = new Set(kitchenOrders.map((o: POSOrder) => o.id));
          const otherOrders = prev.filter(o => !existingIds.has(o.id));
          return [...otherOrders, ...kitchenOrders];
        });
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos da cozinha:', error);
    }
  }, [restaurantId]);

  // Sync tables from MenuContext
  useEffect(() => {
    setTables(menuTables.map(mapTableFromMenu));
  }, [menuTables]);

  // Initial data load
  useEffect(() => {
    if (isAuthenticated && restaurantId) {
      setIsLoading(true);
      Promise.all([refreshOrders(), refreshKitchen()])
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated, restaurantId, refreshOrders, refreshKitchen]);

  // ==================== ORDER ACTIONS ====================

  const addOrder = async (orderData: Omit<POSOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    if (!restaurantId) return '';
    
    // Map order for API
    const apiOrder = {
      type: mapOrderTypeToApi(orderData.type),
      tableId: orderData.tableId,
      customerId: orderData.customer?.id,
      items: orderData.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        notes: item.observations
      })),
      notes: orderData.notes,
      deliveryAddress: orderData.customer?.address,
      deliveryFee: orderData.customer?.deliveryFee
    };

    const response = await ordersApi.create(apiOrder, restaurantId);
    
    if (response.data) {
      await refreshOrders();
      notifySubscribers();
      return response.data.id;
    } else {
      throw new Error(response.error || 'Erro ao criar pedido');
    }
  };

  const updateOrder = async (id: string, updates: Partial<POSOrder>) => {
    // Local update for now (API doesn't have full order update)
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, ...updates, updatedAt: new Date() } : o
    ));
    notifySubscribers();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    if (!restaurantId) return;
    
    const response = await ordersApi.updateStatus(id, status, restaurantId);
    if (response.data || response.status === 200) {
      await refreshOrders();
      notifySubscribers();
    } else {
      throw new Error(response.error || 'Erro ao atualizar status do pedido');
    }
  };

  const cancelOrder = async (id: string) => {
    if (!restaurantId) return;
    
    const response = await ordersApi.cancel(id, restaurantId);
    if (response.data || response.status === 200) {
      await refreshOrders();
      notifySubscribers();
    } else {
      throw new Error(response.error || 'Erro ao cancelar pedido');
    }
  };

  // ==================== TABLE ACTIONS ====================

  const updateTableStatus = async (id: string, status: string) => {
    if (!restaurantId) return;
    
    await tablesApi.updateStatus(id, status, restaurantId);
    await refreshTables();
    notifySubscribers();
  };

  // ==================== COMANDA ACTIONS (Local) ====================

  const createComanda = (tableNumber: string, waiterName: string): string => {
    const comandaNumber = `C${Date.now()}`;
    const newComanda: Comanda = {
      number: comandaNumber,
      tableNumber,
      waiterName,
      orders: [],
      status: 'open',
      openedAt: new Date(),
      total: 0
    };
    setComandasState(prev => [...prev, newComanda]);
    notifySubscribers();
    return comandaNumber;
  };

  const closeComanda = (number: string) => {
    setComandasState(prev => 
      prev.map(c => c.number === number ? { ...c, status: 'closed' as const } : c)
    );
    notifySubscribers();
  };

  // ==================== KITCHEN ====================

  const getKitchenOrders = (): KitchenItem[] => {
    const kitchenItems: KitchenItem[] = [];
    
    orders
      .filter(o => o.status === 'open' || o.status === 'preparing')
      .forEach(order => {
        order.items
          .filter(item => item.status !== 'delivered')
          .forEach(item => {
            kitchenItems.push({
              ...item,
              orderId: order.id,
              orderType: order.type,
              tableNumber: order.tableNumber,
              comandaNumber: order.comandaNumber
            });
          });
      });
    
    return kitchenItems.sort((a, b) => 
      new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
    );
  };

  const updateItemStatus = (orderId: string, itemId: string, status: POSOrderItem['status']) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item =>
          item.id === itemId ? { ...item, status } : item
        );
        
        // Check if all items are ready or delivered
        const allReady = updatedItems.every(item => 
          item.status === 'ready' || item.status === 'delivered'
        );
        
        return {
          ...order,
          items: updatedItems,
          status: allReady ? 'ready' as const : 'preparing' as const,
          updatedAt: new Date()
        };
      }
      return order;
    }));
    notifySubscribers();
  };

  // ==================== DELIVERY ====================

  const calculateDeliveryFee = (neighborhood: string): number => {
    return deliveryFees[neighborhood] || 15.0;
  };

  // ==================== SUBSCRIBERS ====================

  const notifySubscribers = () => {
    updateCallbacksRef.current.forEach(callback => callback());
  };

  const subscribeToUpdates = (callback: () => void) => {
    updateCallbacksRef.current.push(callback);
    return () => {
      updateCallbacksRef.current = updateCallbacksRef.current.filter(cb => cb !== callback);
    };
  };

  // ==================== CONTEXT VALUE ====================

  return (
    <POSContext.Provider
      value={{
        // Products
        products,
        
        // Orders
        orders,
        isLoading,
        addOrder,
        updateOrder,
        updateOrderStatus,
        cancelOrder,
        
        // Tables
        tables,
        updateTableStatus,
        
        // Comandas
        comandas,
        createComanda,
        closeComanda,
        
        // Kitchen
        getKitchenOrders,
        updateItemStatus,
        
        // Delivery
        deliveryFees,
        calculateDeliveryFee,
        
        // Refresh
        refreshOrders,
        refreshKitchen,
        
        // Subscribers
        subscribeToUpdates,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}

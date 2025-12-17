'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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

  // Específicos por tipo
  tableNumber?: string;
  comandaNumber?: string;
  customer?: {
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
  number: string;
  status: 'available' | 'occupied' | 'reserved';
  currentOrder?: string;
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

interface POSContextType {
  // Products
  products: POSProduct[];

  // Orders
  orders: POSOrder[];
  addOrder: (
    order: Omit<POSOrder, 'id' | 'createdAt' | 'updatedAt'>
  ) => string;
  updateOrder: (id: string, updates: Partial<POSOrder>) => void;
  updateOrderItem: (
    orderId: string,
    itemId: string,
    updates: Partial<POSOrderItem>
  ) => void;

  // Tables
  tables: Table[];
  updateTable: (number: string, updates: Partial<Table>) => void;

  // Comandas
  comandas: Comanda[];
  createComanda: (tableNumber: string, waiterName: string) => string;
  closeComanda: (number: string) => void;

  // Kitchen/Bar
  getKitchenOrders: () => (POSOrderItem & { orderId: string; orderType: string; tableNumber?: string; comandaNumber?: string })[];
  updateItemStatus: (
    orderId: string,
    itemId: string,
    status: POSOrderItem['status']
  ) => void;

  // Delivery
  deliveryFees: { [neighborhood: string]: number };
  calculateDeliveryFee: (neighborhood: string) => number;

  // Real-time updates
  subscribeToUpdates: (callback: () => void) => () => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export function POSProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<POSProduct[]>([]);
  const [orders, setOrders] = useState<POSOrder[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [comandas, setComandasState] = useState<Comanda[]>([]);
  const [updateCallbacks, setUpdateCallbacks] = useState<(() => void)[]>([]);

  const deliveryFees: { [neighborhood: string]: number } = {
    Centro: 5.0,
    'Bairro Alto': 7.0,
    'Vila Nova': 8.0,
    'Jardim América': 10.0,
    Periferia: 12.0,
  };

  useEffect(() => {
    if (user) {
      initializePOSData();
    }
  }, [user]);

  const initializePOSData = () => {
    // Mock products
    const mockProducts: POSProduct[] = [
      {
        id: '1',
        name: 'Hambúrguer Clássico',
        price: 25.9,
        category: 'Lanches',
        isActive: true,
        preparationTime: 15,
      },
      {
        id: '2',
        name: 'Pizza Margherita',
        price: 35.9,
        category: 'Pizzas',
        isActive: true,
        preparationTime: 20,
      },
      {
        id: '3',
        name: 'Refrigerante Lata',
        price: 5.5,
        category: 'Bebidas',
        isActive: true,
        preparationTime: 1,
      },
      {
        id: '4',
        name: 'Batata Frita',
        price: 12.9,
        category: 'Acompanhamentos',
        isActive: true,
        preparationTime: 10,
      },
      {
        id: '5',
        name: 'Cerveja Long Neck',
        price: 8.9,
        category: 'Bebidas',
        isActive: true,
        preparationTime: 2,
      },
    ];

    // Mock tables
    const mockTables: Table[] = Array.from({ length: 20 }, (_, i) => ({
      number: String(i + 1).padStart(2, '0'),
      status: 'available' as const,
    }));

    setProducts(mockProducts);
    setTables(mockTables);
  };

  const notifyUpdates = () => {
    updateCallbacks.forEach((callback) => callback());
  };

  const addOrder = (
    orderData: Omit<POSOrder, 'id' | 'createdAt' | 'updatedAt'>
  ): string => {
    const newOrder: POSOrder = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setOrders((prev) => [...prev, newOrder]);
    notifyUpdates();
    return newOrder.id;
  };

  const updateOrder = (id: string, updates: Partial<POSOrder>) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? { ...order, ...updates, updatedAt: new Date() }
          : order
      )
    );
    notifyUpdates();
  };

  const updateOrderItem = (
    orderId: string,
    itemId: string,
    updates: Partial<POSOrderItem>
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
              updatedAt: new Date(),
            }
          : order
      )
    );
    notifyUpdates();
  };

  const updateTable = (number: string, updates: Partial<Table>) => {
    setTables((prev) =>
      prev.map((table) =>
        table.number === number ? { ...table, ...updates } : table
      )
    );
    notifyUpdates();
  };

  const createComanda = (tableNumber: string, waiterName: string): string => {
    const comandaNumber = `C${Date.now().toString().slice(-4)}`;
    const newComanda: Comanda = {
      number: comandaNumber,
      tableNumber,
      waiterName,
      orders: [],
      status: 'open',
      openedAt: new Date(),
      total: 0,
    };

    setComandasState((prev) => [...prev, newComanda]);
    updateTable(tableNumber, { status: 'occupied', waiter: waiterName });
    notifyUpdates();
    return comandaNumber;
  };

  const closeComanda = (number: string) => {
    setComandasState((prev) =>
      prev.map((comanda) =>
        comanda.number === number ? { ...comanda, status: 'closed' } : comanda
      )
    );

    const comanda = comandas.find((c) => c.number === number);
    if (comanda?.tableNumber) {
      updateTable(comanda.tableNumber, {
        status: 'available',
        waiter: undefined,
        currentOrder: undefined,
      });
    }
    notifyUpdates();
  };

  const getKitchenOrders = (): (POSOrderItem & { orderId: string; orderType: string; tableNumber?: string; comandaNumber?: string })[] => {
    return orders
      .filter(
        (order) =>
          order.status !== 'completed' && order.status !== 'cancelled'
      )
      .flatMap((order) =>
        order.items
          .filter((item) => item.status !== 'delivered')
          .map((item) => ({
            ...item,
            orderId: order.id,
            orderType: order.type,
            tableNumber: order.tableNumber,
            comandaNumber: order.comandaNumber,
          }))
      );
  };

  const updateItemStatus = (
    orderId: string,
    itemId: string,
    status: POSOrderItem['status']
  ) => {
    updateOrderItem(orderId, itemId, { status });
  };

  const calculateDeliveryFee = (neighborhood: string): number => {
    return deliveryFees[neighborhood] || 15.0; // Taxa padrão
  };

  const subscribeToUpdates = (callback: () => void): (() => void) => {
    setUpdateCallbacks((prev) => [...prev, callback]);
    return () => {
      setUpdateCallbacks((prev) => prev.filter((cb) => cb !== callback));
    };
  };

  return (
    <POSContext.Provider
      value={{
        products,
        orders,
        addOrder,
        updateOrder,
        updateOrderItem,
        tables,
        updateTable,
        comandas,
        createComanda,
        closeComanda,
        getKitchenOrders,
        updateItemStatus,
        deliveryFees,
        calculateDeliveryFee,
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

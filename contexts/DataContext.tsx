'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  customersApi, 
  campaignsApi, 
  loyaltyApi, 
  dashboardApi, 
  alertsApi 
} from '@/lib/api';

// ==================== INTERFACES ====================

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: Date;
  totalSpent: number;
  visitCount: number;
  visits: number;
  points: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  status: 'active' | 'inactive';
  classification: 'new' | 'recurrent' | 'vip' | 'inactive';
  preferences: string[];
  birthday?: Date;
  referralCode: string;
  referredBy?: string;
  createdAt: Date;
  tags: string[];
  notes: string;
  averageTicket: number;
  daysSinceLastVisit: number;
  loyaltyTier: {
    current: string;
    nextTier: string;
    pointsToNext: number;
    benefits: string[];
  };
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  popularity: number;
  profit: number;
  margin: number;
  ingredients: string[];
  allergens: string[];
  preparationTime: number;
  isActive: boolean;
  image?: string;
  description: string;
}

interface Campaign {
  id: string;
  name: string;
  type: 'whatsapp' | 'sms' | 'email' | 'push';
  status: 'draft' | 'scheduled' | 'sent' | 'active' | 'paused' | 'completed';
  targetAudience: string;
  message: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  redeemRate: number;
  createdAt: Date;
  scheduledFor?: Date;
  segmentation: CampaignSegmentation;
  performance: CampaignPerformance;
}

interface CampaignSegmentation {
  customerLevel?: string[];
  lastVisitDays?: number;
  totalSpentMin?: number;
  totalSpentMax?: number;
  visitCountMin?: number;
  tags?: string[];
  birthday?: boolean;
}

interface CampaignPerformance {
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  roi: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

interface LoyaltyRule {
  id: string;
  name: string;
  type: 'purchase' | 'visit' | 'referral' | 'birthday' | 'review';
  points: number;
  description: string;
  conditions?: unknown;
  isActive: boolean;
}

interface DashboardData {
  revenue: {
    total: number;
    daily: number;
    weekly: number;
    monthly: number;
    previousPeriodChange: number;
  };
  orders: {
    total: number;
    today: number;
    pending: number;
    preparing: number;
    completed: number;
    cancelled: number;
    previousPeriodChange: number;
  };
  customers: {
    total: number;
    active: number;
    inactive: number;
    new: number;
    vip: number;
    previousPeriodChange: number;
  };
  averageTicket: {
    value: number;
    previousPeriodChange: number;
  };
  loyalty: {
    totalPoints: number;
    averagePoints: number;
    redemptions: number;
  };
}

interface MonthlyData {
  month: string;
  year: number;
  revenue: number;
  orders: number;
  customers: number;
  averageTicket: number;
}

interface TopProduct {
  id: string;
  name: string;
  category: string;
  image?: string;
  price: number;
  salesCount: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  orderNumber: number;
  type: string;
  tableNumber?: string;
  status: string;
  total: number;
  itemsCount: number;
  createdAt: Date;
  customer?: {
    id: string;
    name: string;
  };
}

interface DataContextType {
  // State
  customers: Customer[];
  products: Product[];
  campaigns: Campaign[];
  alerts: Alert[];
  loyaltyRules: LoyaltyRule[];
  dashboardData: DashboardData | null;
  monthlyData: MonthlyData[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  isLoading: boolean;
  
  // Customer Actions
  addCustomer: (customer: Partial<Customer>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  
  // Campaign Actions
  addCampaign: (campaign: Partial<Campaign>) => Promise<void>;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  
  // Loyalty Actions
  addLoyaltyRule: (rule: Partial<LoyaltyRule>) => Promise<void>;
  updateLoyaltyRule: (id: string, rule: Partial<LoyaltyRule>) => Promise<void>;
  deleteLoyaltyRule: (id: string) => Promise<void>;
  
  // Alert Actions
  markAlertAsRead: (id: string) => Promise<void>;
  markAllAlertsAsRead: () => Promise<void>;
  
  // Product actions (synced with MenuContext)
  addProduct: (product: Partial<Product>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  
  // Data Refresh
  refreshData: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  refreshCustomers: () => Promise<void>;
  refreshCampaigns: () => Promise<void>;
  refreshAlerts: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  
  // State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loyaltyRules, setLoyaltyRules] = useState<LoyaltyRule[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const restaurantId = user?.currentRestaurant?.id;

  // ==================== HELPER FUNCTIONS ====================

  const mapCustomerFromApi = (c: any): Customer => ({
    id: c.id,
    name: c.name || '',
    email: c.email || '',
    phone: c.phone || '',
    lastVisit: c.lastVisit ? new Date(c.lastVisit) : new Date(),
    totalSpent: c.totalSpent || 0,
    visitCount: c.visitCount || 0,
    visits: c.visitCount || 0,
    points: c.points || 0,
    level: (c.level || 'bronze').toLowerCase(),
    status: c.status || 'active',
    classification: calculateClassification(c),
    preferences: c.preferences || [],
    birthday: c.birthday ? new Date(c.birthday) : undefined,
    referralCode: c.referralCode || '',
    referredBy: c.referredBy,
    createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
    tags: c.tags || [],
    notes: c.notes || '',
    averageTicket: c.totalSpent && c.visitCount ? c.totalSpent / c.visitCount : 0,
    daysSinceLastVisit: c.lastVisit 
      ? Math.floor((Date.now() - new Date(c.lastVisit).getTime()) / (1000 * 60 * 60 * 24)) 
      : 0,
    loyaltyTier: c.loyaltyTier || {
      current: (c.level || 'bronze').charAt(0).toUpperCase() + (c.level || 'bronze').slice(1),
      nextTier: getNextTier(c.level),
      pointsToNext: getPointsToNext(c.points || 0, c.level),
      benefits: getBenefits(c.level)
    }
  });

  const calculateClassification = (c: any): 'new' | 'recurrent' | 'vip' | 'inactive' => {
    const daysSinceLastVisit = c.lastVisit 
      ? Math.floor((Date.now() - new Date(c.lastVisit).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    if (daysSinceLastVisit > 30) return 'inactive';
    if (c.totalSpent > 2000 && c.visitCount > 20) return 'vip';
    if (c.visitCount > 5) return 'recurrent';
    return 'new';
  };

  const getNextTier = (level: string): string => {
    switch ((level || '').toLowerCase()) {
      case 'bronze': return 'Silver';
      case 'silver': return 'Gold';
      case 'gold': return 'Platinum';
      case 'platinum': return 'Platinum';
      default: return 'Silver';
    }
  };

  const getPointsToNext = (points: number, level: string): number => {
    switch ((level || '').toLowerCase()) {
      case 'bronze': return Math.max(0, 200 - points);
      case 'silver': return Math.max(0, 500 - points);
      case 'gold': return Math.max(0, 1000 - points);
      default: return Math.max(0, 200 - points);
    }
  };

  const getBenefits = (level: string): string[] => {
    switch ((level || '').toLowerCase()) {
      case 'platinum': return ['15% desconto', 'Entrega grátis', 'Atendimento prioritário', 'Eventos exclusivos'];
      case 'gold': return ['10% desconto', 'Entrega grátis', 'Prioridade no atendimento'];
      case 'silver': return ['5% desconto', 'Pontos dobrados no aniversário'];
      default: return ['Pontos por compra'];
    }
  };

  const mapCampaignFromApi = (c: any): Campaign => ({
    id: c.id,
    name: c.name || '',
    type: (c.type || 'whatsapp').toLowerCase(),
    status: (c.status || 'draft').toLowerCase(),
    targetAudience: c.targetAudience || '',
    message: c.message || '',
    sentCount: c.sentCount || 0,
    openRate: c.openRate || 0,
    clickRate: c.clickRate || 0,
    redeemRate: c.redeemRate || 0,
    createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
    scheduledFor: c.scheduledFor ? new Date(c.scheduledFor) : undefined,
    segmentation: c.segmentation || {},
    performance: c.performance || {
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      roi: 0
    }
  });

  const mapAlertFromApi = (a: any): Alert => ({
    id: a.id,
    type: a.type || 'info',
    title: a.title || '',
    message: a.message || '',
    createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
    isRead: a.isRead || false,
    actionUrl: a.actionUrl,
    priority: a.priority || 'low'
  });

  // ==================== DATA LOADING ====================

  const refreshCustomers = useCallback(async () => {
    if (!restaurantId) return;
    
    try {
      const response = await customersApi.list(restaurantId);
      if (response.data) {
        const responseData = response.data as any;
        const apiData = Array.isArray(responseData) ? responseData : responseData.data || [];
        setCustomers(apiData.map(mapCustomerFromApi));
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  }, [restaurantId]);

  const refreshCampaigns = useCallback(async () => {
    if (!restaurantId) return;
    
    try {
      const response = await campaignsApi.list(restaurantId);
      if (response.data) {
        const responseData = response.data as any;
        const apiData = Array.isArray(responseData) ? responseData : responseData.data || [];
        setCampaigns(apiData.map(mapCampaignFromApi));
      }
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
    }
  }, [restaurantId]);

  const refreshLoyaltyRules = useCallback(async () => {
    if (!restaurantId) return;
    
    try {
      const response = await loyaltyApi.listRules(restaurantId);
      if (response.data) {
        const responseData = response.data as any;
        const apiData = Array.isArray(responseData) ? responseData : responseData.data || [];
        setLoyaltyRules(apiData);
      }
    } catch (error) {
      console.error('Erro ao carregar regras de fidelidade:', error);
    }
  }, [restaurantId]);

  const refreshAlerts = useCallback(async () => {
    if (!restaurantId) return;
    
    try {
      const response = await alertsApi.list(restaurantId);
      if (response.data) {
        const responseData = response.data as any;
        const apiData = Array.isArray(responseData) ? responseData : responseData.data || [];
        setAlerts(apiData.map(mapAlertFromApi));
      }
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    }
  }, [restaurantId]);

  const refreshDashboard = useCallback(async () => {
    if (!restaurantId) return;
    
    try {
      // Carregar métricas do dashboard
      const metricsResponse = await dashboardApi.metrics(restaurantId);
      if (metricsResponse.data) {
        setDashboardData(metricsResponse.data);
      }

      // Carregar dados mensais
      const monthlyResponse = await dashboardApi.monthly(restaurantId);
      if (monthlyResponse.data) {
        const apiData = Array.isArray(monthlyResponse.data) ? monthlyResponse.data : monthlyResponse.data.data || [];
        setMonthlyData(apiData);
      }

      // Carregar produtos top
      const topProductsResponse = await dashboardApi.topProducts(restaurantId);
      if (topProductsResponse.data) {
        const apiData = Array.isArray(topProductsResponse.data) ? topProductsResponse.data : topProductsResponse.data.data || [];
        setTopProducts(apiData);
      }

      // Carregar pedidos recentes
      const recentOrdersResponse = await dashboardApi.recentOrders(restaurantId);
      if (recentOrdersResponse.data) {
        const apiData = Array.isArray(recentOrdersResponse.data) ? recentOrdersResponse.data : recentOrdersResponse.data.data || [];
        setRecentOrders(apiData.map((o: any) => ({
          ...o,
          createdAt: o.createdAt ? new Date(o.createdAt) : new Date()
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    }
  }, [restaurantId]);

  const refreshData = useCallback(async () => {
    if (!restaurantId) return;
    
    setIsLoading(true);
    try {
      await Promise.all([
        refreshCustomers(),
        refreshCampaigns(),
        refreshLoyaltyRules(),
        refreshAlerts(),
        refreshDashboard()
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, refreshCustomers, refreshCampaigns, refreshLoyaltyRules, refreshAlerts, refreshDashboard]);

  // ==================== EFFECTS ====================

  useEffect(() => {
    if (isAuthenticated && restaurantId) {
      refreshData();
    }
  }, [isAuthenticated, restaurantId, refreshData]);

  // ==================== CUSTOMER ACTIONS ====================

  const addCustomer = async (customerData: Partial<Customer>) => {
    if (!restaurantId) return;
    
    const response = await customersApi.create(customerData, restaurantId);
    if (response.data) {
      await refreshCustomers();
    } else {
      throw new Error(response.error || 'Erro ao criar cliente');
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    if (!restaurantId) return;
    
    const response = await customersApi.update(id, customerData, restaurantId);
    if (response.data) {
      await refreshCustomers();
    } else {
      throw new Error(response.error || 'Erro ao atualizar cliente');
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!restaurantId) return;
    
    const response = await customersApi.delete(id, restaurantId);
    if (response.status === 200 || response.status === 204) {
      await refreshCustomers();
    } else {
      throw new Error(response.error || 'Erro ao deletar cliente');
    }
  };

  // ==================== CAMPAIGN ACTIONS ====================

  const addCampaign = async (campaignData: Partial<Campaign>) => {
    if (!restaurantId) return;
    
    const response = await campaignsApi.create(campaignData, restaurantId);
    if (response.data) {
      await refreshCampaigns();
    } else {
      throw new Error(response.error || 'Erro ao criar campanha');
    }
  };

  const updateCampaign = async (id: string, campaignData: Partial<Campaign>) => {
    if (!restaurantId) return;
    
    const response = await campaignsApi.update(id, campaignData, restaurantId);
    if (response.data) {
      await refreshCampaigns();
    } else {
      throw new Error(response.error || 'Erro ao atualizar campanha');
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!restaurantId) return;
    
    const response = await campaignsApi.delete(id, restaurantId);
    if (response.status === 200 || response.status === 204) {
      await refreshCampaigns();
    } else {
      throw new Error(response.error || 'Erro ao deletar campanha');
    }
  };

  // ==================== LOYALTY ACTIONS ====================

  const addLoyaltyRule = async (ruleData: Partial<LoyaltyRule>) => {
    if (!restaurantId) return;
    
    const response = await loyaltyApi.createRule(ruleData, restaurantId);
    if (response.data) {
      await refreshLoyaltyRules();
    } else {
      throw new Error(response.error || 'Erro ao criar regra');
    }
  };

  const updateLoyaltyRule = async (id: string, ruleData: Partial<LoyaltyRule>) => {
    if (!restaurantId) return;
    
    const response = await loyaltyApi.updateRule(id, ruleData, restaurantId);
    if (response.data) {
      await refreshLoyaltyRules();
    } else {
      throw new Error(response.error || 'Erro ao atualizar regra');
    }
  };

  const deleteLoyaltyRule = async (id: string) => {
    if (!restaurantId) return;
    
    const response = await loyaltyApi.deleteRule(id, restaurantId);
    if (response.status === 200 || response.status === 204) {
      await refreshLoyaltyRules();
    } else {
      throw new Error(response.error || 'Erro ao deletar regra');
    }
  };

  // ==================== ALERT ACTIONS ====================

  const markAlertAsRead = async (id: string) => {
    if (!restaurantId) return;
    
    const response = await alertsApi.markAsRead(id, restaurantId);
    if (response.data || response.status === 200) {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
    }
  };

  const markAllAlertsAsRead = async () => {
    if (!restaurantId) return;
    
    const response = await alertsApi.markAllAsRead(restaurantId);
    if (response.data || response.status === 200) {
      setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
    }
  };

  // ==================== PRODUCT ACTIONS (for compatibility) ====================
  
  const addProduct = (productData: Partial<Product>) => {
    // Products are managed by MenuContext, this is for backwards compatibility
    setProducts(prev => [...prev, { ...productData, id: Date.now().toString() } as Product]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productData } : p));
  };

  // ==================== CONTEXT VALUE ====================

  return (
    <DataContext.Provider
      value={{
        // State
        customers,
        products,
        campaigns,
        alerts,
        loyaltyRules,
        dashboardData,
        monthlyData,
        topProducts,
        recentOrders,
        isLoading,
        
        // Customer Actions
        addCustomer,
        updateCustomer,
        deleteCustomer,
        
        // Campaign Actions
        addCampaign,
        updateCampaign,
        deleteCampaign,
        
        // Loyalty Actions
        addLoyaltyRule,
        updateLoyaltyRule,
        deleteLoyaltyRule,
        
        // Alert Actions
        markAlertAsRead,
        markAllAlertsAsRead,
        
        // Product Actions
        addProduct,
        updateProduct,
        
        // Data Refresh
        refreshData,
        refreshDashboard,
        refreshCustomers,
        refreshCampaigns,
        refreshAlerts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { subDays, format, addDays } from 'date-fns';
import { useAuth } from './AuthContext';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: Date;
  totalSpent: number;
  visitCount: number;
  points: number;
  level: 'bronze' | 'silver' | 'gold';
  status: 'active' | 'inactive';
  classification: 'new' | 'recurrent' | 'vip' | 'inactive';
  preferences: string[];
  orders: Order[];
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

interface Order {
  id: string;
  date: Date;
  total: number;
  items: OrderItem[];
  paymentMethod: string;
  discount?: number;
  couponUsed?: string;
  profit: number;
}

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  cost: number;
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
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface Campaign {
  id: string;
  name: string;
  type: 'whatsapp' | 'sms' | 'email';
  status: 'draft' | 'scheduled' | 'sent' | 'active' | 'paused';
  targetAudience: string;
  message: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  redeemRate: number;
  createdAt: Date;
  scheduledFor?: Date;
  automationRules?: AutomationRule[];
  segmentation: CampaignSegmentation;
  performance: CampaignPerformance;
}

interface AutomationRule {
  id: string;
  trigger: 'birthday' | 'inactive' | 'first_purchase' | 'high_value' | 'anniversary';
  condition: string;
  action: 'send_coupon' | 'send_message' | 'add_points' | 'upgrade_tier';
  value?: any;
  isActive: boolean;
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
  type: 'purchase' | 'checkin' | 'birthday' | 'referral' | 'social_share' | 'review';
  points: number;
  description: string;
  conditions?: any;
  isActive: boolean;
}

interface DataContextType {
  customers: Customer[];
  products: Product[];
  campaigns: Campaign[];
  alerts: Alert[];
  loyaltyRules: LoyaltyRule[];
  dashboardData: any;
  addCustomer: (customer: Omit<Customer, 'id' | 'orders' | 'createdAt' | 'referralCode' | 'loyaltyTier' | 'classification' | 'averageTicket' | 'daysSinceLastVisit'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  addProduct: (product: Omit<Product, 'id' | 'margin'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'performance'>) => void;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  addLoyaltyRule: (rule: Omit<LoyaltyRule, 'id'>) => void;
  updateLoyaltyRule: (id: string, rule: Partial<LoyaltyRule>) => void;
  markAlertAsRead: (id: string) => void;
  generateSmartCoupon: (customerId: string) => any;
  sendAutomatedCampaign: (ruleId: string, customerId: string) => void;
  calculateCustomerLTV: (customerId: string) => number;
  getCustomerSegmentation: () => any;
  getProductPerformance: () => any;
  refreshAlerts: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loyaltyRules, setLoyaltyRules] = useState<LoyaltyRule[]>([]);

  useEffect(() => {
    if (user) {
      initializeData();
    }
  }, [user]);

  const initializeData = () => {
    // Dados mockados mais realistas
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'Maria Silva',
        email: 'maria@email.com',
        phone: '(11) 99999-1111',
        lastVisit: subDays(new Date(), 2),
        totalSpent: 2850.50,
        visitCount: 45,
        points: 285,
        level: 'gold',
        status: 'active',
        classification: 'vip',
        preferences: ['Pizza', 'Massas', 'Vinho'],
        birthday: new Date('1985-03-15'),
        referralCode: 'MARIA2024',
        createdAt: subDays(new Date(), 365),
        tags: ['vip', 'frequente'],
        notes: 'Cliente preferencial, sempre pede pizza margherita',
        averageTicket: 63.34,
        daysSinceLastVisit: 2,
        loyaltyTier: {
          current: 'Gold',
          nextTier: 'Platinum',
          pointsToNext: 215,
          benefits: ['10% desconto', 'Entrega grátis', 'Prioridade no atendimento']
        },
        orders: [
          {
            id: '1',
            date: subDays(new Date(), 2),
            total: 89.90,
            profit: 35.60,
            items: [
              { productId: '1', name: 'Pizza Margherita', quantity: 1, price: 45.90, cost: 18.50 },
              { productId: '2', name: 'Refrigerante', quantity: 2, price: 22.00, cost: 8.00 }
            ],
            paymentMethod: 'Cartão de Crédito'
          }
        ]
      },
      {
        id: '2',
        name: 'João Santos',
        email: 'joao@email.com',
        phone: '(11) 88888-2222',
        lastVisit: subDays(new Date(), 15),
        totalSpent: 1200.00,
        visitCount: 20,
        points: 120,
        level: 'silver',
        status: 'inactive',
        classification: 'inactive',
        preferences: ['Hambúrguer', 'Batata Frita'],
        birthday: new Date('1990-07-22'),
        referralCode: 'JOAO2024',
        createdAt: subDays(new Date(), 180),
        tags: ['inativo'],
        notes: 'Cliente não visita há 15 dias',
        averageTicket: 60.00,
        daysSinceLastVisit: 15,
        loyaltyTier: {
          current: 'Silver',
          nextTier: 'Gold',
          pointsToNext: 80,
          benefits: ['5% desconto', 'Pontos dobrados no aniversário']
        },
        orders: []
      },
      {
        id: '3',
        name: 'Ana Costa',
        email: 'ana@email.com',
        phone: '(11) 77777-3333',
        lastVisit: subDays(new Date(), 1),
        totalSpent: 890.30,
        visitCount: 12,
        points: 89,
        level: 'bronze',
        status: 'active',
        classification: 'recurrent',
        preferences: ['Saladas', 'Sucos'],
        birthday: new Date('1992-11-08'),
        referralCode: 'ANA2024',
        createdAt: subDays(new Date(), 90),
        tags: ['saudável'],
        notes: 'Prefere opções saudáveis',
        averageTicket: 74.19,
        daysSinceLastVisit: 1,
        loyaltyTier: {
          current: 'Bronze',
          nextTier: 'Silver',
          pointsToNext: 111,
          benefits: ['Pontos por compra']
        },
        orders: []
      }
    ];

    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Pizza Margherita',
        category: 'Pizza',
        price: 45.90,
        cost: 18.50,
        popularity: 95,
        profit: 27.40,
        margin: 59.7,
        ingredients: ['Molho de tomate', 'Mussarela', 'Manjericão', 'Massa'],
        allergens: ['Glúten', 'Lactose'],
        preparationTime: 15,
        isActive: true,
        description: 'Pizza clássica italiana com molho de tomate, mussarela e manjericão fresco',
        nutritionalInfo: {
          calories: 280,
          protein: 12,
          carbs: 35,
          fat: 10
        }
      },
      {
        id: '2',
        name: 'Hambúrguer Artesanal',
        category: 'Lanches',
        price: 32.90,
        cost: 15.20,
        popularity: 88,
        profit: 17.70,
        margin: 53.8,
        ingredients: ['Pão brioche', 'Carne 180g', 'Queijo cheddar', 'Alface', 'Tomate'],
        allergens: ['Glúten', 'Lactose'],
        preparationTime: 12,
        isActive: true,
        description: 'Hambúrguer artesanal com carne premium e ingredientes frescos'
      },
      {
        id: '3',
        name: 'Salada Caesar',
        category: 'Saladas',
        price: 28.90,
        cost: 12.50,
        popularity: 67,
        profit: 16.40,
        margin: 56.7,
        ingredients: ['Alface romana', 'Frango grelhado', 'Parmesão', 'Croutons', 'Molho caesar'],
        allergens: ['Lactose', 'Ovo'],
        preparationTime: 8,
        isActive: true,
        description: 'Salada caesar tradicional com frango grelhado e molho especial'
      }
    ];

    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Promoção de Fim de Semana',
        type: 'whatsapp',
        status: 'sent',
        targetAudience: 'Clientes Ativos',
        message: '🍕 Promoção especial! 20% off em todas as pizzas neste fim de semana!',
        sentCount: 234,
        openRate: 78,
        clickRate: 23,
        redeemRate: 12,
        createdAt: subDays(new Date(), 3),
        segmentation: {
          customerLevel: ['gold', 'silver'],
          lastVisitDays: 30
        },
        performance: {
          delivered: 234,
          opened: 182,
          clicked: 54,
          converted: 28,
          revenue: 1250.00,
          roi: 4.2
        }
      },
      {
        id: '2',
        name: 'Reativação de Clientes',
        type: 'email',
        status: 'scheduled',
        targetAudience: 'Clientes Inativos',
        message: 'Sentimos sua falta! Volte e ganhe 50% de desconto no seu próximo pedido.',
        sentCount: 0,
        openRate: 0,
        clickRate: 0,
        redeemRate: 0,
        createdAt: new Date(),
        scheduledFor: addDays(new Date(), 1),
        segmentation: {
          lastVisitDays: 30,
          totalSpentMin: 100
        },
        performance: {
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          revenue: 0,
          roi: 0
        }
      }
    ];

    const mockLoyaltyRules: LoyaltyRule[] = [
      {
        id: '1',
        name: 'Compra realizada',
        type: 'purchase',
        points: 10,
        description: '10 pontos a cada R$ 10,00 gastos',
        isActive: true
      },
      {
        id: '2',
        name: 'Check-in no restaurante',
        type: 'checkin',
        points: 25,
        description: '25 pontos por check-in via app',
        isActive: true
      },
      {
        id: '3',
        name: 'Aniversário',
        type: 'birthday',
        points: 100,
        description: '100 pontos no mês do aniversário',
        isActive: true
      },
      {
        id: '4',
        name: 'Indicação de amigo',
        type: 'referral',
        points: 150,
        description: '150 pontos por amigo que fizer primeira compra',
        isActive: true
      },
      {
        id: '5',
        name: 'Compartilhamento social',
        type: 'social_share',
        points: 20,
        description: '20 pontos por compartilhamento nas redes sociais',
        isActive: true
      },
      {
        id: '6',
        name: 'Avaliação no Google',
        type: 'review',
        points: 50,
        description: '50 pontos por avaliação 5 estrelas no Google',
        isActive: true
      }
    ];

    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'warning',
        title: 'Cliente inativo detectado',
        message: 'João Santos não visita há 15 dias. Considere enviar uma campanha de reativação.',
        createdAt: subDays(new Date(), 1),
        isRead: false,
        actionUrl: '/customers/2',
        priority: 'medium'
      },
      {
        id: '2',
        type: 'info',
        title: 'Aniversário próximo',
        message: 'Ana Costa faz aniversário em 3 dias. Envie uma mensagem especial!',
        createdAt: subDays(new Date(), 1),
        isRead: false,
        actionUrl: '/customers/3',
        priority: 'low'
      },
      {
        id: '3',
        type: 'success',
        title: 'Meta de vendas atingida',
        message: 'Parabéns! Você atingiu 120% da meta de vendas desta semana.',
        createdAt: new Date(),
        isRead: false,
        priority: 'low'
      }
    ];

    setCustomers(mockCustomers);
    setProducts(mockProducts);
    setCampaigns(mockCampaigns);
    setLoyaltyRules(mockLoyaltyRules);
    setAlerts(mockAlerts);
  };

  const dashboardData = {
    totalRevenue: 15420.50,
    dailyRevenue: 892.30,
    avgTicket: 67.80,
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    vipCustomers: customers.filter(c => c.classification === 'vip').length,
    inactiveCustomers: customers.filter(c => c.classification === 'inactive').length,
    topProducts: products.slice(0, 5),
    recentCampaigns: campaigns.slice(0, 3),
    totalPoints: customers.reduce((sum, c) => sum + c.points, 0),
    averagePoints: customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + c.points, 0) / customers.length) : 0,
    monthlyData: [
      { month: 'Jan', revenue: 12000, customers: 45, orders: 180 },
      { month: 'Fev', revenue: 13500, customers: 52, orders: 195 },
      { month: 'Mar', revenue: 15420, customers: 48, orders: 210 },
      { month: 'Abr', revenue: 14200, customers: 55, orders: 188 },
      { month: 'Mai', revenue: 16800, customers: 62, orders: 225 },
      { month: 'Jun', revenue: 18900, customers: 58, orders: 240 }
    ],
    alerts: alerts.filter(a => !a.isRead).length
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'orders' | 'createdAt' | 'referralCode' | 'loyaltyTier' | 'classification' | 'averageTicket' | 'daysSinceLastVisit'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      orders: [],
      createdAt: new Date(),
      referralCode: `${customerData.name.split(' ')[0].toUpperCase()}${Date.now()}`,
      classification: 'new',
      averageTicket: 0,
      daysSinceLastVisit: 0,
      loyaltyTier: {
        current: 'Bronze',
        nextTier: 'Silver',
        pointsToNext: user?.currentRestaurant.settings.loyaltyProgram.silverThreshold || 200,
        benefits: ['Pontos por compra']
      }
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    setCustomers(customers.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...customerData };
        
        // Recalcular classificação baseada nos dados atualizados
        if (updated.daysSinceLastVisit > 30) {
          updated.classification = 'inactive';
        } else if (updated.totalSpent > 2000 && updated.visitCount > 20) {
          updated.classification = 'vip';
        } else if (updated.visitCount > 5) {
          updated.classification = 'recurrent';
        } else {
          updated.classification = 'new';
        }
        
        return updated;
      }
      return c;
    }));
  };

  const addProduct = (productData: Omit<Product, 'id' | 'margin'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      margin: ((productData.price - productData.cost) / productData.price) * 100
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...productData };
        if (updated.price && updated.cost) {
          updated.margin = ((updated.price - updated.cost) / updated.price) * 100;
          updated.profit = updated.price - updated.cost;
        }
        return updated;
      }
      return p;
    }));
  };

  const addCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'performance'>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: Date.now().toString(),
      createdAt: new Date(),
      performance: {
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        revenue: 0,
        roi: 0
      }
    };
    setCampaigns([...campaigns, newCampaign]);
  };

  const updateCampaign = (id: string, campaignData: Partial<Campaign>) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, ...campaignData } : c));
  };

  const addLoyaltyRule = (ruleData: Omit<LoyaltyRule, 'id'>) => {
    const newRule: LoyaltyRule = {
      ...ruleData,
      id: Date.now().toString()
    };
    setLoyaltyRules([...loyaltyRules, newRule]);
  };

  const updateLoyaltyRule = (id: string, ruleData: Partial<LoyaltyRule>) => {
    setLoyaltyRules(loyaltyRules.map(r => r.id === id ? { ...r, ...ruleData } : r));
  };

  const markAlertAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const generateSmartCoupon = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return null;

    // Lógica inteligente para gerar cupom baseado no perfil
    let discount = 10;
    let message = 'Desconto especial para você!';

    if (customer.classification === 'vip') {
      discount = 20;
      message = 'Desconto VIP exclusivo!';
    } else if (customer.classification === 'inactive') {
      discount = 30;
      message = 'Volta pra casa! Desconto especial de retorno!';
    } else if (customer.birthday && new Date().getMonth() === customer.birthday.getMonth()) {
      discount = 25;
      message = 'Feliz aniversário! Desconto especial para você!';
    }

    return {
      code: `${customer.referralCode}${discount}`,
      discount,
      message,
      validUntil: addDays(new Date(), 7),
      customerId
    };
  };

  const sendAutomatedCampaign = (ruleId: string, customerId: string) => {
    // Simular envio de campanha automatizada
    console.log(`Enviando campanha automatizada - Regra: ${ruleId}, Cliente: ${customerId}`);
  };

  const calculateCustomerLTV = (customerId: string): number => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return 0;

    // Cálculo simplificado de LTV
    const avgMonthlySpend = customer.averageTicket * (customer.visitCount / 12);
    const estimatedLifespan = customer.classification === 'vip' ? 36 : 24; // meses
    return avgMonthlySpend * estimatedLifespan;
  };

  const getCustomerSegmentation = () => {
    return {
      new: customers.filter(c => c.classification === 'new').length,
      recurrent: customers.filter(c => c.classification === 'recurrent').length,
      vip: customers.filter(c => c.classification === 'vip').length,
      inactive: customers.filter(c => c.classification === 'inactive').length
    };
  };

  const getProductPerformance = () => {
    return products.map(p => ({
      ...p,
      revenue: p.price * p.popularity,
      profitMargin: p.margin
    })).sort((a, b) => b.revenue - a.revenue);
  };

  const refreshAlerts = () => {
    // Gerar novos alertas baseados nos dados atuais
    const newAlerts: Alert[] = [];

    // Verificar clientes inativos
    customers.forEach(customer => {
      if (customer.daysSinceLastVisit > 14 && customer.classification !== 'inactive') {
        newAlerts.push({
          id: `inactive_${customer.id}_${Date.now()}`,
          type: 'warning',
          title: 'Cliente inativo detectado',
          message: `${customer.name} não visita há ${customer.daysSinceLastVisit} dias.`,
          createdAt: new Date(),
          isRead: false,
          actionUrl: `/customers/${customer.id}`,
          priority: 'medium'
        });
      }

      // Verificar aniversários próximos
      if (customer.birthday) {
        const today = new Date();
        const birthday = new Date(customer.birthday);
        birthday.setFullYear(today.getFullYear());
        
        const daysUntilBirthday = Math.ceil((birthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilBirthday >= 0 && daysUntilBirthday <= 7) {
          newAlerts.push({
            id: `birthday_${customer.id}_${Date.now()}`,
            type: 'info',
            title: 'Aniversário próximo',
            message: `${customer.name} faz aniversário em ${daysUntilBirthday} dias.`,
            createdAt: new Date(),
            isRead: false,
            actionUrl: `/customers/${customer.id}`,
            priority: 'low'
          });
        }
      }
    });

    setAlerts(prev => [...prev, ...newAlerts]);
  };

  return (
    <DataContext.Provider value={{
      customers,
      products,
      campaigns,
      alerts,
      loyaltyRules,
      dashboardData,
      addCustomer,
      updateCustomer,
      addProduct,
      updateProduct,
      addCampaign,
      updateCampaign,
      addLoyaltyRule,
      updateLoyaltyRule,
      markAlertAsRead,
      generateSmartCoupon,
      sendAutomatedCampaign,
      calculateCustomerLTV,
      getCustomerSegmentation,
      getProductPerformance,
      refreshAlerts
    }}>
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
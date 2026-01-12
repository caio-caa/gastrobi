// Branch Configuration for Front Customer
// This file configures the Front Customer (Public) specific settings

export const FRONT_CUSTOMER_CONFIG = {
  // Project Information
  project: 'front-customer',
  projectName: 'GastroBI Customer',
  description: 'Front Customer - Cardápio Digital Público para clientes',
  
  // Authentication - Opcional para cliente
  auth: {
    required: false,
    optional: true, // Login opcional para fidelidade
    guestCheckout: true, // Permite checkout como convidado
  },

  // Navigation - Simples, sem sidebar
  navigation: {
    type: 'simple', // Sem sidebar
    showCart: true,
    showLoyalty: true,
    items: [
      {
        name: 'Cardápio',
        href: '/menu/[slug]',
        icon: 'Menu',
        description: 'Ver cardápio do restaurante',
      },
      {
        name: 'Carrinho',
        href: '/cart',
        icon: 'ShoppingCart',
        description: 'Ver itens no carrinho',
      },
      {
        name: 'Meus Pedidos',
        href: '/orders',
        icon: 'ClipboardList',
        description: 'Histórico de pedidos',
      },
      {
        name: 'Fidelidade',
        href: '/loyalty',
        icon: 'Gift',
        description: 'Meus pontos e recompensas',
      },
    ],
  },

  // Features disponíveis para Front Customer
  features: {
    menu: true,           // Cardápio digital
    cart: true,           // Carrinho de compras
    checkout: true,       // Finalizar pedido
    loyalty: true,        // Programa de fidelidade (visualização)
    orderTracking: true,  // Rastreamento de pedido
    guestCheckout: true,  // Checkout sem login
    reviews: true,        // Avaliações de produtos
    favorites: true,      // Produtos favoritos
    // Features não disponíveis
    admin: false,
    pos: false,
    reports: false,
    settings: false,
  },

  // Order Types
  orderTypes: {
    dineIn: {
      enabled: true,
      label: 'Comer no local',
      icon: 'Home',
      requiresTable: true,
    },
    delivery: {
      enabled: true,
      label: 'Delivery',
      icon: 'Bike',
      requiresAddress: true,
    },
    takeaway: {
      enabled: true,
      label: 'Retirada',
      icon: 'Package',
      requiresTime: true,
    },
  },

  // Payment Methods
  paymentMethods: [
    { id: 'pix', name: 'PIX', icon: 'QrCode', enabled: true },
    { id: 'credit', name: 'Cartão de Crédito', icon: 'CreditCard', enabled: true },
    { id: 'debit', name: 'Cartão de Débito', icon: 'CreditCard', enabled: true },
    { id: 'cash', name: 'Dinheiro', icon: 'Banknote', enabled: true },
  ],

  // Branding (herdado do restaurante via WhiteLabelContext)
  branding: {
    useRestaurantBranding: true,
    showPoweredBy: true, // "Powered by GastroBI"
    fallbackPrimaryColor: '#6366f1',
  },

  // Cart Settings
  cart: {
    persistToLocalStorage: true,
    maxItems: 50,
    minOrderValue: 0,
    showEstimatedTime: true,
  },

  // Checkout Settings
  checkout: {
    requirePhone: true,
    requireName: true,
    requireEmail: false,
    requireCPF: false,
    allowCoupons: true,
    allowTips: true,
    tipOptions: [0, 0.10, 0.15, 0.20], // 0%, 10%, 15%, 20%
  },
};

export type FrontCustomerConfig = typeof FRONT_CUSTOMER_CONFIG;

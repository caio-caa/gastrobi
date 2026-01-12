// Branch Configuration for Admin Restaurante
// This file configures the Admin Restaurante specific settings

export const ADMIN_RESTAURANTE_CONFIG = {
  // Project Information
  project: 'admin-restaurante',
  projectName: 'GastroBI Admin Restaurante',
  description: 'Admin Restaurante - Gestão completa do restaurante para Owner/Manager',
  
  // Authentication
  auth: {
    allowedRoles: ['owner', 'manager', 'staff'] as const,
    defaultRedirect: '/dashboard',
    loginRedirect: '/login',
  },

  // Navigation - Menu completo do restaurante (9 itens)
  navigation: {
    menuItems: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: 'LayoutDashboard',
        description: 'Visão geral do restaurante',
      },
      {
        name: 'Clientes',
        href: '/customers',
        icon: 'Users',
        description: 'Gestão de clientes e histórico',
      },
      {
        name: 'Fidelidade',
        href: '/loyalty',
        icon: 'Gift',
        description: 'Programa de fidelidade e pontos',
      },
      {
        name: 'Campanhas',
        href: '/campaigns',
        icon: 'Megaphone',
        description: 'Campanhas de marketing',
      },
      {
        name: 'Cardápio Digital',
        href: '/menu',
        icon: 'Menu',
        description: 'Gestão do cardápio digital',
      },
      {
        name: 'QR Codes',
        href: '/qr-codes',
        icon: 'QrCode',
        description: 'Geração e gestão de QR Codes',
      },
      {
        name: 'POS - Frente de Caixa',
        href: '/pos',
        icon: 'Calculator',
        description: 'Sistema de ponto de venda',
      },
      {
        name: 'Relatórios',
        href: '/reports',
        icon: 'BarChart3',
        description: 'Relatórios e analytics',
      },
      {
        name: 'Configurações',
        href: '/settings',
        icon: 'Settings',
        description: 'Configurações do restaurante',
      },
    ],
  },

  // Features disponíveis para Admin Restaurante
  features: {
    dashboard: true,
    customers: true,
    loyalty: true,
    campaigns: true,
    menu: true,
    qrCodes: true,
    pos: true,
    reports: true,
    settings: true,
    // Features não disponíveis neste projeto
    adminSaaS: false,
    whiteLabel: false,
    analytics: false,
  },

  // Branding (herdado do WhiteLabelContext)
  branding: {
    useWhiteLabel: true,
    fallbackPrimaryColor: '#6366f1',
    fallbackSecondaryColor: '#4f46e5',
    fallbackAccentColor: '#10b981',
  },

  // API Endpoints (when ready)
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    timeout: 30000,
    retries: 3,
  },

  // Restaurant Settings
  restaurant: {
    multiRestaurant: true, // Permite múltiplos restaurantes
    defaultCurrency: 'BRL',
    defaultTimezone: 'America/Sao_Paulo',
  },
};

export type AdminRestauranteConfig = typeof ADMIN_RESTAURANTE_CONFIG;

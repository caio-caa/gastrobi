// Branch Configuration for Admin SaaS
// This file configures the Admin SaaS specific settings

export const ADMIN_SAAS_CONFIG = {
  // Project Information
  project: 'admin-saas',
  projectName: 'GastroBI Admin SaaS',
  description: 'Admin SaaS - Super admin platform management',
  
  // Authentication
  auth: {
    superAdminEmail: 'admin@gastrobi.com',
    superAdminPassword: '123456', // Development only
    allowedRoles: ['super-admin'],
  },

  // Navigation
  navigation: {
    // Only show admin features
    adminOnly: true,
    menuItems: [
      {
        name: 'Gestão de Usuários',
        href: '/admin/users',
        icon: 'Users',
        description: 'Gerenciar usuários e restaurantes',
      },
      {
        name: 'White Label & Clientes',
        href: '/admin/white-label',
        icon: 'Palette',
        description: 'Configurar branding por cliente',
      },
      {
        name: 'Analytics & Métricas',
        href: '/admin/analytics',
        icon: 'BarChart3',
        description: 'Visualizar métricas da plataforma',
      },
    ],
  },

  // Features
  features: {
    userManagement: true,
    whiteLabel: true,
    analytics: true,
    reports: true,
    api: true,
  },

  // Branding
  branding: {
    primaryColor: '#6366f1',
    secondaryColor: '#4f46e5',
    accentColor: '#10b981',
    brandName: 'GastroBI',
  },

  // API Endpoints (when ready)
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    timeout: 30000,
    retries: 3,
  },

  // Database (when using Supabase/PostgreSQL)
  database: {
    type: 'postgresql',
    // Connection details from environment variables
  },
};

export type AdminSaaSConfig = typeof ADMIN_SAAS_CONFIG;

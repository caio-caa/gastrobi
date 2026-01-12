/**
 * GastroBI+ Admin API Service
 * 
 * Serviço para integração com a API do backend
 * Base URL: http://localhost:3001/api/v1
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  take: number;
}

// Token management
let accessToken: string | null = null;
let refreshToken: string | null = null;

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== 'undefined') {
    localStorage.setItem('gastrobi_access_token', access);
    localStorage.setItem('gastrobi_refresh_token', refresh);
  }
};

export const getTokens = () => {
  if (typeof window !== 'undefined' && !accessToken) {
    accessToken = localStorage.getItem('gastrobi_access_token');
    refreshToken = localStorage.getItem('gastrobi_refresh_token');
  }
  return { accessToken, refreshToken };
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gastrobi_access_token');
    localStorage.removeItem('gastrobi_refresh_token');
  }
};

// Base fetch with auth
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const { accessToken } = getTokens();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle token refresh on 401
    if (response.status === 401 && refreshToken) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${accessToken}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
        const data = await retryResponse.json().catch(() => null);
        return { data, status: retryResponse.status };
      }
    }

    const data = await response.json().catch(() => null);
    
    if (!response.ok) {
      return { error: data?.message || 'Erro na requisição', status: response.status };
    }

    return { data, status: response.status };
  } catch (error) {
    console.error('API Error:', error);
    return { error: 'Erro de conexão com o servidor', status: 500 };
  }
}

async function refreshAccessToken(): Promise<boolean> {
  const { refreshToken: token } = getTokens();
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: token }),
    });

    if (response.ok) {
      const data = await response.json();
      setTokens(data.accessToken, data.refreshToken);
      return true;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
  }

  clearTokens();
  return false;
}

// ==================== AUTH ====================

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    type: 'ADMIN' | 'RESTAURANT';
    role: string;
    currentRestaurant?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export const authApi = {
  loginAdmin: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    const response = await fetchWithAuth<LoginResponse>('/auth/login/admin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.data) {
      setTokens(response.data.accessToken, response.data.refreshToken);
    }
    
    return response;
  },

  loginRestaurant: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    const response = await fetchWithAuth<LoginResponse>('/auth/login/restaurant', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.data) {
      setTokens(response.data.accessToken, response.data.refreshToken);
    }
    
    return response;
  },

  me: async () => fetchWithAuth<LoginResponse['user']>('/auth/me'),

  logout: async () => {
    const response = await fetchWithAuth('/auth/logout', { method: 'POST' });
    clearTokens();
    return response;
  },
};

// ==================== USERS ====================

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  type: 'RESTAURANT' | 'ADMIN';
  role: 'SUPER_ADMIN' | 'ADMIN' | 'OWNER' | 'MANAGER' | 'STAFF';
  isActive: boolean;
  createdAt: string;
  restaurants?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export interface CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  type: 'RESTAURANT' | 'ADMIN';
  role: string;
  restaurantId?: string;
}

export interface UpdateUserDto {
  fullName?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  password?: string;
}

export const usersApi = {
  list: async (params?: { skip?: number; take?: number; type?: string }) => {
    const query = new URLSearchParams();
    if (params?.skip) query.set('skip', params.skip.toString());
    if (params?.take) query.set('take', params.take.toString());
    if (params?.type) query.set('type', params.type);
    
    return fetchWithAuth<PaginatedResponse<User>>(`/admin/users?${query}`);
  },

  get: async (id: string) => fetchWithAuth<User>(`/admin/users/${id}`),

  create: async (data: CreateUserDto) => 
    fetchWithAuth<User>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: async (id: string, data: UpdateUserDto) =>
    fetchWithAuth<User>(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: async (id: string) =>
    fetchWithAuth(`/admin/users/${id}`, { method: 'DELETE' }),

  ban: async (id: string) =>
    fetchWithAuth(`/admin/users/${id}/ban`, { method: 'POST' }),

  unban: async (id: string) =>
    fetchWithAuth(`/admin/users/${id}/unban`, { method: 'POST' }),

  resetPassword: async (id: string) =>
    fetchWithAuth<{ temporaryPassword: string }>(`/admin/users/${id}/reset-password`, { method: 'POST' }),
};

// ==================== RESTAURANTS ====================

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cnpj: string | null;
  phone: string | null;
  email: string | null;
  status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CANCELLED';
  createdAt: string;
  subscription?: {
    plan: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
    status: string;
  };
  _count?: {
    orders: number;
    customers: number;
    products: number;
  };
}

export interface CreateRestaurantDto {
  name: string;
  slug: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  ownerId?: string;
}

export const restaurantsApi = {
  list: async (params?: { skip?: number; take?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.skip) query.set('skip', params.skip.toString());
    if (params?.take) query.set('take', params.take.toString());
    if (params?.status) query.set('status', params.status);
    
    return fetchWithAuth<PaginatedResponse<Restaurant>>(`/admin/restaurants?${query}`);
  },

  get: async (id: string) => fetchWithAuth<Restaurant>(`/admin/restaurants/${id}`),

  create: async (data: CreateRestaurantDto) =>
    fetchWithAuth<Restaurant>('/admin/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: async (id: string, data: Partial<CreateRestaurantDto>) =>
    fetchWithAuth<Restaurant>(`/admin/restaurants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: async (id: string) =>
    fetchWithAuth(`/admin/restaurants/${id}`, { method: 'DELETE' }),

  suspend: async (id: string) =>
    fetchWithAuth(`/admin/restaurants/${id}/suspend`, { method: 'POST' }),

  activate: async (id: string) =>
    fetchWithAuth(`/admin/restaurants/${id}/activate`, { method: 'POST' }),
};

// ==================== ANALYTICS ====================

export interface AnalyticsOverview {
  totalRestaurants: number;
  activeRestaurants: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRecurringRevenue: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  revenueByPlan: Record<string, number>;
  dailyRevenue: Array<{ date: string; revenue: number }>;
}

export interface GrowthAnalytics {
  newRestaurantsThisMonth: number;
  newUsersThisMonth: number;
  growthRate: number;
  churnRate: number;
}

export interface RetentionAnalytics {
  retentionRate: number;
  averageLifetime: number;
  activeUsers30Days: number;
}

export const analyticsApi = {
  overview: async () => fetchWithAuth<AnalyticsOverview>('/admin/analytics/overview'),

  revenue: async (startDate: string, endDate: string) => {
    const query = new URLSearchParams({ startDate, endDate });
    return fetchWithAuth<RevenueAnalytics>(`/admin/analytics/revenue?${query}`);
  },

  growth: async () => fetchWithAuth<GrowthAnalytics>('/admin/analytics/growth'),

  retention: async () => fetchWithAuth<RetentionAnalytics>('/admin/analytics/retention'),
};

// ==================== BILLING ====================

export interface Subscription {
  id: string;
  restaurantId: string;
  restaurantName: string;
  plan: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'TRIAL';
  startDate: string;
  nextBillingDate: string;
  amount: number;
}

export interface Payment {
  id: string;
  restaurantId: string;
  restaurantName: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  paidAt: string | null;
}

export const billingApi = {
  listSubscriptions: async (params?: { skip?: number; take?: number; status?: string; plan?: string }) => {
    const query = new URLSearchParams();
    if (params?.skip) query.set('skip', params.skip.toString());
    if (params?.take) query.set('take', params.take.toString());
    if (params?.status) query.set('status', params.status);
    if (params?.plan) query.set('plan', params.plan);
    
    return fetchWithAuth<PaginatedResponse<Subscription>>(`/admin/billing/subscriptions?${query}`);
  },

  getSubscription: async (restaurantId: string) =>
    fetchWithAuth<Subscription>(`/admin/billing/subscriptions/${restaurantId}`),

  updatePlan: async (restaurantId: string, plan: string) =>
    fetchWithAuth(`/admin/billing/subscriptions/${restaurantId}/plan`, {
      method: 'PATCH',
      body: JSON.stringify({ plan }),
    }),

  cancelSubscription: async (restaurantId: string) =>
    fetchWithAuth(`/admin/billing/subscriptions/${restaurantId}/cancel`, { method: 'POST' }),

  listPayments: async (params?: { skip?: number; take?: number }) => {
    const query = new URLSearchParams();
    if (params?.skip) query.set('skip', params.skip.toString());
    if (params?.take) query.set('take', params.take.toString());
    
    return fetchWithAuth<PaginatedResponse<Payment>>(`/admin/billing/payments?${query}`);
  },
};

// ==================== AUDIT LOGS ====================

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entity: string;
  entityId: string | null;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface AuditStats {
  totalLogs: number;
  logsByAction: Record<string, number>;
  logsByEntity: Record<string, number>;
  logsLast24h: number;
  logsLast7d: number;
}

export const auditApi = {
  list: async (params?: { skip?: number; take?: number; userId?: string; action?: string; entity?: string }) => {
    const query = new URLSearchParams();
    if (params?.skip) query.set('skip', params.skip.toString());
    if (params?.take) query.set('take', params.take.toString());
    if (params?.userId) query.set('userId', params.userId);
    if (params?.action) query.set('action', params.action);
    if (params?.entity) query.set('entity', params.entity);
    
    return fetchWithAuth<PaginatedResponse<AuditLog>>(`/admin/audit?${query}`);
  },

  stats: async () => fetchWithAuth<AuditStats>('/admin/audit/stats'),
};

// ==================== WHITE LABEL ====================

export interface WhiteLabelConfig {
  id: string;
  clientName: string;
  brandName: string;
  domain: string;
  primaryColor: string;
  secondaryColor: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateWhiteLabelDto {
  clientName: string;
  brandName: string;
  domain: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export const whiteLabelApi = {
  list: async () => fetchWithAuth<{ data: WhiteLabelConfig[] }>('/admin/white-label'),

  get: async (id: string) => fetchWithAuth<WhiteLabelConfig>(`/admin/white-label/${id}`),

  create: async (data: CreateWhiteLabelDto) =>
    fetchWithAuth<WhiteLabelConfig>('/admin/white-label', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: async (id: string, data: Partial<CreateWhiteLabelDto>) =>
    fetchWithAuth<WhiteLabelConfig>(`/admin/white-label/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: async (id: string) =>
    fetchWithAuth(`/admin/white-label/${id}`, { method: 'DELETE' }),
};

// ==================== HEALTH ====================

export const healthApi = {
  check: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },

  ready: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health/ready`);
      return response.json();
    } catch {
      return { status: 'error' };
    }
  },
};

// Default export with all APIs
const api = {
  auth: authApi,
  users: usersApi,
  restaurants: restaurantsApi,
  analytics: analyticsApi,
  billing: billingApi,
  audit: auditApi,
  whiteLabel: whiteLabelApi,
  health: healthApi,
  setTokens,
  getTokens,
  clearTokens,
};

export default api;

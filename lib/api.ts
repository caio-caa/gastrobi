/**
 * GastroBI+ Restaurant API Service
 * 
 * Serviço para integração com a API do backend - Lado do Restaurante
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

// Token management with HTTP-Only Cookies
export const setTokens = (access: string, refresh: string) => {
  // Tokens são definidos pelo servidor via Set-Cookie headers (httpOnly)
};

export const getTokens = () => {
  // Tokens são enviados automaticamente pelo navegador com credenciais
  return { accessToken: null, refreshToken: null };
};

export const clearTokens = () => {
  // Tokens são limpos pelo servidor ao deslogar
};

// Base fetch with auth (cookies httpOnly)
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
  restaurantId?: string
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Adiciona restaurant ID se fornecido
  if (restaurantId) {
    headers['x-restaurant-id'] = restaurantId;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Envia e recebe cookies httpOnly
    });

    // Handle token refresh on 401
    if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
          credentials: 'include',
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
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
  }
  return false;
}

// ==================== AUTH ====================

export const authApi = {
  loginRestaurant: async (email: string, password: string) =>
    fetchWithAuth<any>('/auth/login/restaurant', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: async (restaurantId: string) =>
    fetchWithAuth<any>('/auth/me', {}, restaurantId),

  logout: async (restaurantId: string) =>
    fetchWithAuth<any>('/auth/logout', { method: 'POST' }, restaurantId),

  refresh: async () =>
    fetchWithAuth<any>('/auth/refresh', { method: 'POST' }),
};

// ==================== CATEGORIES ====================

export const categoriesApi = {
  list: async (restaurantId: string) =>
    fetchWithAuth<any[]>('/categories', {}, restaurantId),

  get: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/categories/${id}`, {}, restaurantId),

  create: async (data: any, restaurantId: string) =>
    fetchWithAuth<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }, restaurantId),

  update: async (id: string, data: any, restaurantId: string) =>
    fetchWithAuth<any>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, restaurantId),

  delete: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/categories/${id}`, {
      method: 'DELETE',
    }, restaurantId),

  reorder: async (categoryIds: string[], restaurantId: string) =>
    fetchWithAuth<any>('/categories/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ categoryIds }),
    }, restaurantId),
};

// ==================== PRODUCTS ====================

export const productsApi = {
  list: async (restaurantId: string, categoryId?: string) => {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    return fetchWithAuth<any[]>(`/products${query}`, {}, restaurantId);
  },

  get: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/products/${id}`, {}, restaurantId),

  create: async (data: any, restaurantId: string) =>
    fetchWithAuth<any>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }, restaurantId),

  update: async (id: string, data: any, restaurantId: string) =>
    fetchWithAuth<any>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, restaurantId),

  delete: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/products/${id}`, {
      method: 'DELETE',
    }, restaurantId),

  toggle: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/products/${id}/toggle`, {
      method: 'PATCH',
    }, restaurantId),

  reorder: async (categoryId: string, productIds: string[], restaurantId: string) =>
    fetchWithAuth<any>('/products/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ categoryId, productIds }),
    }, restaurantId),
};

// ==================== ORDERS ====================

export const ordersApi = {
  list: async (restaurantId: string, params?: { skip?: number; take?: number; type?: string; status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const url = `/orders${query ? '?' + query : ''}`;
    return fetchWithAuth<any>(`/orders`, {}, restaurantId);
  },

  get: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/orders/${id}`, {}, restaurantId),

  create: async (data: any, restaurantId: string, idempotencyKey?: string) =>
    fetchWithAuth<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: idempotencyKey ? { 'x-idempotency-key': idempotencyKey } : {},
    }, restaurantId),

  updateStatus: async (id: string, status: string, restaurantId: string) =>
    fetchWithAuth<any>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }, restaurantId),

  cancel: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/orders/${id}/cancel`, {
      method: 'POST',
    }, restaurantId),

  kitchen: async (restaurantId: string) =>
    fetchWithAuth<any>('/orders/kitchen', {}, restaurantId),

  reports: async (restaurantId: string, startDate: string, endDate: string) =>
    fetchWithAuth<any>(`/orders/reports?startDate=${startDate}&endDate=${endDate}`, {}, restaurantId),
};

// ==================== TABLES ====================

export const tablesApi = {
  list: async (restaurantId: string) =>
    fetchWithAuth<any[]>('/tables', {}, restaurantId),

  get: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/tables/${id}`, {}, restaurantId),

  create: async (data: any, restaurantId: string) =>
    fetchWithAuth<any>('/tables', {
      method: 'POST',
      body: JSON.stringify(data),
    }, restaurantId),

  update: async (id: string, data: any, restaurantId: string) =>
    fetchWithAuth<any>(`/tables/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, restaurantId),

  delete: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/tables/${id}`, {
      method: 'DELETE',
    }, restaurantId),

  updateStatus: async (id: string, status: string, restaurantId: string) =>
    fetchWithAuth<any>(`/tables/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }, restaurantId),

  generateQRCode: async (id: string, baseUrl: string, restaurantId: string) =>
    fetchWithAuth<any>(`/tables/${id}/qr-code`, {
      method: 'POST',
      body: JSON.stringify({ baseUrl }),
    }, restaurantId),
};

// ==================== CUSTOMERS ====================

export const customersApi = {
  list: async (restaurantId: string, params?: { skip?: number; take?: number; search?: string; level?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const url = `/customers${query ? '?' + query : ''}`;
    return fetchWithAuth<any>(url, {}, restaurantId);
  },

  get: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/customers/${id}`, {}, restaurantId),

  create: async (data: any, restaurantId: string) =>
    fetchWithAuth<any>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }, restaurantId),

  update: async (id: string, data: any, restaurantId: string) =>
    fetchWithAuth<any>(`/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, restaurantId),

  delete: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/customers/${id}`, {
      method: 'DELETE',
    }, restaurantId),

  orders: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/customers/${id}/orders`, {}, restaurantId),

  addPoints: async (id: string, points: number, reason: string, restaurantId: string) =>
    fetchWithAuth<any>(`/customers/${id}/points`, {
      method: 'POST',
      body: JSON.stringify({ points, reason }),
    }, restaurantId),
};

// ==================== LOYALTY ====================

export const loyaltyApi = {
  // Rules
  listRules: async (restaurantId: string) =>
    fetchWithAuth<any[]>('/loyalty/rules', {}, restaurantId),

  createRule: async (data: any, restaurantId: string) =>
    fetchWithAuth<any>('/loyalty/rules', {
      method: 'POST',
      body: JSON.stringify(data),
    }, restaurantId),

  updateRule: async (id: string, data: any, restaurantId: string) =>
    fetchWithAuth<any>(`/loyalty/rules/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, restaurantId),

  deleteRule: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/loyalty/rules/${id}`, {
      method: 'DELETE',
    }, restaurantId),

  // Rewards
  listRewards: async (restaurantId: string) =>
    fetchWithAuth<any[]>('/loyalty/rewards', {}, restaurantId),

  createReward: async (data: any, restaurantId: string) =>
    fetchWithAuth<any>('/loyalty/rewards', {
      method: 'POST',
      body: JSON.stringify(data),
    }, restaurantId),

  updateReward: async (id: string, data: any, restaurantId: string) =>
    fetchWithAuth<any>(`/loyalty/rewards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, restaurantId),

  deleteReward: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/loyalty/rewards/${id}`, {
      method: 'DELETE',
    }, restaurantId),

  // Redemption
  redeem: async (customerId: string, rewardId: string, restaurantId: string) =>
    fetchWithAuth<any>('/loyalty/redeem', {
      method: 'POST',
      body: JSON.stringify({ customerId, rewardId }),
    }, restaurantId),

  history: async (customerId: string, restaurantId: string) =>
    fetchWithAuth<any>(`/loyalty/history/${customerId}`, {}, restaurantId),
};

// ==================== CAMPAIGNS ====================

export const campaignsApi = {
  list: async (restaurantId: string, params?: { status?: string; type?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const url = `/campaigns${query ? '?' + query : ''}`;
    return fetchWithAuth<any>(url, {}, restaurantId);
  },

  get: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/campaigns/${id}`, {}, restaurantId),

  create: async (data: any, restaurantId: string) =>
    fetchWithAuth<any>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    }, restaurantId),

  update: async (id: string, data: any, restaurantId: string) =>
    fetchWithAuth<any>(`/campaigns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, restaurantId),

  delete: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/campaigns/${id}`, {
      method: 'DELETE',
    }, restaurantId),

  schedule: async (id: string, scheduledFor: string, restaurantId: string) =>
    fetchWithAuth<any>(`/campaigns/${id}/schedule`, {
      method: 'POST',
      body: JSON.stringify({ scheduledFor }),
    }, restaurantId),

  pause: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/campaigns/${id}/pause`, {
      method: 'POST',
    }, restaurantId),

  metrics: async (id: string, restaurantId: string) =>
    fetchWithAuth<any>(`/campaigns/${id}/metrics`, {}, restaurantId),
};

// ==================== UPLOADS ====================

export const uploadsApi = {
  uploadImage: async (file: File, restaurantId: string) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/uploads/image`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'x-restaurant-id': restaurantId,
        },
      });

      if (!response.ok) {
        return { error: 'Erro ao fazer upload', status: response.status };
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.error('Upload error:', error);
      return { error: 'Erro de conexão ao fazer upload', status: 500 };
    }
  },
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
  categories: categoriesApi,
  products: productsApi,
  orders: ordersApi,
  tables: tablesApi,
  customers: customersApi,
  loyalty: loyaltyApi,
  campaigns: campaignsApi,
  uploads: uploadsApi,
  health: healthApi,
  setTokens,
  getTokens,
  clearTokens,
};

export default api;

// API Client for Public Menu (Front Customer)
// Based on API_PUBLIC_MENU.md documentation

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// ==================== TYPES ====================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  phone?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  products: MenuProduct[];
}

export interface MenuProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  preparationTime: number;
  allergens: string[];
  variations?: ProductVariation[];
  extras?: ProductExtra[];
  tags?: string[];
}

export interface ProductVariation {
  name: string;
  price: number;
}

export interface ProductExtra {
  name: string;
  price: number;
}

export interface WhiteLabelConfig {
  primaryColor: string;
  secondaryColor: string;
}

export interface PublicMenuResponse {
  restaurant: Restaurant;
  categories: MenuCategory[];
  whiteLabel: WhiteLabelConfig;
}

export interface ProductDetailResponse extends MenuProduct {
  category: {
    id: string;
    name: string;
  };
}

export interface OrderItem {
  productId: string;
  quantity: number;
  observations?: string;
  extras?: ProductExtra[];
  variation?: ProductVariation;
}

export interface DeliveryAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  zipCode: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  address?: DeliveryAddress;
}

export interface CreateOrderRequest {
  type: 'DINE_IN' | 'TAKEOUT' | 'DELIVERY';
  tableNumber?: string;
  items: OrderItem[];
  customer?: OrderCustomer;
}

export interface OrderItemResponse {
  productName: string;
  quantity: number;
  unitPrice: number;
  extras?: ProductExtra[];
  subtotal: number;
}

export interface CreateOrderResponse {
  id: string;
  orderNumber: string;
  type: string;
  status: string;
  items: OrderItemResponse[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  estimatedTime: number;
  createdAt: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

// ==================== API HELPER ====================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || `HTTP ${response.status}`,
        status: response.status,
      };
    }

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

// ==================== PUBLIC MENU API ====================

export const publicMenuApi = {
  /**
   * Get public menu for a restaurant
   * GET /menu/:slug
   */
  getMenu: async (slug: string): Promise<ApiResponse<PublicMenuResponse>> => {
    return apiRequest<PublicMenuResponse>(`/menu/${slug}`);
  },

  /**
   * Get product details
   * GET /menu/:slug/product/:productId
   */
  getProduct: async (slug: string, productId: string): Promise<ApiResponse<ProductDetailResponse>> => {
    return apiRequest<ProductDetailResponse>(`/menu/${slug}/product/${productId}`);
  },

  /**
   * Create a public order
   * POST /menu/:slug/order
   */
  createOrder: async (slug: string, order: CreateOrderRequest): Promise<ApiResponse<CreateOrderResponse>> => {
    return apiRequest<CreateOrderResponse>(`/menu/${slug}/order`, {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },
};

// ==================== HEALTH API ====================

export const healthApi = {
  /**
   * Check API health status
   * GET /health
   */
  check: async (): Promise<ApiResponse<HealthResponse>> => {
    return apiRequest<HealthResponse>('/health');
  },
};

// ==================== COUPON API (Not in docs - needs implementation) ====================

export interface CouponValidationRequest {
  code: string;
  restaurantSlug: string;
  subtotal: number;
}

export interface CouponValidationResponse {
  valid: boolean;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  calculatedDiscount: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiresAt?: string;
  message?: string;
}

export const couponApi = {
  /**
   * Validate a coupon code
   * POST /menu/:slug/coupon/validate
   * NOTE: This endpoint needs to be implemented in backend
   */
  validate: async (slug: string, data: CouponValidationRequest): Promise<ApiResponse<CouponValidationResponse>> => {
    return apiRequest<CouponValidationResponse>(`/menu/${slug}/coupon/validate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==================== DELIVERY API (Not in docs - needs implementation) ====================

export interface DeliveryFeeRequest {
  zipCode: string;
  restaurantSlug: string;
}

export interface DeliveryFeeResponse {
  available: boolean;
  fee: number;
  estimatedTime: number;
  freeDeliveryMinimum?: number;
  message?: string;
}

export const deliveryApi = {
  /**
   * Calculate delivery fee based on ZIP code
   * POST /menu/:slug/delivery/calculate
   * NOTE: This endpoint needs to be implemented in backend
   */
  calculateFee: async (slug: string, zipCode: string): Promise<ApiResponse<DeliveryFeeResponse>> => {
    return apiRequest<DeliveryFeeResponse>(`/menu/${slug}/delivery/calculate`, {
      method: 'POST',
      body: JSON.stringify({ zipCode }),
    });
  },
};

// ==================== RESTAURANT INFO API (Not in docs - needs implementation) ====================

export interface RestaurantInfoResponse {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  cover?: string;
  description?: string;
  phone?: string;
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  openingHours?: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }[];
  isOpen: boolean;
  rating?: number;
  reviewsCount?: number;
  minimumOrderValue?: number;
  deliveryTime?: {
    min: number;
    max: number;
  };
  whiteLabel?: WhiteLabelConfig;
}

export const restaurantApi = {
  /**
   * Get restaurant info
   * GET /menu/:slug/info
   * NOTE: This endpoint needs to be implemented in backend
   * Currently part of /menu/:slug response
   */
  getInfo: async (slug: string): Promise<ApiResponse<RestaurantInfoResponse>> => {
    return apiRequest<RestaurantInfoResponse>(`/menu/${slug}/info`);
  },
};

export default {
  publicMenu: publicMenuApi,
  health: healthApi,
  coupon: couponApi,
  delivery: deliveryApi,
  restaurant: restaurantApi,
};

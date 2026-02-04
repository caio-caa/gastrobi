import { useState, useCallback } from 'react';
import api from '@/lib/api';

interface UseMenuApiOptions {
  restaurantId: string;
}

export const useMenuApi = ({ restaurantId }: UseMenuApiOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Categories
  const createCategory = useCallback(async (data: {
    name: string;
    image?: string;
    description?: string;
    order?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.categories.create(data, restaurantId);
      if (response.error) {
        setError(response.error);
        throw new Error(response.error);
      }
      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao criar categoria';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  const updateCategory = useCallback(async (categoryId: string, data: {
    name?: string;
    image?: string;
    description?: string;
    order?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.categories.update(categoryId, data, restaurantId);
      if (response.error) {
        setError(response.error);
        throw new Error(response.error);
      }
      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar categoria';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  const deleteCategory = useCallback(async (categoryId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.categories.delete(categoryId, restaurantId);
      if (response.error) {
        setError(response.error);
        throw new Error(response.error);
      }
      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao deletar categoria';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  // Products
  const createProduct = useCallback(async (data: {
    name: string;
    categoryId: string;
    price: number;
    image?: string;
    description?: string;
    order?: number;
    isActive?: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.products.create(data, restaurantId);
      if (response.error) {
        setError(response.error);
        throw new Error(response.error);
      }
      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao criar produto';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  const updateProduct = useCallback(async (productId: string, data: {
    name?: string;
    price?: number;
    image?: string;
    description?: string;
    order?: number;
    isActive?: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.products.update(productId, data, restaurantId);
      if (response.error) {
        setError(response.error);
        throw new Error(response.error);
      }
      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar produto';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  const deleteProduct = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.products.delete(productId, restaurantId);
      if (response.error) {
        setError(response.error);
        throw new Error(response.error);
      }
      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao deletar produto';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  // Restaurant Settings
  const updateRestaurantSettings = useCallback(async (data: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    website?: string;
    description?: string;
    logo?: string;
    coverImage?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.settings.updateRestaurant(data, restaurantId);
      if (response.error) {
        setError(response.error);
        throw new Error(response.error);
      }
      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar configurações';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  return {
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    updateRestaurantSettings
  };
};

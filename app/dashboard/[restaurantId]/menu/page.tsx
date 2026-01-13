'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { categoriesApi, productsApi } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  description?: string;
  order?: number;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  image?: string;
  available?: boolean;
}

export default function MenuPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  // Load categories and products
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, productsRes] = await Promise.all([
          categoriesApi.list(params.restaurantId),
          productsApi.list(params.restaurantId),
        ]);

        setCategories(categoriesRes.data || []);
        setProducts(productsRes.data || []);
        
        if ((categoriesRes.data || []).length > 0) {
          setSelectedCategory((categoriesRes.data as any)[0].id);
        }
      } catch (err) {
        setError('Erro ao carregar menu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.restaurantId]);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : [];

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Deseja deletar este produto?')) return;

    try {
      await productsApi.delete(productId, params.restaurantId);
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err) {
      setError('Erro ao deletar produto');
      console.error(err);
    }
  };

  const handleToggleProduct = async (product: Product) => {
    try {
      await productsApi.toggle(product.id, params.restaurantId);
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, available: !p.available } : p
        )
      );
    } catch (err) {
      setError('Erro ao atualizar produto');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu</h1>
          <p className="text-gray-600 mt-2">Gerenciar categorias e produtos</p>
        </div>
        <button
          onClick={() => setShowProductForm(true)}
          disabled={!selectedCategory}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Categorias */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Categorias</h2>
              <button
                onClick={() => setShowCategoryForm(true)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main - Produtos */}
        <div className="lg:col-span-3">
          {selectedCategory ? (
            <div className="space-y-4">
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-600">Nenhum produto nesta categoria</p>
                  <button
                    onClick={() => setShowProductForm(true)}
                    className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Adicionar Produto</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {product.image && (
                        <div className="h-32 bg-gray-200 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {product.name}
                          </h3>
                          <span className="inline-flex items-center space-x-1 text-xs font-medium">
                            {product.available ? (
                              <>
                                <Eye className="w-3 h-3 text-green-600" />
                                <span className="text-green-600">Ativo</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-400">Inativo</span>
                              </>
                            )}
                          </span>
                        </div>

                        {product.description && (
                          <p className="text-sm text-gray-600 mb-3">
                            {product.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">
                            R$ {product.price.toFixed(2)}
                          </span>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleProduct(product)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              {product.available ? (
                                <EyeOff className="w-4 h-4 text-gray-500" />
                              ) : (
                                <Eye className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600 mb-4">Nenhuma categoria disponível</p>
              <button
                onClick={() => setShowCategoryForm(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                <span>Criar Categoria</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Nova Categoria</h2>
            <p className="text-gray-600 text-sm">
              Funcionalidade em desenvolvimento
            </p>
            <button
              onClick={() => setShowCategoryForm(false)}
              className="mt-6 w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Novo Produto</h2>
            <p className="text-gray-600 text-sm">
              Funcionalidade em desenvolvimento
            </p>
            <button
              onClick={() => setShowProductForm(false)}
              className="mt-6 w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

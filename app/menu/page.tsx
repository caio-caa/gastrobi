'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, Filter, Grid3X3, List, Eye, EyeOff, QrCode
} from 'lucide-react';
import { useMenu } from '@/contexts/MenuContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import Layout from '@/components/Layout/Layout';
import Button from '@/components/ui/Button';
import CategoryModal from '@/components/ui/CategoryModal';
import ProductModal from '@/components/ui/ProductModal';
import ProductCard from '@/components/ui/ProductCard';
import { useMenuApi } from '@/lib/hooks/useMenuApi';

export default function MenuPage() {
  const router = useRouter();
  const { categories, products, addCategory, updateCategory, addProduct, updateProduct, deleteProduct: deleteProductLocal } = useMenu();
  const { user } = useAuth();
  const { products: dataProducts, addProduct: addDataProduct, updateProduct: updateDataProduct } = useData();

  const restaurantId = user?.currentRestaurant?.id || '';
  const { createCategory, updateCategory: updateCategoryApi, deleteProduct: deleteProductApi } = useMenuApi({ restaurantId });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('menu');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAddCategory = async (categoryData: any) => {
    try {
      if (editingCategory) {
        await updateCategoryApi(editingCategory.id, categoryData);
        updateCategory(editingCategory.id, categoryData);
        setEditingCategory(null);
      } else {
        const response = await createCategory(categoryData);
        addCategory({
          id: response?.id || `cat-${Date.now()}`,
          ...categoryData
        });
      }
      setShowCategoryModal(false);
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria. Tente novamente.');
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        await updateProductApi(editingProduct.id, productData);
        updateProduct(editingProduct.id, productData);
        updateDataProduct(editingProduct.id, productData);
        setEditingProduct(null);
      } else {
        const categoryName = categories.find(c => c.id === productData.categoryId)?.name || '';
        addProduct({
          id: `prod-${Date.now()}`,
          ...productData,
          category: categoryName
        });
        addDataProduct({
          id: `prod-${Date.now()}`,
          ...productData,
          category: categoryName
        });
      }
      setShowProductModal(false);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Tente novamente.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductApi(productId);
      deleteProductLocal(productId);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      alert('Erro ao deletar produto. Tente novamente.');
    }
  };

  const handleToggleProductVisibility = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateProduct(productId, { ...product, isActive: !product.isActive });
      updateDataProduct(productId, { ...product, isActive: !product.isActive });
    }
  };

  const openEditCategory = (category: any) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const getSlug = () => {
    return user?.currentRestaurant?.name?.toLowerCase().replace(/\s+/g, '-') || 'menu';
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cardápio</h1>
            <p className="text-gray-600">Gerencie produtos e categorias do seu cardápio</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/menu/${getSlug()}`)}
              icon={Eye}
            >
              Ver Cardápio
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/qr-codes')}
              icon={QrCode}
            >
              QR Codes
            </Button>
            <Button icon={Plus} onClick={() => setShowCategoryModal(true)}>
              Nova Categoria
            </Button>
            <Button icon={Plus} onClick={() => setShowProductModal(true)}>
              Novo Produto
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-3 px-1 font-medium ${
              activeTab === 'menu' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Produtos ({filteredProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 px-1 font-medium ${
              activeTab === 'categories' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Categorias ({categories.length})
          </button>
        </div>

        {activeTab === 'menu' && (
          <>
            {/* Filtros */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todas as categorias</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Produtos */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
                <Button 
                  onClick={() => setShowProductModal(true)}
                  className="mt-4"
                >
                  Criar Primeiro Produto
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={openEditProduct}
                    onDelete={handleDeleteProduct}
                    onToggleVisibility={handleToggleProductVisibility}
                    viewMode="grid"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={openEditProduct}
                    onDelete={handleDeleteProduct}
                    onToggleVisibility={handleToggleProductVisibility}
                    viewMode="list"
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'categories' && (
          <>
            {/* Lista de Categorias */}
            {categories.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500 text-lg">Nenhuma categoria criada</p>
                <Button 
                  onClick={() => setShowCategoryModal(true)}
                  className="mt-4"
                >
                  Criar Primeira Categoria
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(category => (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {category.image && (
                      <div className="relative w-full h-48 bg-gray-100">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                        {category.isActive ? (
                          <Eye className="w-4 h-4 text-green-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                      )}
                      <p className="text-sm text-gray-500 mb-4">
                        {products.filter(p => p.categoryId === category.id).length} produto(s)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openEditCategory(category)}
                          className="flex-1"
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            if (confirm('Tem certeza que deseja deletar esta categoria?')) {
                              updateCategory(category.id, { ...category, isActive: false });
                            }
                          }}
                          className="flex-1 text-red-600"
                        >
                          Deletar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modais */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setEditingCategory(null);
        }}
        onSubmit={handleAddCategory}
        initialData={editingCategory}
        restaurantId={restaurantId}
      />

      <ProductModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        onSubmit={handleAddProduct}
        categories={categories}
        initialData={editingProduct}
        restaurantId={restaurantId}
      />
    </Layout>
  );
}

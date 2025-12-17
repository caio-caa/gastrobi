'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, Filter, Grid3X3, List, Edit, Trash2, Eye, EyeOff, Star,
  Clock, ChefHat, QrCode, Package, DollarSign, TrendingUp, TrendingDown
} from 'lucide-react';
import { useMenu } from '@/contexts/MenuContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import Layout from '@/components/Layout/Layout';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function MenuPage() {
  const router = useRouter();
  const { categories, products, addCategory, updateCategory, addProduct, updateProduct, deleteProduct } = useMenu();
  const { user } = useAuth();
  const { products: dataProducts, addProduct: addDataProduct, updateProduct: updateDataProduct } = useData();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('menu');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    order: categories.length + 1,
    isActive: true
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    cost: 0,
    category: '',
    categoryId: '',
    image: '',
    isActive: true,
    isAvailable: true,
    isPromotion: false,
    originalPrice: 0,
    allergens: [] as string[],
    preparationTime: 0,
    order: 0,
    tags: [] as string[],
    popularity: 0
  });

  const allergenOptions = [
    'Glúten', 'Lactose', 'Ovo', 'Soja', 'Amendoim', 'Castanhas',
    'Peixe', 'Frutos do Mar', 'Gergelim', 'Mostarda', 'Aipo', 'Tremoço', 'Sulfitos'
  ];

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

  const calculateMargin = (price: number, cost: number) => {
    if (price === 0) return 0;
    return ((price - cost) / price * 100);
  };

  const handleAddCategory = () => {
    if (editingCategory) {
      updateCategory(editingCategory.id, newCategory);
      setEditingCategory(null);
    } else {
      addCategory(newCategory);
    }
    setNewCategory({ name: '', description: '', order: categories.length + 1, isActive: true });
    setShowCategoryModal(false);
  };

  const handleAddProduct = () => {
    const productData = {
      ...newProduct,
      margin: calculateMargin(newProduct.price, newProduct.cost),
      profit: newProduct.price - newProduct.cost
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      updateDataProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      const categoryName = categories.find(c => c.id === newProduct.categoryId)?.name || '';
      const finalProduct = {
        ...productData,
        category: categoryName,
        order: products.filter(p => p.categoryId === newProduct.categoryId).length
      };
      addProduct(finalProduct);
      addDataProduct(finalProduct);
    }

    setNewProduct({
      name: '',
      description: '',
      price: 0,
      cost: 0,
      category: '',
      categoryId: '',
      image: '',
      isActive: true,
      isAvailable: true,
      isPromotion: false,
      originalPrice: 0,
      allergens: [],
      preparationTime: 0,
      order: 0,
      tags: [],
      popularity: 0
    });
    setShowProductModal(false);
  };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      cost: product.cost,
      category: product.category,
      categoryId: product.categoryId,
      image: product.image || '',
      isActive: product.isActive,
      isAvailable: product.isAvailable,
      isPromotion: product.isPromotion || false,
      originalPrice: product.originalPrice || 0,
      allergens: product.allergens || [],
      preparationTime: product.preparationTime || 0,
      order: product.order,
      tags: product.tags || [],
      popularity: product.popularity || 0
    });
    setShowProductModal(true);
  };

  const getSlug = () => user?.currentRestaurant.name.toLowerCase().replace(/\s+/g, '-') || 'restaurant';

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cardápio Digital</h1>
            <p className="text-gray-600">Gerencie produtos e categorias do seu cardápio</p>
          </div>
          <div className="flex space-x-3">
            <Button
              icon={Eye}
              variant="outline"
              onClick={() => router.push(`/menu/${getSlug()}`)}
            >
              Ver Cardápio
            </Button>
            <Button
              icon={QrCode}
              variant="outline"
              onClick={() => router.push('/qrcodes')}
            >
              QR Codes
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
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 px-1 font-medium ${
              activeTab === 'categories' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Categorias
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-1 font-medium ${
              activeTab === 'analytics' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Análise de Custos
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
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ChefHat className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        {product.isActive ? (
                          <Eye className="w-4 h-4 text-green-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">{formatCurrency(product.price)}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditProduct(product)}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <ChefHat className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(product.price)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditProduct(product)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button icon={Plus} onClick={() => setShowCategoryModal(true)}>
                Nova Categoria
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {products.filter(p => p.categoryId === category.id).length} produtos
                    </span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Produtos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{products.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Preço Médio</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatCurrency(products.reduce((sum, p) => sum + p.price, 0) / products.length || 0)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Margem Média</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {(products.reduce((sum, p) => sum + p.margin, 0) / products.length || 0).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {products.filter(p => p.isActive).length}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-50">
                    <Star className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela de Custos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Análise de Custos e Margens</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lucro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-gray-900">{formatCurrency(product.price)}</td>
                      <td className="px-6 py-4 text-gray-900">{formatCurrency(product.cost)}</td>
                      <td className="px-6 py-4">
                        <span className={product.profit > 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(product.profit)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {product.margin >= 30 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className={product.margin >= 30 ? 'text-green-600' : 'text-red-600'}>
                            {product.margin.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Produto */}
        <Modal
          isOpen={showProductModal}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome do produto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Descrição do produto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço de Venda</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custo</label>
                <input
                  type="number"
                  value={newProduct.cost}
                  onChange={(e) => setNewProduct({ ...newProduct, cost: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newProduct.isActive}
                  onChange={(e) => setNewProduct({ ...newProduct, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Ativo no cardápio</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newProduct.isAvailable}
                  onChange={(e) => setNewProduct({ ...newProduct, isAvailable: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Disponível</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <Button variant="ghost" onClick={() => setShowProductModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddProduct}>
                {editingProduct ? 'Atualizar' : 'Criar'} Produto
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal Categoria */}
        <Modal
          isOpen={showCategoryModal}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
          title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nome da categoria"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Descrição da categoria"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newCategory.isActive}
                onChange={(e) => setNewCategory({ ...newCategory, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">Categoria ativa</label>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <Button variant="ghost" onClick={() => setShowCategoryModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCategory}>
                {editingCategory ? 'Atualizar' : 'Criar'} Categoria
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}

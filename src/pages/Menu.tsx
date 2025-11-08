import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Importação adicionada
import {
  Plus, Search, Filter, Grid3X3, List, Edit, Trash2, Eye, EyeOff, Star,
  Clock, ChefHat, QrCode, ExternalLink, Package, DollarSign, TrendingUp, TrendingDown
} from 'lucide-react';
import { useMenu } from '../contexts/MenuContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

function Menu() {
  const navigate = useNavigate(); // ✅ Declaração do hook
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

  const openEditCategory = (category: any) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description || '',
      order: category.order,
      isActive: category.isActive
    });
    setShowCategoryModal(true);
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
      isPromotion: product.isPromotion,
      originalPrice: product.originalPrice || 0,
      allergens: product.allergens || [],
      preparationTime: product.preparationTime,
      order: product.order,
      tags: product.tags || [],
      popularity: product.popularity || 0
    });
    setShowProductModal(true);
  };

  const handleAllergenChange = (allergen: string, checked: boolean) => {
    if (checked) {
      setNewProduct({ ...newProduct, allergens: [...newProduct.allergens, allergen] });
    } else {
      setNewProduct({ ...newProduct, allergens: newProduct.allergens.filter(a => a !== allergen) });
    }
  };

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive && p.isAvailable).length;
  const avgPrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
  const totalProfit = products.reduce((sum, p) => sum + (p.price - p.cost), 0);

  const tabs = [
    { id: 'menu', name: 'Cardápio Digital', icon: ChefHat },
    { id: 'products', name: 'Gestão de Produtos', icon: Package }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cardápio Digital & Produtos</h1>
          <p className="text-gray-600">Gerencie seu cardápio e produtos de forma integrada</p>
        </div>
        <div className="flex space-x-3">
          <Button
            icon={ExternalLink}
            variant="outline"
            onClick={() => {
              const restaurantSlug = user?.currentRestaurant.name.toLowerCase().replace(/\s+/g, '-');
              navigate(`/menu/${restaurantSlug}`);
            }}
          >
            Ver Cardápio Público
          </Button>


          <Button icon={Plus} onClick={() => setShowCategoryModal(true)}>
            Nova Categoria
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'menu' && (
        <>
          {/* Estatísticas do Cardápio */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{totalProducts}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <ChefHat className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{activeProducts}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categorias</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{categories.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <Grid3X3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mais Vendidos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {products.filter(p => p.isBestSeller).length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filtros e Controles */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
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
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={Grid3X3}
                  onClick={() => setViewMode('grid')}
                >
                  Grade
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={List}
                  onClick={() => setViewMode('list')}
                >
                  Lista
                </Button>
                <Button icon={Plus} onClick={() => setShowProductModal(true)}>
                  Novo Produto
                </Button>
              </div>
            </div>
          </div>

          {/* Categorias */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Categorias</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${category.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <button
                        onClick={() => openEditCategory(category)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                  <p className="text-xs text-gray-500">
                    {products.filter(p => p.categoryId === category.id).length} produtos
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Produtos do Cardápio */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Produtos do Cardápio</h3>
            </div>
            
            {viewMode === 'grid' ? (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img
                        src={product.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {product.isBestSeller && (
                          <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                            Mais Vendido
                          </span>
                        )}
                        {product.isPromotion && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                            Promoção
                          </span>
                        )}
                        {product.isNew && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                            Novo
                          </span>
                        )}
                      </div>
                      <div className="absolute top-2 right-2">
                        <div className={`w-3 h-3 rounded-full ${
                          product.isActive && product.isAvailable ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => openEditProduct(product)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {product.isPromotion && product.originalPrice ? (
                            <>
                              <span className="text-lg font-bold text-green-600">
                                {formatCurrency(product.price)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{product.preparationTime}min</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{product.category}</span>
                        <div className="flex items-center space-x-1">
                          {product.allergens && product.allergens.length > 0 && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                              Alérgenos
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tempo Preparo
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(product.price)}
                          </div>
                          {product.isPromotion && product.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              {formatCurrency(product.originalPrice)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.isActive && product.isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.isActive && product.isAvailable ? 'Disponível' : 'Indisponível'}
                            </span>
                            {product.isBestSeller && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.preparationTime} min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openEditProduct(product)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateProduct(product.id, { isActive: !product.isActive })}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            {product.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'products' && (
        <>
          {/* Métricas de Produtos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{totalProducts}</p>
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
                  <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(avgPrice)}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lucro Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totalProfit)}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Margem Média</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {totalProducts > 0 ? (products.reduce((sum, p) => sum + calculateMargin(p.price, p.cost), 0) / totalProducts).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Lista Detalhada de Produtos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Gestão de Produtos</h3>
              <Button icon={Plus} onClick={() => setShowProductModal(true)}>
                Novo Produto
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço de Venda
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Custo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lucro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Margem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Popularidade
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => {
                    const margin = calculateMargin(product.price, product.cost);
                    const profit = product.price - product.cost;
                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(product.cost)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            {profit > 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span className={profit > 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(profit)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`font-medium ${
                            margin > 50 ? 'text-green-600' : 
                            margin > 30 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {margin.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${product.popularity || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{product.popularity || 0}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => openEditProduct(product)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal Nova Categoria */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setEditingCategory(null);
          setNewCategory({ name: '', description: '', order: categories.length + 1, isActive: true });
        }}
        title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da categoria
            </label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Pizzas, Lanches, Bebidas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição da categoria"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="categoryActive"
              checked={newCategory.isActive}
              onChange={(e) => setNewCategory({ ...newCategory, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="categoryActive" className="ml-2 text-sm text-gray-700">
              Categoria ativa
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowCategoryModal(false);
                setEditingCategory(null);
                setNewCategory({ name: '', description: '', order: categories.length + 1, isActive: true });
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddCategory}>
              {editingCategory ? 'Atualizar' : 'Criar'} Categoria
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Novo Produto */}
      <Modal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
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
        }}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do produto
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Pizza Margherita"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={newProduct.categoryId}
                onChange={(e) => {
                  const categoryId = e.target.value;
                  const categoryName = categories.find(c => c.id === categoryId)?.name || '';
                  setNewProduct({ ...newProduct, categoryId, category: categoryName });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição do produto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço de venda (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custo (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={newProduct.cost}
                onChange={(e) => setNewProduct({ ...newProduct, cost: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo de preparo (min)
              </label>
              <input
                type="number"
                value={newProduct.preparationTime}
                onChange={(e) => setNewProduct({ ...newProduct, preparationTime: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Popularidade (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={newProduct.popularity}
                onChange={(e) => setNewProduct({ ...newProduct, popularity: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL da imagem
            </label>
            <input
              type="url"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          {/* Alérgenos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Alérgenos
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allergenOptions.map((allergen) => (
                <div key={allergen} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`allergen-${allergen}`}
                    checked={newProduct.allergens.includes(allergen)}
                    onChange={(e) => handleAllergenChange(allergen, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`allergen-${allergen}`} className="ml-2 text-sm text-gray-700">
                    {allergen}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="productActive"
                checked={newProduct.isActive}
                onChange={(e) => setNewProduct({ ...newProduct, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="productActive" className="ml-2 text-sm text-gray-700">
                Ativo
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="productAvailable"
                checked={newProduct.isAvailable}
                onChange={(e) => setNewProduct({ ...newProduct, isAvailable: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="productAvailable" className="ml-2 text-sm text-gray-700">
                Disponível
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="productPromotion"
                checked={newProduct.isPromotion}
                onChange={(e) => setNewProduct({ ...newProduct, isPromotion: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="productPromotion" className="ml-2 text-sm text-gray-700">
                Promoção
              </label>
            </div>
          </div>

          {newProduct.isPromotion && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço original (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={newProduct.originalPrice}
                onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>
          )}

          {/* Preview dos cálculos */}
          {newProduct.price > 0 && newProduct.cost > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Cálculos Automáticos</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Lucro:</span>
                  <span className="ml-2 font-medium text-green-600">
                    {formatCurrency(newProduct.price - newProduct.cost)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Margem:</span>
                  <span className="ml-2 font-medium text-blue-600">
                    {calculateMargin(newProduct.price, newProduct.cost).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowProductModal(false);
                setEditingProduct(null);
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
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddProduct}>
              {editingProduct ? 'Atualizar' : 'Criar'} Produto
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Menu;
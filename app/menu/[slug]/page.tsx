'use client';

import React, { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Clock, 
  Star, 
  MessageCircle, 
  Phone,
  MapPin,
  ChefHat,
  Flame,
  Leaf,
  Award,
  Plus, 
  Minus,
  ShoppingCart,
  Gift,
  Percent,
  Info,
  ArrowLeft,
  Check,
  X,
  Home,
  Bike,
  User,
  Trophy,
  Heart,
  Sparkles,
  Filter
} from 'lucide-react';
import { useMenu } from '@/contexts/MenuContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  extras?: string[];
  notes?: string;
  image?: string;
}

interface CustomerData {
  name: string;
  phone: string;
  points: number;
  level: 'bronze' | 'silver' | 'gold';
  orders: number;
}

export default function PublicMenuPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const restaurantSlug = params.slug as string;
  const tableNumber = searchParams.get('table');
  const { getPublicMenu, loadMenu, restaurant, isLoading, error } = useMenu();

  // Estados principais
  const [step, setStep] = useState<'welcome' | 'location' | 'menu' | 'product' | 'cart' | 'loyalty'>('welcome');
  const [orderType, setOrderType] = useState<'dine-in' | 'delivery' | null>(null);
  const [selectedTable, setSelectedTable] = useState(tableNumber || '');
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    number: '',
    neighborhood: '',
    zipCode: '',
    complement: '',
    deliveryFee: 0,
    estimatedTime: 0
  });

  // Estados do cardápio
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Estados do cliente (will be loaded from API when customer auth is implemented)
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  // Load menu when slug changes
  React.useEffect(() => {
    if (restaurantSlug) {
      loadMenu(restaurantSlug);
    }
  }, [restaurantSlug, loadMenu]);

  const { categories, products } = getPublicMenu(restaurantSlug);
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getCartItemsCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (product: any, quantity: number = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image
      }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const calculateDeliveryFee = (zipCode: string) => {
    const fees: Record<string, { fee: number; time: number }> = {
      '01000': { fee: 5.90, time: 25 },
      '02000': { fee: 7.90, time: 35 },
      '03000': { fee: 9.90, time: 45 }
    };
    const prefix = zipCode.substring(0, 5);
    return fees[prefix] || { fee: 12.90, time: 60 };
  };

  const handleZipCodeChange = (zipCode: string) => {
    if (zipCode.length === 8) {
      const { fee, time } = calculateDeliveryFee(zipCode);
      setDeliveryAddress(prev => ({
        ...prev,
        zipCode,
        deliveryFee: fee,
        estimatedTime: time
      }));
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'silver': return 'from-gray-300 to-gray-500';
      default: return 'from-orange-400 to-orange-600';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'gold': return Trophy;
      case 'silver': return Award;
      default: return Star;
    }
  };

  const getPointsToNextLevel = () => {
    if (!customerData) return 0;
    const thresholds: Record<string, number> = { bronze: 0, silver: 100, gold: 300 };
    if (customerData.level === 'gold') return 0;
    const nextLevel = customerData.level === 'bronze' ? 'silver' : 'gold';
    return thresholds[nextLevel] - customerData.points;
  };

  // Componente Welcome Screen
  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-600 to-green-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center space-x-3">
          <Link 
            href="/"
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-lg font-bold">Hamburgueria do Zé</h1>
            <p className="text-sm opacity-90">Centro • São Paulo</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
          <span>Aberto</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-64 h-64 rounded-3xl overflow-hidden mb-8 shadow-2xl">
          <img 
            src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400"
            alt="Hambúrguer especial"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-white mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Olá! Que bom ver você aqui! 😃
          </h2>
          <p className="text-lg opacity-90 mb-2">
            Como você gostaria de fazer seu pedido?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => {
              setOrderType('dine-in');
              setStep('location');
            }}
            className="w-full bg-white text-green-600 py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <Home className="w-6 h-6" />
            <span>Estou no restaurante</span>
          </button>

          <button
            onClick={() => {
              setOrderType('delivery');
              setStep('location');
            }}
            className="w-full bg-white/10 backdrop-blur-sm text-white py-4 px-6 rounded-2xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <Bike className="w-6 h-6" />
            <span>Quero delivery</span>
          </button>
        </div>

        {/* Info Cards */}
        <div className="flex items-center space-x-4 mt-8 text-white/80 text-sm">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>25-35 min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-current" />
            <span>4.8 (2.1k)</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bike className="w-4 h-4" />
            <span>R$ 5,90</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente Location Screen
  const LocationScreen = () => (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <button onClick={() => setStep('welcome')}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold">
              {orderType === 'dine-in' ? 'Qual sua mesa?' : 'Endereço de entrega'}
            </h1>
            <p className="text-sm opacity-90">
              {orderType === 'dine-in' ? 'Informe o número da sua mesa' : 'Para calcularmos a taxa de entrega'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {orderType === 'dine-in' ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número da mesa
              </label>
              <input
                type="text"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg text-center"
                placeholder="Ex: 05"
              />
            </div>

            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Como funciona:</p>
                  <ul className="space-y-1">
                    <li>• Navegue pelo cardápio digital</li>
                    <li>• Adicione itens ao carrinho</li>
                    <li>• Chame o garçom para finalizar</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('menu')}
              disabled={!selectedTable}
              className="w-full bg-green-600 text-white py-3 text-lg rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar para o cardápio
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
              <input
                type="text"
                value={deliveryAddress.zipCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setDeliveryAddress(prev => ({ ...prev, zipCode: value }));
                  handleZipCodeChange(value);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="00000-000"
                maxLength={8}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rua</label>
                <input
                  type="text"
                  value={deliveryAddress.street}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nome da rua"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nº</label>
                <input
                  type="text"
                  value={deliveryAddress.number}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, number: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="123"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
              <input
                type="text"
                value={deliveryAddress.neighborhood}
                onChange={(e) => setDeliveryAddress(prev => ({ ...prev, neighborhood: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nome do bairro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Complemento (opcional)</label>
              <input
                type="text"
                value={deliveryAddress.complement}
                onChange={(e) => setDeliveryAddress(prev => ({ ...prev, complement: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Apto, bloco, etc."
              />
            </div>

            {deliveryAddress.deliveryFee > 0 && (
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">Taxa de entrega</p>
                    <p className="text-sm text-blue-700">Tempo estimado: {deliveryAddress.estimatedTime} min</p>
                  </div>
                  <p className="text-lg font-bold text-blue-900">
                    {formatCurrency(deliveryAddress.deliveryFee)}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep('menu')}
              disabled={!deliveryAddress.zipCode || !deliveryAddress.street || !deliveryAddress.number}
              className="w-full bg-green-600 text-white py-3 text-lg rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar para o cardápio
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Componente Menu Screen
  const MenuScreen = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => setStep('location')}>
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-2">
                <ChefHat className="w-6 h-6" />
                <div>
                  <h1 className="font-bold">Hamburgueria do Zé</h1>
                  <p className="text-xs opacity-90">Centro • São Paulo</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setStep('loyalty')}
                className="p-2 bg-white/20 rounded-full"
              >
                <Gift className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 bg-white/20 rounded-full"
              >
                <ShoppingCart className="w-5 h-5" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-4 text-white text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Aberto</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bike className="w-4 h-4" />
                <span>21 min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>20 min</span>
              </div>
              <button className="flex items-center space-x-1">
                <Info className="w-4 h-4" />
                <span>Informações</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-200">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Percent className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-green-900">Cupons</p>
              <p className="text-xs text-green-700">Veja os descontos</p>
            </div>
          </button>
          <button 
            onClick={() => setStep('loyalty')}
            className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-200"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-blue-900">Fidelidade</p>
              <p className="text-xs text-blue-700">Veja seus pontos</p>
            </div>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-4 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar produto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pb-4 bg-white">
        <div className="flex space-x-3 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
              selectedCategory === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Todos
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 space-y-4">
        {/* Produtos em Destaque */}
        {filteredProducts.filter(p => p.isBestSeller).length > 0 && (
          <div className="bg-white rounded-2xl p-4 border-2 border-green-200">
            <h3 className="font-bold text-green-900 mb-3 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Mais Vendidos
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.filter(p => p.isBestSeller).slice(0, 4).map(product => (
                <div key={product.id} className="relative">
                  <div className="aspect-square rounded-xl overflow-hidden mb-2">
                    <img 
                      src={product.image || 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <p className="text-green-600 font-bold">{formatCurrency(product.price)}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute top-2 right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Produtos por Categoria */}
        {categories.map(category => {
          const categoryProducts = filteredProducts.filter(p => p.categoryId === category.id);
          if (categoryProducts.length === 0) return null;

          return (
            <div key={category.id} className="bg-white rounded-2xl p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <ChefHat className="w-5 h-5 mr-2" />
                {category.name}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {categoryProducts.map(product => (
                  <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="relative aspect-square">
                      <img 
                        src={product.image || 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.isPromotion && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Promoção
                        </div>
                      )}
                      {product.isNew && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Novo
                        </div>
                      )}
                      <button
                        onClick={() => addToCart(product)}
                        className="absolute bottom-2 right-2 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.isPromotion && product.originalPrice ? (
                            <div>
                              <span className="text-lg font-bold text-green-600">
                                {formatCurrency(product.price)}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-1">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {product.preparationTime}min
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Tente buscar por outro termo ou categoria</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {getCartItemsCount() > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>{getCartItemsCount()} {getCartItemsCount() === 1 ? 'item' : 'itens'}</span>
            </div>
            <span className="font-bold">{formatCurrency(getCartTotal())}</span>
          </button>
        </div>
      )}
    </div>
  );

  // Componente Cart Screen
  const CartScreen = () => (
    <div className={`fixed inset-0 bg-white z-50 flex flex-col transform transition-transform duration-300 ${
      showCart ? 'translate-x-0' : 'translate-x-full'
    }`}>
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <button onClick={() => setShowCart(false)}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Seu pedido</h1>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ShoppingCart className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">Seu carrinho está vazio</p>
            <p className="text-sm">Adicione itens do cardápio</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <img 
                    src={item.image || 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-green-600 font-bold">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Summary */}
      {cart.length > 0 && (
        <div className="border-t bg-white p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(getCartTotal())}</span>
            </div>
            {orderType === 'delivery' && (
              <div className="flex justify-between">
                <span>Taxa de entrega</span>
                <span>{formatCurrency(deliveryAddress.deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(getCartTotal() + (orderType === 'delivery' ? deliveryAddress.deliveryFee : 0))}</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (orderType === 'dine-in') {
                alert(`Pedido preparado! Chame o garçom da mesa ${selectedTable} para finalizar.`);
              } else {
                const orderText = cart.map(item => `${item.quantity}x ${item.name} - ${formatCurrency(item.price * item.quantity)}`).join('\n');
                const total = getCartTotal() + deliveryAddress.deliveryFee;
                const message = `🍔 *Pedido Delivery*\n\n${orderText}\n\nTaxa de entrega: ${formatCurrency(deliveryAddress.deliveryFee)}\n*Total: ${formatCurrency(total)}*\n\nEndereço: ${deliveryAddress.street}, ${deliveryAddress.number} - ${deliveryAddress.neighborhood}`;
                window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
              }
            }}
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg"
          >
            {orderType === 'dine-in' ? 'Chamar garçom' : 'Finalizar pelo WhatsApp'}
          </button>
        </div>
      )}
    </div>
  );

  // Componente Loyalty Screen
  const LoyaltyScreen = () => {
    // If customer is not logged in, show login prompt
    if (!customerData) {
      return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
            <div className="flex items-center space-x-3">
              <button onClick={() => setStep('menu')}>
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold">Programa de Fidelidade</h1>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Gift className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Participe do Programa</h2>
            <p className="text-gray-600 text-center mb-6">
              Acumule pontos, ganhe recompensas e tenha benefícios exclusivos!
            </p>
            <div className="space-y-3 w-full max-w-sm">
              <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold">
                Entrar com WhatsApp
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold">
                Criar conta
              </button>
            </div>
          </div>
        </div>
      );
    }

    const LevelIcon = getLevelIcon(customerData.level);
    const pointsToNext = getPointsToNextLevel();
    
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
          <div className="flex items-center space-x-3">
            <button onClick={() => setStep('menu')}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">Programa de Fidelidade</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Customer Info */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 pb-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold mb-1">{customerData.name}</h2>
              <p className="opacity-90">{customerData.phone}</p>
            </div>
          </div>

          {/* Points Card */}
          <div className="px-4 -mt-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${getLevelColor(customerData.level)} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <LevelIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 capitalize">{customerData.level}</h3>
                <p className="text-gray-600">Nível atual</p>
              </div>

              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-purple-600 mb-2">{customerData.points}</p>
                <p className="text-gray-600">pontos acumulados</p>
              </div>

              {pointsToNext > 0 && (
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <p className="text-purple-900 font-medium">
                    Faltam apenas <span className="font-bold">{pointsToNext} pontos</span> para o próximo nível!
                  </p>
                  <div className="w-full bg-purple-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(customerData.points / (customerData.points + pointsToNext)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rewards */}
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Suas Recompensas</h3>
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900">Hambúrguer Grátis</h4>
                    <p className="text-sm text-green-700">A cada 10 pedidos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">{customerData.orders}/10</p>
                    <div className="w-16 bg-green-200 rounded-full h-1 mt-1">
                      <div 
                        className="bg-green-600 h-1 rounded-full"
                        style={{ width: `${(customerData.orders / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Percent className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">15% de Desconto</h4>
                    <p className="text-sm text-blue-700">Disponível para usar</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Usar
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-900">Aniversário Especial</h4>
                    <p className="text-sm text-yellow-700">Sobremesa grátis no seu aniversário</p>
                  </div>
                  <span className="text-yellow-600 text-sm font-medium">Em breve</span>
                </div>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Como Funciona</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p className="text-gray-700">Faça pedidos e acumule pontos automaticamente</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p className="text-gray-700">Troque pontos por recompensas incríveis</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p className="text-gray-700">Suba de nível e desbloqueie benefícios exclusivos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="p-4 border-t bg-white">
          <button
            onClick={() => setStep('menu')}
            className="w-full bg-purple-600 text-white py-4 rounded-2xl font-semibold text-lg"
          >
            Voltar ao Cardápio
          </button>
        </div>
      </div>
    );
  };

  // Render principal baseado no step
  return (
    <div className="min-h-screen bg-gray-50">
      {step === 'welcome' && <WelcomeScreen />}
      {step === 'location' && <LocationScreen />}
      {step === 'menu' && <MenuScreen />}
      {step === 'loyalty' && <LoyaltyScreen />}
      {showCart && <CartScreen />}
    </div>
  );
}

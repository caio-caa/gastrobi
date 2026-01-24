'use client';

import React, { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useMenu } from '@/contexts/MenuContext';
import WelcomeScreen from '@/components/Menu/WelcomeScreen';
import LocationScreen from '@/components/Menu/LocationScreen';
import MenuScreen from '@/components/Menu/MenuScreen';
import CartScreen from '@/components/Menu/CartScreen';
import LoyaltyScreen from '@/components/Menu/LoyaltyScreen';
import { restaurantApi, deliveryApi, couponApi } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

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

  // Estados do cliente e recompensas
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [restaurantInfo, setRestaurantInfo] = useState<any>(null);

  // Load menu e restaurant info quando slug muda
  React.useEffect(() => {
    if (restaurantSlug) {
      loadMenu(restaurantSlug);
      loadRestaurantInfo(restaurantSlug);
    }
  }, [restaurantSlug, loadMenu]);

  const loadRestaurantInfo = async (slug: string) => {
    try {
      // Tenta o endpoint específico primeiro
      let response = await restaurantApi.getInfo(slug);
      
      // Se não encontrar, carrega via menu público
      if (response.error) {
        const menuResponse = await fetch(`${API_URL}/menu/${slug}`);
        if (menuResponse.ok) {
          const data = await menuResponse.json();
          setRestaurantInfo(data.restaurant || {});
          return;
        }
      }
      
      if (response.data) {
        setRestaurantInfo(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar informações do restaurante:', err);
    }
  };

  const loadRewards = async () => {
    try {
      const response = await fetch(`${API_URL}/loyalty/customer/${customerData?.phone}`);
      if (response.ok) {
        const data = await response.json();
        setRewards(data.rewards || []);
      }
    } catch (err) {
      console.error('Erro ao carregar recompensas:', err);
    }
  };

  React.useEffect(() => {
    if (customerData?.phone) {
      loadRewards();
    }
  }, [customerData?.phone]);

  const validateCoupon = async (code: string) => {
    try {
      const response = await couponApi.validate(restaurantSlug, {
        code,
        restaurantSlug,
        subtotal: getCartTotal(),
      });

      if (response.data?.valid) {
        return response.data;
      } else {
        alert(response.data?.message || 'Cupom inválido');
        return null;
      }
    } catch (err) {
      console.error('Erro ao validar cupom:', err);
      alert('Erro ao validar cupom');
      return null;
    }
  };

  const calculateDeliveryFeeAPI = async (zipCode: string) => {
    try {
      const response = await deliveryApi.calculateFee(restaurantSlug, zipCode);

      if (response.data?.available) {
        setDeliveryAddress(prev => ({
          ...prev,
          zipCode,
          deliveryFee: response.data!.fee,
          estimatedTime: response.data!.estimatedTime,
        }));
        return response.data;
      } else {
        alert(response.data?.message || 'Entrega não disponível para este CEP');
        return null;
      }
    } catch (err) {
      console.error('Erro ao calcular frete:', err);
      alert('Erro ao calcular frete');
      return null;
    }
  };

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
    // Isto é temporário - em produção, virá de uma API de cálculo de frete
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
      calculateDeliveryFeeAPI(zipCode);
    }
  };

  // Render principal baseado no step
  return (
    <div className="min-h-screen bg-gray-50">
      {step === 'welcome' && (
        <WelcomeScreen 
          restaurantName={restaurantInfo?.name || 'Cardápio Digital'}
          restaurantLocation={restaurantInfo?.location || 'Localização'}
          isOpen={restaurantInfo?.isOpen ?? true}
          rating={restaurantInfo?.rating ?? 0}
          reviews={restaurantInfo?.reviews ?? 0}
          deliveryTime={restaurantInfo?.deliveryTime || '30-40 min'}
          deliveryFee={restaurantInfo?.deliveryFee ?? 5.90}
          onDineIn={() => {
            setOrderType('dine-in');
            setStep('location');
          }}
          onDelivery={() => {
            setOrderType('delivery');
            setStep('location');
          }}
        />
      )}

      {step === 'location' && (
        <LocationScreen
          orderType={orderType || 'dine-in'}
          selectedTable={selectedTable}
          deliveryAddress={deliveryAddress}
          onBack={() => setStep('welcome')}
          onTableChange={setSelectedTable}
          onAddressChange={(updates) => setDeliveryAddress(prev => ({ ...prev, ...updates }))}
          onZipCodeChange={handleZipCodeChange}
          onContinue={() => setStep('menu')}
          formatCurrency={formatCurrency}
        />
      )}

      {step === 'menu' && (
        <MenuScreen
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          categories={categories}
          filteredProducts={filteredProducts}
          cartItemsCount={getCartItemsCount()}
          cartTotal={getCartTotal()}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onBack={() => setStep('location')}
          onShowCart={() => setShowCart(true)}
          onShowLoyalty={() => setStep('loyalty')}
          onAddToCart={(product) => addToCart(product)}
          formatCurrency={formatCurrency}
        />
      )}

      {step === 'loyalty' && (
        <LoyaltyScreen
          customerData={customerData}
          rewards={rewards}
          onBack={() => setStep('menu')}
        />
      )}

      {showCart && (
        <CartScreen
          cart={cart}
          orderType={orderType}
          selectedTable={selectedTable}
          deliveryAddress={deliveryAddress}
          onClose={() => setShowCart(false)}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateCartQuantity}
          onSubmitOrder={() => {
            if (orderType === 'dine-in') {
              alert(`Pedido preparado! Chame o garçom da mesa ${selectedTable} para finalizar.`);
            } else {
              const orderText = cart.map(item => `${item.quantity}x ${item.name} - ${formatCurrency(item.price * item.quantity)}`).join('\n');
              const total = getCartTotal() + deliveryAddress.deliveryFee;
              const message = `🍔 *Pedido Delivery*\n\n${orderText}\n\nTaxa de entrega: ${formatCurrency(deliveryAddress.deliveryFee)}\n*Total: ${formatCurrency(total)}*\n\nEndereço: ${deliveryAddress.street}, ${deliveryAddress.number} - ${deliveryAddress.neighborhood}`;
              window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
            }
          }}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
}

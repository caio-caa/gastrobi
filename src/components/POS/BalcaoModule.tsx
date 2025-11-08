import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, CreditCard, DollarSign, Smartphone, Printer, Trash2, ArrowLeft, Menu } from 'lucide-react';
import { usePOS } from '../../contexts/POSContext';
import Button from '../ui/Button';

interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

function BalcaoModule() {
  const { products, addOrder } = usePOS();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'dinheiro' | 'cartao' | 'pix'>('dinheiro');
  const [showPayment, setShowPayment] = useState(false);
  const [showCart, setShowCart] = useState(false); // Para mobile
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      setCart(cart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      ));
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
    setShowPayment(false);
  };

  const finalizeSale = () => {
    if (cart.length === 0) return;

    const orderItems = cart.map(item => ({
      id: Date.now().toString() + Math.random(),
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      status: 'pending' as const,
      addedAt: new Date()
    }));

    addOrder({
      type: 'balcao',
      items: orderItems,
      total: getTotal(),
      status: 'completed',
      paymentMethod
    });

    // Simular impressão do cupom
    alert(`Venda finalizada!\nTotal: R$ ${getTotal().toFixed(2)}\nPagamento: ${paymentMethod}\n\nCupom enviado para impressão.`);
    
    clearCart();
    setShowCart(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const categories = [...new Set(products.map(p => p.category))];
  const filteredProducts = selectedCategory === 'all' 
    ? products.filter(p => p.isActive)
    : products.filter(p => p.category === selectedCategory && p.isActive);

  // Mobile Cart Overlay
  const MobileCartOverlay = () => (
    <div className={`fixed inset-0 bg-white z-50 transform transition-transform duration-300 lg:hidden ${
      showCart ? 'translate-x-0' : 'translate-x-full'
    }`}>
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center justify-between">
        <button onClick={() => setShowCart(false)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold">Carrinho</h2>
        {cart.length > 0 && (
          <button onClick={clearCart} className="p-2">
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Cart Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Carrinho vazio</p>
            <p className="text-sm">Adicione produtos para começar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.productId} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.productName}</h4>
                    <p className="text-green-600 font-bold">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-12 text-center font-medium text-lg">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Payment Section */}
      {cart.length > 0 && (
        <div className="border-t bg-white p-4 space-y-4">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span className="text-green-600">{formatCurrency(getTotal())}</span>
          </div>

          {!showPayment ? (
            <Button
              onClick={() => setShowPayment(true)}
              className="w-full py-4 text-lg"
            >
              Finalizar Venda
            </Button>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 text-lg">Forma de Pagamento:</h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setPaymentMethod('dinheiro')}
                  className={`p-4 rounded-xl border-2 flex items-center space-x-3 ${
                    paymentMethod === 'dinheiro'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <DollarSign className="w-6 h-6" />
                  <span className="text-lg">Dinheiro</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('cartao')}
                  className={`p-4 rounded-xl border-2 flex items-center space-x-3 ${
                    paymentMethod === 'cartao'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-lg">Cartão</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 rounded-xl border-2 flex items-center space-x-3 ${
                    paymentMethod === 'pix'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-lg">PIX</span>
                </button>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowPayment(false)}
                  className="flex-1 py-3"
                >
                  Voltar
                </Button>
                <Button
                  onClick={finalizeSale}
                  icon={Printer}
                  className="flex-1 py-3"
                >
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6" />
            <h1 className="text-lg font-semibold">Balcão</h1>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative p-2 bg-white/20 rounded-full"
          >
            <ShoppingCart className="w-6 h-6" />
            {getCartItemsCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                {getCartItemsCount()}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Categories */}
        <div className="bg-white p-4 border-b sticky top-16 z-30">
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Todos
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Products Grid */}
        <div className="p-4 pb-20">
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                  {product.name}
                </h4>
                <p className="text-blue-600 font-bold">
                  {formatCurrency(product.price)}
                </p>
                <div className="mt-3 flex justify-end">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Floating Cart Button */}
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
              <span className="font-bold">{formatCurrency(getTotal())}</span>
            </button>
          </div>
        )}

        <MobileCartOverlay />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Desktop Products */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-blue-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Produtos
            </h2>
          </div>
          
          <div className="p-4 overflow-y-auto h-full">
            {categories.map(category => (
              <div key={category} className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-3 border-b pb-2">
                  {category}
                </h3>
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                  {products
                    .filter(product => product.category === category && product.isActive)
                    .map(product => (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                      >
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {product.name}
                        </h4>
                        <p className="text-blue-600 font-bold">
                          {formatCurrency(product.price)}
                        </p>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Cart */}
        <div className="bg-white rounded-xl shadow-sm border flex flex-col">
          <div className="p-4 border-b bg-green-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-between">
              <span className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Carrinho
              </span>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </h2>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Carrinho vazio</p>
                <p className="text-sm">Adicione produtos para começar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.productName}</h4>
                      <p className="text-green-600 font-bold text-sm">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">{formatCurrency(getTotal())}</span>
              </div>

              {!showPayment ? (
                <Button
                  onClick={() => setShowPayment(true)}
                  className="w-full"
                  size="lg"
                >
                  Finalizar Venda
                </Button>
              ) : (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Forma de Pagamento:</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod('dinheiro')}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center space-y-1 ${
                        paymentMethod === 'dinheiro'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <DollarSign className="w-5 h-5" />
                      <span className="text-xs">Dinheiro</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('cartao')}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center space-y-1 ${
                        paymentMethod === 'cartao'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="text-xs">Cartão</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center space-y-1 ${
                        paymentMethod === 'pix'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Smartphone className="w-5 h-5" />
                      <span className="text-xs">PIX</span>
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => setShowPayment(false)}
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={finalizeSale}
                      icon={Printer}
                      className="flex-1"
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BalcaoModule;
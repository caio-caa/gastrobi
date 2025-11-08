import React, { useState } from 'react';
import { Plus, Minus, User, MapPin, Phone, MessageSquare, Clock, Truck } from 'lucide-react';
import { usePOS } from '../../contexts/POSContext';
import Button from '../ui/Button';

interface DeliveryOrder {
  customer: {
    name: string;
    phone: string;
    address: string;
    neighborhood: string;
    complement?: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
  deliveryFee: number;
  estimatedTime: number;
}

function DeliveryModule() {
  const { products, addOrder, calculateDeliveryFee, orders } = usePOS();
  const [currentOrder, setCurrentOrder] = useState<DeliveryOrder>({
    customer: {
      name: '',
      phone: '',
      address: '',
      neighborhood: '',
      complement: ''
    },
    items: [],
    deliveryFee: 0,
    estimatedTime: 45
  });
  const [step, setStep] = useState<'customer' | 'products' | 'review'>('customer');

  const neighborhoods = [
    'Centro',
    'Bairro Alto', 
    'Vila Nova',
    'Jardim América',
    'Periferia'
  ];

  const addToCart = (product: any) => {
    const existingItem = currentOrder.items.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCurrentOrder(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }));
    } else {
      setCurrentOrder(prev => ({
        ...prev,
        items: [...prev.items, {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1
        }]
      }));
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCurrentOrder(prev => ({
        ...prev,
        items: prev.items.filter(item => item.productId !== productId)
      }));
    } else {
      setCurrentOrder(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      }));
    }
  };

  const updateCustomer = (field: string, value: string) => {
    setCurrentOrder(prev => ({
      ...prev,
      customer: { ...prev.customer, [field]: value },
      ...(field === 'neighborhood' && {
        deliveryFee: calculateDeliveryFee(value),
        estimatedTime: value === 'Centro' ? 30 : value === 'Periferia' ? 60 : 45
      })
    }));
  };

  const getSubtotal = () => {
    return currentOrder.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotal = () => {
    return getSubtotal() + currentOrder.deliveryFee;
  };

  const finalizeOrder = () => {
    const orderItems = currentOrder.items.map(item => ({
      id: Date.now().toString() + Math.random(),
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      status: 'pending' as const,
      addedAt: new Date()
    }));

    const orderId = addOrder({
      type: 'delivery',
      items: orderItems,
      total: getTotal(),
      status: 'open',
      customer: {
        ...currentOrder.customer,
        deliveryFee: currentOrder.deliveryFee
      }
    });

    // Simular envio WhatsApp
    const message = `🍔 *Novo Pedido Delivery*\n\n*Cliente:* ${currentOrder.customer.name}\n*Telefone:* ${currentOrder.customer.phone}\n\n*Itens:*\n${currentOrder.items.map(item => `${item.quantity}x ${item.productName} - R$ ${(item.price * item.quantity).toFixed(2)}`).join('\n')}\n\n*Subtotal:* R$ ${getSubtotal().toFixed(2)}\n*Taxa de entrega:* R$ ${currentOrder.deliveryFee.toFixed(2)}\n*Total:* R$ ${getTotal().toFixed(2)}\n\n*Endereço:*\n${currentOrder.customer.address}\n${currentOrder.customer.neighborhood}\n${currentOrder.customer.complement ? `Complemento: ${currentOrder.customer.complement}` : ''}\n\n*Tempo estimado:* ${currentOrder.estimatedTime} minutos`;

    alert(`Pedido criado com sucesso!\nID: ${orderId}\n\nMensagem WhatsApp:\n${message}`);

    // Reset
    setCurrentOrder({
      customer: { name: '', phone: '', address: '', neighborhood: '', complement: '' },
      items: [],
      deliveryFee: 0,
      estimatedTime: 45
    });
    setStep('customer');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const deliveryOrders = orders.filter(o => o.type === 'delivery');

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Formulário Principal */}
      <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b bg-green-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Truck className="w-5 h-5 mr-2" />
            Delivery - {step === 'customer' ? 'Dados do Cliente' : step === 'products' ? 'Produtos' : 'Revisão'}
          </h2>
        </div>

        <div className="p-6">
          {step === 'customer' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do cliente
                  </label>
                  <input
                    type="text"
                    value={currentOrder.customer.name}
                    onChange={(e) => updateCustomer('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={currentOrder.customer.phone}
                    onChange={(e) => updateCustomer('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço completo
                </label>
                <input
                  type="text"
                  value={currentOrder.customer.address}
                  onChange={(e) => updateCustomer('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Rua, número"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro
                  </label>
                  <select
                    value={currentOrder.customer.neighborhood}
                    onChange={(e) => updateCustomer('neighborhood', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Selecione o bairro</option>
                    {neighborhoods.map(neighborhood => (
                      <option key={neighborhood} value={neighborhood}>
                        {neighborhood} - {formatCurrency(calculateDeliveryFee(neighborhood))}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={currentOrder.customer.complement}
                    onChange={(e) => updateCustomer('complement', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Apto, bloco, etc."
                  />
                </div>
              </div>

              {currentOrder.customer.neighborhood && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">Taxa de entrega</p>
                      <p className="text-sm text-blue-700">Tempo estimado: {currentOrder.estimatedTime} min</p>
                    </div>
                    <p className="text-lg font-bold text-blue-900">
                      {formatCurrency(currentOrder.deliveryFee)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep('products')}
                  disabled={!currentOrder.customer.name || !currentOrder.customer.phone || !currentOrder.customer.address || !currentOrder.customer.neighborhood}
                >
                  Próximo: Produtos
                </Button>
              </div>
            </div>
          )}

          {step === 'products' && (
            <div className="space-y-6">
              {[...new Set(products.map(p => p.category))].map(category => (
                <div key={category}>
                  <h3 className="text-md font-medium text-gray-700 mb-3 border-b pb-2">
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {products
                      .filter(product => product.category === category && product.isActive)
                      .map(product => (
                        <button
                          key={product.id}
                          onClick={() => addToCart(product)}
                          className="p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
                        >
                          <h4 className="font-medium text-gray-900 text-sm mb-1">
                            {product.name}
                          </h4>
                          <p className="text-green-600 font-bold text-sm">
                            {formatCurrency(product.price)}
                          </p>
                        </button>
                      ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-between pt-4 border-t">
                <Button variant="ghost" onClick={() => setStep('customer')}>
                  Voltar
                </Button>
                <Button
                  onClick={() => setStep('review')}
                  disabled={currentOrder.items.length === 0}
                >
                  Revisar Pedido
                </Button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Dados do Cliente</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><strong>Nome:</strong> {currentOrder.customer.name}</p>
                  <p><strong>Telefone:</strong> {currentOrder.customer.phone}</p>
                  <p><strong>Endereço:</strong> {currentOrder.customer.address}</p>
                  <p><strong>Bairro:</strong> {currentOrder.customer.neighborhood}</p>
                  {currentOrder.customer.complement && (
                    <p><strong>Complemento:</strong> {currentOrder.customer.complement}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Itens do Pedido</h3>
                <div className="space-y-2">
                  {currentOrder.items.map(item => (
                    <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.productName}</h4>
                        <p className="text-sm text-gray-600">{formatCurrency(item.price)} cada</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de entrega:</span>
                    <span>{formatCurrency(currentOrder.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-green-600">{formatCurrency(getTotal())}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep('products')}>
                  Voltar
                </Button>
                <Button onClick={finalizeOrder} icon={MessageSquare}>
                  Finalizar Pedido
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar com carrinho e pedidos */}
      <div className="space-y-6">
        {/* Carrinho atual */}
        {currentOrder.items.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b bg-green-50">
              <h3 className="font-semibold text-gray-900">Carrinho Atual</h3>
            </div>
            <div className="p-4 space-y-2">
              {currentOrder.items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.productName}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-bold">
                Total: {formatCurrency(getSubtotal())}
              </div>
            </div>
          </div>
        )}

        {/* Pedidos delivery ativos */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b bg-orange-50">
            <h3 className="font-semibold text-gray-900">Pedidos Delivery</h3>
          </div>
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {deliveryOrders.filter(o => o.status !== 'completed').map(order => (
              <div key={order.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">{order.customer?.name}</p>
                    <p className="text-xs text-gray-600">{order.customer?.phone}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'ready' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status === 'open' ? 'Recebido' :
                     order.status === 'preparing' ? 'Preparando' :
                     order.status === 'ready' ? 'Pronto' : order.status}
                  </span>
                </div>
                <p className="text-sm font-bold text-green-600">
                  {formatCurrency(order.total)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                </p>
              </div>
            ))}
            {deliveryOrders.filter(o => o.status !== 'completed').length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum pedido ativo</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryModule;
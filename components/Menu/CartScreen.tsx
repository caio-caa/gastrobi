'use client';

import React from 'react';
import { ArrowLeft, ShoppingCart, Minus, Plus } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  extras?: string[];
  notes?: string;
  image?: string;
}

interface CartScreenProps {
  cart: CartItem[];
  orderType: 'dine-in' | 'delivery' | null;
  selectedTable: string;
  deliveryAddress: {
    street: string;
    number: string;
    neighborhood: string;
    zipCode: string;
    complement: string;
    deliveryFee: number;
    estimatedTime: number;
  };
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onSubmitOrder: () => void;
  formatCurrency: (value: number) => string;
}

export default function CartScreen({
  cart,
  orderType,
  selectedTable,
  deliveryAddress,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onSubmitOrder,
  formatCurrency,
}: CartScreenProps) {
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalWithFee = cartTotal + (orderType === 'delivery' ? deliveryAddress.deliveryFee : 0);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <button onClick={onClose}>
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
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
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
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            {orderType === 'delivery' && (
              <div className="flex justify-between">
                <span>Taxa de entrega</span>
                <span>{formatCurrency(deliveryAddress.deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(totalWithFee)}</span>
            </div>
          </div>

          <button
            onClick={onSubmitOrder}
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg"
          >
            {orderType === 'dine-in' ? 'Chamar garçom' : 'Finalizar pelo WhatsApp'}
          </button>
        </div>
      )}
    </div>
  );
}

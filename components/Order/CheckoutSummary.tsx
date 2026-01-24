'use client';

import React from 'react';
import { X, Plus, Minus } from 'lucide-react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  tip?: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export default function CheckoutSummary({
  items,
  subtotal,
  deliveryFee,
  discount = 0,
  tip = 0,
  onUpdateQuantity,
  onRemoveItem
}: CheckoutSummaryProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const total = subtotal + deliveryFee - discount + tip;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <h3 className="font-semibold text-gray-900">Resumo do Pedido</h3>

      {/* Items */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
            {/* Image */}
            {item.image && (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="px-2 py-1 bg-gray-100 rounded text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="ml-auto p-1 hover:bg-red-50 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            {/* Subtotal */}
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-gray-900">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {deliveryFee > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Taxa de Entrega</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Desconto</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        {tip > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Gorjeta</span>
            <span>+{formatCurrency(tip)}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold text-lg text-gray-900 pt-2 border-t border-gray-100">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}

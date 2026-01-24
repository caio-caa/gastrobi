'use client';

import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';

type DeliveryAddress = {
  street: string;
  number: string;
  neighborhood: string;
  zipCode: string;
  complement: string;
  deliveryFee: number;
  estimatedTime: number;
};

interface LocationScreenProps {
  orderType: 'dine-in' | 'delivery';
  selectedTable: string;
  deliveryAddress: DeliveryAddress;
  onBack: () => void;
  onTableChange: (table: string) => void;
  onAddressChange: (address: Partial<DeliveryAddress>) => void;
  onZipCodeChange: (zipCode: string) => void;
  onContinue: () => void;
  formatCurrency: (value: number) => string;
}

export default function LocationScreen({
  orderType,
  selectedTable,
  deliveryAddress,
  onBack,
  onTableChange,
  onAddressChange,
  onZipCodeChange,
  onContinue,
  formatCurrency,
}: LocationScreenProps) {
  const calculateDeliveryFee = (zipCode: string) => {
    // Esta função será removida - a taxa de entrega virá da API
    // Por enquanto, retorna um valor padrão
    return { fee: 0, time: 0 };
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <button onClick={onBack}>
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
                onChange={(e) => onTableChange(e.target.value)}
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
              onClick={onContinue}
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
                  onAddressChange({ zipCode: value });
                  onZipCodeChange(value);
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
                  onChange={(e) => onAddressChange({ street: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nome da rua"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nº</label>
                <input
                  type="text"
                  value={deliveryAddress.number}
                  onChange={(e) => onAddressChange({ number: e.target.value })}
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
                onChange={(e) => onAddressChange({ neighborhood: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nome do bairro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Complemento (opcional)</label>
              <input
                type="text"
                value={deliveryAddress.complement}
                onChange={(e) => onAddressChange({ complement: e.target.value })}
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
              onClick={onContinue}
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
}

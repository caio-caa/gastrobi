'use client';

import React from 'react';
import { CreditCard, QrCode, AlertCircle } from 'lucide-react';

interface PaymentMethodProps {
  value: 'PIX' | 'CARD';
  onChange: (method: 'PIX' | 'CARD') => void;
  total: number;
}

export default function PaymentMethod({ value, onChange, total }: PaymentMethodProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Forma de Pagamento</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PIX */}
        <button
          type="button"
          onClick={() => onChange('PIX')}
          className={`p-4 rounded-lg border-2 transition-all ${
            value === 'PIX'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex flex-col items-start space-y-3">
            <div className="flex items-center space-x-2">
              <QrCode className={`w-6 h-6 ${value === 'PIX' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`font-semibold ${value === 'PIX' ? 'text-blue-600' : 'text-gray-700'}`}>
                Pix
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-600">
                Pague pelo seu aplicativo bancário
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Instantâneo e seguro
              </p>
            </div>
          </div>
        </button>

        {/* CARD */}
        <button
          type="button"
          onClick={() => onChange('CARD')}
          className={`p-4 rounded-lg border-2 transition-all ${
            value === 'CARD'
              ? 'border-green-600 bg-green-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex flex-col items-start space-y-3">
            <div className="flex items-center space-x-2">
              <CreditCard className={`w-6 h-6 ${value === 'CARD' ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={`font-semibold ${value === 'CARD' ? 'text-green-600' : 'text-gray-700'}`}>
                Cartão de Crédito
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-600">
                Cartão de crédito
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Parcelado em até 3x
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Total */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">Total a pagar:</span>
          <span className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start space-x-2 bg-blue-50 p-3 rounded-lg">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          {value === 'PIX' 
            ? 'Você receberá um QR code para escanear após confirmar o pedido.'
            : 'Os dados do cartão são criptografados e processados com segurança.'}
        </p>
      </div>
    </div>
  );
}

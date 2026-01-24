'use client';

import React from 'react';
import { Bike, Package } from 'lucide-react';

interface OrderTypeSelectorProps {
  value: 'DELIVERY' | 'TAKEAWAY';
  onChange: (type: 'DELIVERY' | 'TAKEAWAY') => void;
}

export default function OrderTypeSelector({ value, onChange }: OrderTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Delivery */}
      <button
        onClick={() => onChange('DELIVERY')}
        className={`p-4 rounded-lg border-2 transition-all ${
          value === 'DELIVERY'
            ? 'border-blue-600 bg-blue-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex flex-col items-center space-y-2">
          <Bike className={`w-8 h-8 ${value === 'DELIVERY' ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className={`font-medium ${value === 'DELIVERY' ? 'text-blue-600' : 'text-gray-700'}`}>
            Delivery
          </span>
          <span className="text-xs text-gray-500">Entrega em casa</span>
        </div>
      </button>

      {/* Takeaway */}
      <button
        onClick={() => onChange('TAKEAWAY')}
        className={`p-4 rounded-lg border-2 transition-all ${
          value === 'TAKEAWAY'
            ? 'border-green-600 bg-green-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex flex-col items-center space-y-2">
          <Package className={`w-8 h-8 ${value === 'TAKEAWAY' ? 'text-green-600' : 'text-gray-400'}`} />
          <span className={`font-medium ${value === 'TAKEAWAY' ? 'text-green-600' : 'text-gray-700'}`}>
            Retirada
          </span>
          <span className="text-xs text-gray-500">No balcão</span>
        </div>
      </button>
    </div>
  );
}

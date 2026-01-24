'use client';

import React from 'react';
import { MapPin, AlertCircle } from 'lucide-react';

interface AddressFormProps {
  onSubmit: (address: Address) => void;
  isLoading?: boolean;
}

export interface Address {
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  zipCode: string;
}

export default function AddressForm({ onSubmit, isLoading = false }: AddressFormProps) {
  const [formData, setFormData] = React.useState<Address>({
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    zipCode: ''
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'CEP é obrigatório';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Rua/Avenida é obrigatória';
    }
    if (!formData.number.trim()) {
      newErrors.number = 'Número é obrigatório';
    }
    if (!formData.neighborhood.trim()) {
      newErrors.neighborhood = 'Bairro é obrigatório';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* CEP */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CEP *
        </label>
        <input
          type="text"
          name="zipCode"
          placeholder="00000-000"
          value={formData.zipCode}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.zipCode ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.zipCode && (
          <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.zipCode}</span>
          </div>
        )}
      </div>

      {/* Endereço */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rua/Avenida *
          </label>
          <input
            type="text"
            name="address"
            placeholder="Ex: Rua das Flores"
            value={formData.address}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.address && (
            <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.address}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número *
          </label>
          <input
            type="text"
            name="number"
            placeholder="Ex: 123"
            value={formData.number}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.number ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.number && (
            <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.number}</span>
            </div>
          )}
        </div>
      </div>

      {/* Complemento */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Complemento (Apto, Sala, etc)
        </label>
        <input
          type="text"
          name="complement"
          placeholder="Ex: Apto 42, Bloco B"
          value={formData.complement}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Bairro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bairro *
          </label>
          <input
            type="text"
            name="neighborhood"
            placeholder="Ex: Centro"
            value={formData.neighborhood}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.neighborhood ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.neighborhood && (
            <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.neighborhood}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cidade *
          </label>
          <input
            type="text"
            name="city"
            placeholder="Ex: São Paulo"
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.city && (
            <div className="flex items-center space-x-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.city}</span>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition-colors"
      >
        {isLoading ? 'Processando...' : 'Confirmar Endereço'}
      </button>
    </form>
  );
}

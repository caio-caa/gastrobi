'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Save, Loader } from 'lucide-react';
import ImageUpload from './ImageUpload';
import Button from './Button';

interface RestaurantSettingsProps {
  restaurantId: string;
  initialData?: any;
  onSave?: (data: any) => void;
}

export default function RestaurantSettings({
  restaurantId,
  initialData,
  onSave
}: RestaurantSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [data, setData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    website: initialData?.website || '',
    description: initialData?.description || '',
    logo: initialData?.logo || '',
    coverImage: initialData?.coverImage || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
    setSaved(false);
  };

  const handleLogoUpload = (url: string, publicId: string) => {
    setData(prev => ({
      ...prev,
      logo: url
    }));
    setSaved(false);
  };

  const handleCoverUpload = (url: string, publicId: string) => {
    setData(prev => ({
      ...prev,
      coverImage: url
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!data.name.trim()) {
      alert('Por favor, preencha o nome do restaurante');
      return;
    }

    setLoading(true);
    try {
      await onSave?.(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações do Restaurante</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Restaurante *
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome do restaurante"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contato@restaurante.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(11) 99999-9999"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              value={data.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://restaurante.com.br"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={data.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição do restaurante"
              rows={4}
              disabled={loading}
            />
          </div>
        </div>

        {/* Endereço e Localização */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rua, número"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cidade
            </label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="São Paulo"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <input
                type="text"
                value={data.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SP"
                disabled={loading}
                maxLength="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CEP
              </label>
              <input
                type="text"
                value={data.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="01310-100"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Imagens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo do Restaurante</h3>
          <ImageUpload
            label="Logo (até 5MB)"
            folder="logos"
            onUploadSuccess={handleLogoUpload}
            restaurantId={restaurantId}
            initialImage={data.logo}
            disabled={loading}
          />
          {data.logo && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={data.logo}
                  alt="Logo"
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Imagem de Capa</h3>
          <ImageUpload
            label="Cover (até 5MB)"
            folder="covers"
            onUploadSuccess={handleCoverUpload}
            restaurantId={restaurantId}
            initialImage={data.coverImage}
            disabled={loading}
          />
          {data.coverImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={data.coverImage}
                  alt="Cover"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 400px"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
        <div className="flex-1">
          {saved && (
            <div className="text-green-600 text-sm font-medium">
              ✓ Salvo com sucesso!
            </div>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          icon={loading ? Loader : Save}
          className={loading ? 'opacity-75 cursor-wait' : ''}
        >
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
}

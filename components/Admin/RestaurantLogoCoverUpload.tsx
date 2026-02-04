'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { uploadImage, updateRestaurant } from '@/lib/cloudinary';

interface RestaurantLogoCoverUploadProps {
  restaurantId: string;
  currentLogo?: string;
  currentCover?: string;
  token: string;
  onSuccess?: (data: { logo?: string; cover?: string }) => void;
}

export default function RestaurantLogoCoverUpload({
  restaurantId,
  currentLogo,
  currentCover,
  token,
  onSuccess,
}: RestaurantLogoCoverUploadProps) {
  const [logoLoading, setLogoLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLogoUpload = async (file: File) => {
    try {
      setLogoLoading(true);
      setMessage(null);

      // 1. Upload para Cloudinary
      const { url: logoUrl } = await uploadImage(file, 'logos', token);

      // 2. Atualizar restaurante
      await updateRestaurant(
        restaurantId,
        {
          settings: {
            logo: logoUrl,
          },
        },
        token
      );

      setMessage({
        type: 'success',
        text: 'Logo atualizado com sucesso!',
      });

      onSuccess?.({ logo: logoUrl });
    } catch (error) {
      console.error('Error:', error);
      setMessage({
        type: 'error',
        text: 'Erro ao atualizar logo. Tente novamente.',
      });
      throw error;
    } finally {
      setLogoLoading(false);
    }
  };

  const handleCoverUpload = async (file: File) => {
    try {
      setCoverLoading(true);
      setMessage(null);

      // 1. Upload para Cloudinary
      const { url: coverUrl } = await uploadImage(file, 'covers', token);

      // 2. Atualizar restaurante
      await updateRestaurant(
        restaurantId,
        {
          settings: {
            cover: coverUrl,
          },
        },
        token
      );

      setMessage({
        type: 'success',
        text: 'Capa atualizada com sucesso!',
      });

      onSuccess?.({ cover: coverUrl });
    } catch (error) {
      console.error('Error:', error);
      setMessage({
        type: 'error',
        text: 'Erro ao atualizar capa. Tente novamente.',
      });
      throw error;
    } finally {
      setCoverLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo do Restaurante</h3>
        <ImageUpload
          onUpload={handleLogoUpload}
          currentImage={currentLogo}
          folder="logos"
          label="Logo"
          hint="JPG, PNG, GIF ou WebP. Máximo 5MB. Recomendado: 1200x800px"
        />
      </div>

      {/* Cover */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Capa do Restaurante</h3>
        <ImageUpload
          onUpload={handleCoverUpload}
          currentImage={currentCover}
          folder="covers"
          label="Capa"
          hint="JPG, PNG, GIF ou WebP. Máximo 5MB. Recomendado: 1200x400px"
        />
      </div>

      {message && (
        <div
          className={`flex items-center space-x-2 p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}
    </div>
  );
}

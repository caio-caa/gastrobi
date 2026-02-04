'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatarUpload from '@/components/Admin/UserAvatarUpload';
import RestaurantLogoCoverUpload from '@/components/Admin/RestaurantLogoCoverUpload';
import WhiteLabelUpload from '@/components/Admin/WhiteLabelUpload';

/**
 * Exemplo de página para gerenciar uploads via Cloudinary
 * Você pode adaptar isso para suas páginas de settings, admin, etc.
 */
export default function UploadExamplePage() {
  const { user } = useAuth();
  const token = localStorage.getItem('gastrobi_token') || '';

  if (!user || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Faça login para acessar esta página</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* User Avatar */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Gerenciar Perfil
          </h1>
          <UserAvatarUpload
            userId={user.id}
            fullName={user.name}
            token={token}
            onSuccess={(avatarUrl) => {
              console.log('Avatar atualizado:', avatarUrl);
            }}
          />
        </section>

        {/* White Label */}
        <section className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Criar White Label
          </h1>
          <WhiteLabelUpload
            token={token}
            onSuccess={(data) => {
              console.log('White label criado:', data);
            }}
          />
        </section>

        {/* White Label Update */}
        <section className="bg-white rounded-lg shadow-sm p-8 mt-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Atualizar White Label
          </h1>
          <WhiteLabelUpload
            whiteLabelId="white-label-123"
            token={token}
            currentLogo="https://example.com/logo.webp"
            currentFavicon="https://example.com/favicon.webp"
            brandName="Minha Marca"
            primaryColor="#3b82f6"
            secondaryColor="#1e40af"
            onSuccess={(data) => {
              console.log('White label atualizado:', data);
            }}
          />
        </section>
      </div>
    </div>
  );
}

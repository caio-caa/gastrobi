'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { uploadImage, updateUserAvatar } from '@/lib/cloudinary';

interface UserAvatarUploadProps {
  userId: string;
  fullName: string;
  currentAvatar?: string;
  token: string;
  onSuccess?: (avatarUrl: string) => void;
}

export default function UserAvatarUpload({
  userId,
  fullName,
  currentAvatar,
  token,
  onSuccess,
}: UserAvatarUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setMessage(null);

      // 1. Upload para Cloudinary
      const { url: avatarUrl } = await uploadImage(file, 'avatars', token);

      // 2. Atualizar usuário no backend
      await updateUserAvatar(userId, avatarUrl, fullName, token);

      // 3. Sucesso
      setMessage({
        type: 'success',
        text: 'Avatar atualizado com sucesso!',
      });

      onSuccess?.(avatarUrl);
    } catch (error) {
      console.error('Error:', error);
      setMessage({
        type: 'error',
        text: 'Erro ao atualizar avatar. Tente novamente.',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ImageUpload
        onUpload={handleUpload}
        currentImage={currentAvatar}
        folder="avatars"
        label="Foto de Perfil"
        hint="JPG, PNG, GIF ou WebP. Máximo 5MB"
      />

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

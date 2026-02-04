'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { uploadImage, createWhiteLabel, updateWhiteLabel } from '@/lib/cloudinary';

interface WhiteLabelUploadProps {
  whiteLabelId?: string; // Se undefined, é create. Se definido, é update
  token: string;
  currentLogo?: string;
  currentFavicon?: string;
  clientName?: string;
  brandName?: string;
  domain?: string;
  primaryColor?: string;
  secondaryColor?: string;
  onSuccess?: (data: any) => void;
}

export default function WhiteLabelUpload({
  whiteLabelId,
  token,
  currentLogo,
  currentFavicon,
  clientName = '',
  brandName = '',
  domain = '',
  primaryColor = '#3b82f6',
  secondaryColor = '#1e40af',
  onSuccess,
}: WhiteLabelUploadProps) {
  const [formData, setFormData] = useState({
    clientName,
    brandName,
    domain,
    primaryColor,
    secondaryColor,
  });

  const [logoUrl, setLogoUrl] = useState<string | undefined>(currentLogo);
  const [faviconUrl, setFaviconUrl] = useState<string | undefined>(currentFavicon);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLogoUpload = async (file: File) => {
    try {
      const { url } = await uploadImage(file, 'logos', token);
      setLogoUrl(url);
      setMessage({
        type: 'success',
        text: 'Logo enviado com sucesso!',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro ao enviar logo.',
      });
      throw error;
    }
  };

  const handleFaviconUpload = async (file: File) => {
    try {
      const { url } = await uploadImage(file, 'logos', token);
      setFaviconUrl(url);
      setMessage({
        type: 'success',
        text: 'Favicon enviado com sucesso!',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erro ao enviar favicon.',
      });
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.brandName || !formData.domain || !logoUrl || !faviconUrl) {
      setMessage({
        type: 'error',
        text: 'Preencha todos os campos e envie as imagens.',
      });
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);

      let response;

      if (whiteLabelId) {
        // Update
        response = await updateWhiteLabel(
          whiteLabelId,
          {
            brandName: formData.brandName,
            logo: logoUrl,
            favicon: faviconUrl,
            primaryColor: formData.primaryColor,
            secondaryColor: formData.secondaryColor,
          },
          token
        );
      } else {
        // Create
        response = await createWhiteLabel(
          {
            clientName: formData.clientName,
            brandName: formData.brandName,
            domain: formData.domain,
            logo: logoUrl,
            favicon: faviconUrl,
            primaryColor: formData.primaryColor,
            secondaryColor: formData.secondaryColor,
          },
          token
        );
      }

      setMessage({
        type: 'success',
        text: whiteLabelId
          ? 'White label atualizado com sucesso!'
          : 'White label criado com sucesso!',
      });

      onSuccess?.(response);
    } catch (error) {
      console.error('Error:', error);
      setMessage({
        type: 'error',
        text: 'Erro ao salvar. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Name (apenas para create) */}
      {!whiteLabelId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Cliente
          </label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) =>
              setFormData({ ...formData, clientName: e.target.value })
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Marca Premium"
          />
        </div>
      )}

      {/* Brand Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome da Marca
        </label>
        <input
          type="text"
          value={formData.brandName}
          onChange={(e) =>
            setFormData({ ...formData, brandName: e.target.value })
          }
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Premium Restaurant"
        />
      </div>

      {/* Domain (apenas para create) */}
      {!whiteLabelId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domínio
          </label>
          <input
            type="text"
            value={formData.domain}
            onChange={(e) =>
              setFormData({ ...formData, domain: e.target.value })
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: premium.com"
          />
        </div>
      )}

      {/* Logo */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo</h3>
        <ImageUpload
          onUpload={handleLogoUpload}
          currentImage={logoUrl}
          folder="logos"
          label="Logo"
          hint="JPG, PNG, GIF ou WebP. Máximo 5MB"
        />
        {logoUrl && <p className="text-xs text-green-600 mt-2">✓ Logo enviado</p>}
      </div>

      {/* Favicon */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Favicon</h3>
        <ImageUpload
          onUpload={handleFaviconUpload}
          currentImage={faviconUrl}
          folder="logos"
          label="Favicon"
          hint="JPG, PNG, GIF ou WebP. Máximo 5MB. Recomendado: 32x32px"
        />
        {faviconUrl && <p className="text-xs text-green-600 mt-2">✓ Favicon enviado</p>}
      </div>

      {/* Cores */}
      <div className="border-t border-gray-200 pt-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor Primária
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={formData.primaryColor}
              onChange={(e) =>
                setFormData({ ...formData, primaryColor: e.target.value })
              }
              className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={formData.primaryColor}
              onChange={(e) =>
                setFormData({ ...formData, primaryColor: e.target.value })
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor Secundária
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={formData.secondaryColor}
              onChange={(e) =>
                setFormData({ ...formData, secondaryColor: e.target.value })
              }
              className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={formData.secondaryColor}
              onChange={(e) =>
                setFormData({ ...formData, secondaryColor: e.target.value })
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        </div>
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

      <div className="border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading
            ? 'Salvando...'
            : whiteLabelId
            ? 'Atualizar White Label'
            : 'Criar White Label'}
        </button>
      </div>
    </form>
  );
}

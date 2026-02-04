'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import Image from 'next/image';
import { uploadsApi } from '@/lib/api';

interface ImageUploadProps {
  label?: string;
  onUploadSuccess: (url: string, publicId: string) => void;
  onUploadError?: (error: string) => void;
  folder?: 'products' | 'categories' | 'logos' | 'covers' | 'misc';
  maxSizeMB?: number;
  initialImage?: string;
  restaurantId: string;
  disabled?: boolean;
}

export default function ImageUpload({
  label = 'Upload de Imagem',
  onUploadSuccess,
  onUploadError,
  folder = 'misc',
  maxSizeMB = 5,
  initialImage,
  restaurantId,
  disabled = false
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Validations
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Por favor, selecione um arquivo de imagem válido';
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      const errorMsg = `O arquivo não pode ser maior que ${maxSizeMB}MB`;
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setLoading(true);
    setError(null);

    try {
      const response = await uploadsApi.uploadImage(file, restaurantId, folder);

      if (response.error) {
        setError(response.error);
        onUploadError?.(response.error);
        setLoading(false);
        return;
      }

      if (response.data) {
        onUploadSuccess(response.data.url, response.data.publicId);
        setError(null);
      }
    } catch (err) {
      const errorMsg = 'Erro ao fazer upload da imagem';
      setError(errorMsg);
      onUploadError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (fileInputRef.current) {
        // Create a new DataTransfer to set the files
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`relative w-full border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          disabled
            ? 'bg-gray-50 border-gray-300 cursor-not-allowed'
            : 'bg-blue-50 border-blue-300 hover:border-blue-400 cursor-pointer'
        }`}
        onClick={() => !disabled && !loading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || loading}
          className="hidden"
        />

        {preview ? (
          <div className="relative w-full max-w-sm mx-auto">
            <div className="relative w-full aspect-square">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="rounded-lg object-contain"
                sizes="(max-width: 640px) 100vw, 400px"
              />
            </div>
            {!disabled && !loading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ) : (
          <div className="py-4">
            {loading ? (
              <>
                <Loader size={32} className="mx-auto text-blue-500 animate-spin mb-2" />
                <p className="text-sm text-gray-600">Fazendo upload...</p>
              </>
            ) : (
              <>
                <Upload size={32} className="mx-auto text-blue-500 mb-2" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Arraste ou clique para fazer upload
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF ou WebP até {maxSizeMB}MB
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}

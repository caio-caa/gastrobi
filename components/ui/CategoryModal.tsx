'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import ImageUpload from './ImageUpload';
import Button from './Button';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  restaurantId: string;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  restaurantId
}: CategoryModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [image, setImage] = useState(initialData?.image || '');
  const [order, setOrder] = useState(initialData?.order || 1);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Por favor, preencha o nome da categoria');
      return;
    }

    setLoading(true);
    try {
      onSubmit({
        name,
        description,
        image,
        order,
        isActive
      });
      
      // Reset form
      setName('');
      setDescription('');
      setImage('');
      setOrder(1);
      setIsActive(true);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string, publicId: string) => {
    setImage(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Categoria' : 'Nova Categoria'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Categoria
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Bebidas"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descrição da categoria (opcional)"
            rows={3}
            disabled={loading}
          />
        </div>

        <div>
          <ImageUpload
            label="Imagem da Categoria"
            folder="categories"
            onUploadSuccess={handleImageUpload}
            restaurantId={restaurantId}
            initialImage={image}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordem
          </label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            disabled={loading}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            disabled={loading}
            className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Categoria ativa
          </label>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
          >
            {loading ? 'Salvando...' : 'Salvar Categoria'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

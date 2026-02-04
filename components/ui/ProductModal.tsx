'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import ImageUpload from './ImageUpload';
import Button from './Button';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  categories: any[];
  initialData?: any;
  restaurantId: string;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialData,
  restaurantId
}: ProductModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [image, setImage] = useState(initialData?.image || '');
  const [price, setPrice] = useState(initialData?.price || 0);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isAvailable, setIsAvailable] = useState(initialData?.isAvailable ?? true);
  const [order, setOrder] = useState(initialData?.order || 1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Por favor, preencha o nome do produto');
      return;
    }

    if (!categoryId) {
      alert('Por favor, selecione uma categoria');
      return;
    }

    if (price <= 0) {
      alert('Por favor, preencha o preço do produto');
      return;
    }

    setLoading(true);
    try {
      onSubmit({
        name,
        description,
        image,
        price: parseFloat(price.toString()),
        categoryId,
        isActive,
        isAvailable,
        order
      });
      
      // Reset form
      setName('');
      setDescription('');
      setImage('');
      setPrice(0);
      setCategoryId('');
      setIsActive(true);
      setIsAvailable(true);
      setOrder(1);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string, publicId: string) => {
    setImage(url);
  };

  const selectedCategory = categories.find(c => c.id === categoryId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar Produto' : 'Novo Produto'} size="lg">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Coca-Cola 350ml"
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
            placeholder="Descrição do produto (opcional)"
            rows={3}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço (R$)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0,00"
            step="0.01"
            min="0"
            disabled={loading}
          />
        </div>

        <div>
          <ImageUpload
            label="Imagem do Produto"
            folder="products"
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

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Produto ativo
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Produto disponível
            </label>
          </div>
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
            disabled={loading || !name.trim() || !categoryId || price <= 0}
          >
            {loading ? 'Salvando...' : 'Salvar Produto'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

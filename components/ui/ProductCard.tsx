'use client';

import React from 'react';
import Image from 'next/image';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Button from './Button';

interface ProductCardProps {
  product: any;
  onEdit: (product: any) => void;
  onDelete: (productId: string) => void;
  onToggleVisibility: (productId: string) => void;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onToggleVisibility,
  viewMode = 'grid'
}: ProductCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
        {product.image && (
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              sizes="80px"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
          )}
          <p className="text-lg font-semibold text-blue-600 mt-1">
            {formatCurrency(product.price)}
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onToggleVisibility(product.id)}
            className={`p-2 rounded-lg transition-colors ${
              product.isActive
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={product.isActive ? 'Ocultar' : 'Mostrar'}
          >
            {product.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(product)}
            icon={Edit}
          >
            Editar
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              if (confirm('Tem certeza que deseja deletar este produto?')) {
                onDelete(product.id);
              }
            }}
            icon={Trash2}
            className="text-red-600 hover:text-red-700"
          >
            Deletar
          </Button>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative w-full aspect-square bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">Sem imagem</span>
          </div>
        )}

        {!product.isActive && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium">Oculto</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        
        {product.description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
        )}

        <p className="text-lg font-semibold text-blue-600 mb-4">
          {formatCurrency(product.price)}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => onToggleVisibility(product.id)}
            className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium ${
              product.isActive
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={product.isActive ? 'Ocultar' : 'Mostrar'}
          >
            {product.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          <button
            onClick={() => onEdit(product)}
            className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Edit size={16} />
            Editar
          </button>

          <button
            onClick={() => {
              if (confirm('Tem certeza que deseja deletar este produto?')) {
                onDelete(product.id);
              }
            }}
            className="flex-1 py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Trash2 size={16} />
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}

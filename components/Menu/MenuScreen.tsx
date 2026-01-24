'use client';

import React from 'react';
import { ArrowLeft, ChefHat, Gift, ShoppingCart, Search, Percent, Sparkles, Clock, Plus } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  categoryId: string;
  isBestSeller?: boolean;
  isPromotion?: boolean;
  isNew?: boolean;
  preparationTime: number;
}

interface MenuScreenProps {
  searchTerm: string;
  selectedCategory: string;
  categories: Category[];
  filteredProducts: Product[];
  cartItemsCount: number;
  cartTotal: number;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onBack: () => void;
  onShowCart: () => void;
  onShowLoyalty: () => void;
  onAddToCart: (product: Product) => void;
  formatCurrency: (value: number) => string;
}

export default function MenuScreen({
  searchTerm,
  selectedCategory,
  categories,
  filteredProducts,
  cartItemsCount,
  cartTotal,
  onSearchChange,
  onCategoryChange,
  onBack,
  onShowCart,
  onShowLoyalty,
  onAddToCart,
  formatCurrency,
}: MenuScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={onBack}>
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-2">
                <ChefHat className="w-6 h-6" />
                <div>
                  <h1 className="font-bold">Cardápio Digital</h1>
                  <p className="text-xs opacity-90">Confira nossos produtos</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onShowLoyalty}
                className="p-2 bg-white/20 rounded-full"
              >
                <Gift className="w-5 h-5" />
              </button>
              <button
                onClick={onShowCart}
                className="relative p-2 bg-white/20 rounded-full"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-4 text-white text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Aberto</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-200">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Percent className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-green-900">Cupons</p>
              <p className="text-xs text-green-700">Veja os descontos</p>
            </div>
          </button>
          <button 
            onClick={onShowLoyalty}
            className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-200"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-blue-900">Fidelidade</p>
              <p className="text-xs text-blue-700">Veja seus pontos</p>
            </div>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-4 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar produto"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pb-4 bg-white">
        <div className="flex space-x-3 overflow-x-auto">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
              selectedCategory === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Todos
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 space-y-4">
        {/* Produtos em Destaque */}
        {filteredProducts.filter(p => p.isBestSeller).length > 0 && (
          <div className="bg-white rounded-2xl p-4 border-2 border-green-200">
            <h3 className="font-bold text-green-900 mb-3 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Mais Vendidos
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.filter(p => p.isBestSeller).slice(0, 4).map(product => (
                <div key={product.id} className="relative">
                  <div className="aspect-square rounded-xl overflow-hidden mb-2">
                    <img 
                      src={product.image || 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <p className="text-green-600 font-bold">{formatCurrency(product.price)}</p>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="absolute top-2 right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Produtos por Categoria */}
        {categories.map(category => {
          const categoryProducts = filteredProducts.filter(p => p.categoryId === category.id);
          if (categoryProducts.length === 0) return null;

          return (
            <div key={category.id} className="bg-white rounded-2xl p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <ChefHat className="w-5 h-5 mr-2" />
                {category.name}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {categoryProducts.map(product => (
                  <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="relative aspect-square">
                      <img 
                        src={product.image || 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.isPromotion && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Promoção
                        </div>
                      )}
                      {product.isNew && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Novo
                        </div>
                      )}
                      <button
                        onClick={() => onAddToCart(product)}
                        className="absolute bottom-2 right-2 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.isPromotion && product.originalPrice ? (
                            <div>
                              <span className="text-lg font-bold text-green-600">
                                {formatCurrency(product.price)}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-1">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {product.preparationTime}min
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Tente buscar por outro termo ou categoria</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <button
            onClick={onShowCart}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>{cartItemsCount} {cartItemsCount === 1 ? 'item' : 'itens'}</span>
            </div>
            <span className="font-bold">{formatCurrency(cartTotal)}</span>
          </button>
        </div>
      )}
    </div>
  );
}

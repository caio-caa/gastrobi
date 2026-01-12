'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChefHat, 
  Search, 
  MapPin, 
  Star, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';

// Restaurantes de exemplo (em produção viria da API)
const restaurants = [
  {
    id: '1',
    slug: 'restaurante-do-joao',
    name: 'Restaurante do João',
    description: 'Comida caseira com sabor de vó',
    image: '/restaurant-1.jpg',
    rating: 4.8,
    reviews: 245,
    cuisine: 'Brasileira',
    deliveryTime: '30-45 min',
    isOpen: true,
  },
  {
    id: '2',
    slug: 'pizzaria-express',
    name: 'Pizzaria Express',
    description: 'As melhores pizzas da cidade',
    image: '/restaurant-2.jpg',
    rating: 4.5,
    reviews: 189,
    cuisine: 'Italiana',
    deliveryTime: '40-55 min',
    isOpen: true,
  },
  {
    id: '3',
    slug: 'sushi-house',
    name: 'Sushi House',
    description: 'Sushi fresco feito na hora',
    image: '/restaurant-3.jpg',
    rating: 4.9,
    reviews: 312,
    cuisine: 'Japonesa',
    deliveryTime: '35-50 min',
    isOpen: false,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { config } = useWhiteLabel();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestaurantClick = (slug: string) => {
    router.push(`/menu/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-2">
            <ChefHat 
              className="w-8 h-8" 
              style={{ color: config.primaryColor }}
            />
            <span className="text-xl font-bold text-gray-900">
              {config.brandName}
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="py-12 px-4"
        style={{ 
          background: `linear-gradient(135deg, ${config.primaryColor}15 0%, ${config.secondaryColor}15 100%)` 
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Peça sua comida favorita
          </h1>
          <p className="text-gray-600 mb-8">
            Escolha um restaurante e faça seu pedido
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar restaurantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Restaurants List */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Restaurantes disponíveis
          </h2>

          <div className="space-y-4">
            {filteredRestaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => handleRestaurantClick(restaurant.slug)}
                disabled={!restaurant.isOpen}
                className={`w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4 transition-all ${
                  restaurant.isOpen 
                    ? 'hover:shadow-md hover:border-gray-200 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Restaurant Image */}
                <div 
                  className="w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: `${config.primaryColor}20` }}
                >
                  <ChefHat 
                    className="w-10 h-10" 
                    style={{ color: config.primaryColor }}
                  />
                </div>

                {/* Restaurant Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">
                      {restaurant.name}
                    </h3>
                    {!restaurant.isOpen && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        Fechado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {restaurant.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span>{restaurant.rating}</span>
                      <span>({restaurant.reviews})</span>
                    </span>
                    <span>{restaurant.cuisine}</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{restaurant.deliveryTime}</span>
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                {restaurant.isOpen && (
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
            ))}
          </div>

          {filteredRestaurants.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum restaurante encontrado</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            Powered by <span className="font-semibold">{config.brandName}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

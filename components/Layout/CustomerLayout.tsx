'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Home, ArrowLeft } from 'lucide-react';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';

interface CustomerLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  showCart?: boolean;
  cartItemsCount?: number;
  onCartClick?: () => void;
  onBackClick?: () => void;
  restaurantName?: string;
  restaurantLogo?: string;
}

function CustomerLayout({ 
  children, 
  showBackButton = false,
  showCart = true,
  cartItemsCount = 0,
  onCartClick,
  onBackClick,
  restaurantName,
  restaurantLogo
}: CustomerLayoutProps) {
  const { config } = useWhiteLabel();

  const displayName = restaurantName || config.brandName;
  const displayLogo = restaurantLogo || config.logo;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Simples - Sem Sidebar */}
      <header 
        className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100"
      >
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          {/* Lado Esquerdo - Logo ou Voltar */}
          <div className="flex items-center space-x-3">
            {showBackButton ? (
              <button 
                onClick={onBackClick}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            ) : (
              <Link href="/" className="flex items-center space-x-2">
                {displayLogo ? (
                  <img 
                    src={displayLogo} 
                    alt={displayName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-gray-900 text-lg">
                  {displayName}
                </span>
              </Link>
            )}
          </div>

          {/* Lado Direito - Carrinho */}
          {showCart && (
            <button 
              onClick={onCartClick}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartItemsCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold text-white rounded-full"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer Simples */}
      <footer className="bg-white border-t border-gray-100 py-4">
        <div className="max-w-lg mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            Powered by <span className="font-semibold">GastroBI</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default CustomerLayout;

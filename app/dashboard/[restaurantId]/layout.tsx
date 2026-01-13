'use client';

import React, { useState } from 'react';
import { ChefHat, BarChart3, ShoppingCart, Users, Heart, Megaphone, Grid, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from '@/components/Layout/Header';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { label: 'Dashboard', href: 'overview', icon: BarChart3 },
  { label: 'Menu', href: 'menu', icon: Grid },
  { label: 'Pedidos', href: 'orders', icon: ShoppingCart },
  { label: 'Mesas', href: 'tables', icon: ChefHat },
  { label: 'Clientes', href: 'customers', icon: Users },
  { label: 'Fidelidade', href: 'loyalty', icon: Heart },
  { label: 'Campanhas', href: 'campaigns', icon: Megaphone },
];

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { restaurantId: string };
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname.includes(`/dashboard/${params.restaurantId}/${href}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">GastroBI+</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={`/dashboard/${params.restaurantId}/${item.href}`}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

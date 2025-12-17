'use client';

import React, { useState } from 'react';
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  Building2,
  AlertTriangle,
  Info,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  const { user, logout, switchRestaurant } = useAuth();
  const { alerts, markAlertAsRead } = useData();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRestaurantMenu, setShowRestaurantMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadAlerts = alerts.filter((a) => !a.isRead);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'info':
        return Info;
      case 'success':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'success':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const handleAlertClick = (alert: {
    id: string;
    actionUrl?: string;
  }) => {
    markAlertAsRead(alert.id);
    if (alert.actionUrl && typeof window !== 'undefined') {
      window.location.href = alert.actionUrl;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 relative z-40">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center min-w-0 flex-1">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="ml-2 lg:ml-0 min-w-0 flex-1">
            <h1 className="text-base lg:text-lg font-semibold text-gray-900 truncate">
              {user?.currentRestaurant.name}
            </h1>
            <div className="flex items-center space-x-2">
              <p className="text-xs lg:text-sm text-gray-500 capitalize">
                Plano {user?.currentRestaurant.plan}
              </p>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user?.currentRestaurant.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : user?.currentRestaurant.status === 'trial'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {user?.currentRestaurant.status === 'active'
                  ? 'Ativo'
                  : user?.currentRestaurant.status === 'trial'
                  ? 'Trial'
                  : 'Suspenso'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Seletor de Restaurante - Hidden on mobile */}
          {user && user.restaurants.length > 1 && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowRestaurantMenu(!showRestaurantMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 hidden lg:inline">
                  Trocar Restaurante
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {showRestaurantMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                  <div className="py-2">
                    {user.restaurants.map((restaurant) => (
                      <button
                        key={restaurant.id}
                        onClick={() => {
                          switchRestaurant(restaurant.id);
                          setShowRestaurantMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          restaurant.id === user.currentRestaurant.id
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700'
                        }`}
                      >
                        <div className="font-medium">{restaurant.name}</div>
                        <div className="text-xs text-gray-500 capitalize">
                          Plano {restaurant.plan} • {restaurant.status}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notificações */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 relative"
            >
              <Bell className="w-5 h-5 text-gray-500" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {unreadAlerts.length > 9 ? '9+' : unreadAlerts.length}
                  </span>
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-96 overflow-y-auto">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900">
                    Notificações
                  </h3>
                </div>

                {alerts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Nenhuma notificação</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {alerts.slice(0, 10).map((alert) => {
                      const IconComponent = getAlertIcon(alert.type);
                      return (
                        <div
                          key={alert.id}
                          onClick={() => handleAlertClick(alert)}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 ${
                            alert.isRead ? 'opacity-60' : ''
                          } ${
                            alert.type === 'warning'
                              ? 'border-yellow-400'
                              : alert.type === 'error'
                              ? 'border-red-400'
                              : alert.type === 'success'
                              ? 'border-green-400'
                              : 'border-blue-400'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`p-1 rounded-full ${getAlertColor(
                                alert.type
                              )}`}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {alert.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {alert.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {alert.createdAt.toLocaleString()}
                              </p>
                            </div>
                            {!alert.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Menu do Usuário */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 lg:space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-700 truncate max-w-32">
                  {user?.name}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-500 truncate max-w-24">
                    {user?.email}
                  </p>
                  {user?.isEmailVerified && (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  )}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden lg:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">
                      Logado como
                    </p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {user?.role === 'owner'
                        ? 'Proprietário'
                        : user?.role === 'manager'
                        ? 'Gerente'
                        : 'Funcionário'}
                    </p>
                  </div>

                  {/* Mobile Restaurant Selector */}
                  {user && user.restaurants.length > 1 && (
                    <div className="md:hidden border-b border-gray-100">
                      <div className="px-4 py-2">
                        <p className="text-xs text-gray-500 mb-2">
                          Restaurantes
                        </p>
                        {user.restaurants.map((restaurant) => (
                          <button
                            key={restaurant.id}
                            onClick={() => {
                              switchRestaurant(restaurant.id);
                              setShowUserMenu(false);
                            }}
                            className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 ${
                              restaurant.id === user.currentRestaurant.id
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700'
                            }`}
                          >
                            <div className="font-medium truncate">
                              {restaurant.name}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {restaurant.plan} • {restaurant.status}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

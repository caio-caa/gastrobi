'use client';

import React, { useState } from 'react';
import {
  Menu,
  ChevronDown,
  LogOut,
  CheckCircle,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

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
              GastroBI Admin
            </h1>
            <div className="flex items-center space-x-2">
              <Shield className="w-3 h-3 text-blue-600" />
              <p className="text-xs lg:text-sm text-gray-500">
                Painel Administrativo SaaS
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 lg:space-x-4">
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
                      {user?.role === 'super_admin'
                        ? 'Super Admin'
                        : user?.role === 'admin'
                        ? 'Administrador'
                        : user?.role}
                    </p>
                  </div>

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

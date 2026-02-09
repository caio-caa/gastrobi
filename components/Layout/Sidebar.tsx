'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Gift,
  Megaphone,
  BarChart3,
  Settings,
  X,
  Menu as MenuIcon,
  QrCode,
  Calculator,
} from 'lucide-react';
import { useAuth, isWaiterRole } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import WhiteLabelHeader from '@/components/WhiteLabel/WhiteLabelHeader';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Definição com roles permitidos por item
const allNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, adminOnly: true },
  { name: 'Clientes', href: '/customers', icon: Users, adminOnly: true },
  { name: 'Fidelidade', href: '/loyalty', icon: Gift, comingSoon: true, adminOnly: true },
  { name: 'Campanhas', href: '/campaigns', icon: Megaphone, comingSoon: true, adminOnly: true },
  { name: 'Cardápio Digital', href: '/menu', icon: MenuIcon, adminOnly: false },
  { name: 'QR Codes', href: '/qr-codes', icon: QrCode, adminOnly: false },
  { name: 'POS - Frente de Caixa', href: '/pos', icon: Calculator, adminOnly: false },
  { name: 'Relatórios', href: '/reports', icon: BarChart3, adminOnly: true },
  { name: 'Configurações', href: '/settings', icon: Settings, adminOnly: true },
];

function Sidebar({ open, setOpen }: SidebarProps) {
  const { user } = useAuth();
  const { config } = useWhiteLabel();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  // Filtra navegação baseado no role do usuário
  const isWaiter = isWaiterRole(user?.role);
  const navigation = allNavigation.filter(item => {
    if (isWaiter && item.adminOnly) return false;
    return true;
  });

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <WhiteLabelHeader />
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {/* Navegação filtrada por role */}
          {navigation.map((item) => {
            const active = isActive(item.href) && !item.comingSoon;
            // Render "coming soon" items as non-clickable with a "Brevemente" badge
            if (item.comingSoon) {
              return (
                <div
                  key={item.name}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors duration-200 ${
                    active ? 'text-white' : 'text-gray-400 cursor-not-allowed'
                  }`}
                  style={
                    active
                      ? {
                          backgroundColor: config.primaryColor,
                        }
                      : {}
                  }
                  aria-disabled="true"
                  title="Disponível em breve"
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="flex items-center gap-2">
                    {item.name}
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
                      Brevemente
                    </span>
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors duration-200 ${
                  active
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                style={
                  active
                    ? {
                        backgroundColor: config.primaryColor,
                      }
                    : {}
                }
                onClick={() => setOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;

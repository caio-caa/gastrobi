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
  Palette,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import WhiteLabelHeader from '@/components/WhiteLabel/WhiteLabelHeader';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Admin SaaS Navigation Only
const adminSaaSNavigation = [
  { name: 'Gestão de Usuários', href: '/admin/users', icon: Users },
  { name: 'White Label & Clientes', href: '/admin/white-label', icon: Palette },
  { name: 'Analytics & Métricas', href: '/admin/analytics', icon: BarChart3 },
];

function Sidebar({ open, setOpen }: SidebarProps) {
  const { user } = useAuth();
  const { config } = useWhiteLabel();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

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
          {/* Admin SaaS Navigation */}
          {adminSaaSNavigation.map((item) => {
            const active = isActive(item.href);
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

'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, canAccessRoute, DEFAULT_ROUTE_BY_ROLE } from '@/contexts/AuthContext';

// Rotas que não precisam de autenticação
const PUBLIC_ROUTES = ['/', '/login', '/menu'];

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Rotas públicas — não proteger
    const isPublic = PUBLIC_ROUTES.some(route => 
      pathname === route || pathname.startsWith('/menu/')
    );
    if (isPublic) return;

    // Não autenticado — redirecionar para login
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Autenticado mas sem permissão — redirecionar para rota padrão do role
    if (user && !canAccessRoute(user.role, pathname)) {
      const fallback = DEFAULT_ROUTE_BY_ROLE[user.role] || '/pos';
      router.replace(fallback);
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  // Enquanto carrega, não renderiza nada
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

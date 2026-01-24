'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
  ChefHat,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Package
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import Layout from '@/components/Layout/Layout';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { customers, products, dashboardData } = useData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: Recarregar dados da API
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const revenueChange = dashboardData?.revenue?.previousPeriodChange || 0;
  const ordersChange = dashboardData?.orders?.previousPeriodChange || 0;
  const customersChange = dashboardData?.customers?.previousPeriodChange || 0;
  const ticketChange = dashboardData?.averageTicket?.previousPeriodChange || 0;

  const metrics = [
    {
      title: 'Faturamento Hoje',
      value: formatCurrency(dashboardData?.revenue?.daily || 0),
      change: `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}%`,
      isPositive: revenueChange >= 0,
      icon: DollarSign,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Pedidos Hoje',
      value: dashboardData?.orders?.today?.toString() || '0',
      change: `${ordersChange >= 0 ? '+' : ''}${ordersChange.toFixed(1)}%`,
      isPositive: ordersChange >= 0,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Clientes Ativos',
      value: dashboardData?.customers?.active?.toString() || customers.filter(c => c.status === 'active').length.toString(),
      change: `${customersChange >= 0 ? '+' : ''}${customersChange.toFixed(1)}%`,
      isPositive: customersChange >= 0,
      icon: Users,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(dashboardData?.averageTicket?.value || 0),
      change: `${ticketChange >= 0 ? '+' : ''}${ticketChange.toFixed(1)}%`,
      isPositive: ticketChange >= 0,
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  const quickActions = [
    { label: 'Novo Pedido', href: '/pos', icon: ShoppingBag, color: 'bg-blue-600' },
    { label: 'Cardápio', href: '/menu', icon: Package, color: 'bg-green-600' },
    { label: 'Cozinha', href: '/pos', icon: ChefHat, color: 'bg-red-600' },
    { label: 'Clientes', href: '/customers', icon: Users, color: 'bg-purple-600' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Olá, {user?.fullName?.split(' ')[0] || 'Usuário'}! 👋
            </h1>
            <p className="text-gray-600">
              {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
          <Button
            icon={RefreshCw}
            variant="outline"
            onClick={handleRefresh}
            className={isRefreshing ? 'animate-spin' : ''}
          >
            Atualizar
          </Button>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      {metric.isPositive ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change} vs ontem
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => router.push(action.href)}
                  className="flex flex-col items-center p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className={`${action.color} p-3 rounded-lg mb-2`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de Informações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pedidos Recentes */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h2>
              <button
                onClick={() => router.push('/pos')}
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                Ver todos →
              </button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Pedido #{1000 + i}</p>
                      <p className="text-sm text-gray-500">Mesa {i} • há {i * 5} min</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(50 + i * 15)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      i <= 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {i <= 2 ? 'Preparando' : 'Pronto'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Produtos Mais Vendidos */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Produtos Populares</h2>
              <button
                onClick={() => router.push('/menu')}
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                Ver cardápio →
              </button>
            </div>
            <div className="space-y-4">
              {(products.slice(0, 5) || []).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                    <div className="flex items-center justify-end space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500">{product.popularity || 0} vendas</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

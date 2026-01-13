'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, ShoppingCart, Users, Heart } from 'lucide-react';
import { ordersApi, customersApi, loyaltyApi } from '@/lib/api';

interface DashboardMetric {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export default function DashboardPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        
        // Fetch data from APIs
        const [ordersResponse, customersResponse] = await Promise.all([
          ordersApi.list(params.restaurantId),
          customersApi.list(params.restaurantId),
        ]);

        // Calculate metrics
        const orders = ordersResponse.data || [];
        const customers = customersResponse.data || [];

        const totalRevenue = orders
          .filter((o: any) => o.status === 'completed')
          .reduce((sum: number, o: any) => sum + (o.total || 0), 0);

        const totalOrders = orders.length;
        const totalCustomers = customers.length;

        setMetrics([
          {
            label: 'Receita Total',
            value: `R$ ${totalRevenue.toFixed(2)}`,
            icon: <TrendingUp className="w-6 h-6 text-green-600" />,
            trend: { value: 12, direction: 'up' },
          },
          {
            label: 'Pedidos (30 dias)',
            value: totalOrders,
            icon: <ShoppingCart className="w-6 h-6 text-blue-600" />,
            trend: { value: 8, direction: 'up' },
          },
          {
            label: 'Clientes',
            value: totalCustomers,
            icon: <Users className="w-6 h-6 text-purple-600" />,
            trend: { value: 5, direction: 'up' },
          },
          {
            label: 'Programa de Fidelidade',
            value: '2.5k',
            icon: <Heart className="w-6 h-6 text-red-600" />,
          },
        ]);

        setError('');
      } catch (err) {
        setError('Erro ao carregar métricas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [params.restaurantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bem-vindo ao seu painel de controle</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                {metric.trend && (
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm font-medium ${
                        metric.trend.direction === 'up'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {metric.trend.direction === 'up' ? '+' : '-'}
                      {metric.trend.value}%
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">{metric.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-sm p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Bem-vindo ao GastroBI+!</h2>
        <p className="text-blue-100 mb-4">
          Seu sistema de gestão de restaurante está pronto para usar. Comece a gerenciar seu menu,
          pedidos, clientes e muito mais.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">📋 Menu</h3>
            <p className="text-sm text-blue-100">Gerencie suas categorias e produtos</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">🛒 Pedidos</h3>
            <p className="text-sm text-blue-100">Acompanhe seus pedidos em tempo real</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">❤️ Fidelidade</h3>
            <p className="text-sm text-blue-100">Crie campanhas de fidelização</p>
          </div>
        </div>
      </div>
    </div>
  );
}

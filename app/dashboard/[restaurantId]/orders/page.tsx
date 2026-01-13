'use client';

import React, { useEffect, useState } from 'react';
import { ordersApi } from '@/lib/api';
import { Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  number: string;
  status: string;
  total: number;
  createdAt: string;
  items: any[];
  type?: string;
}

export default function OrdersPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersApi.list(params.restaurantId, {
          status: filter === 'all' ? undefined : filter,
        });
        setOrders(response.data || []);
      } catch (err) {
        setError('Erro ao carregar pedidos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [params.restaurantId, filter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: 'Concluído',
      pending: 'Pendente',
      preparing: 'Em Preparação',
      ready: 'Pronto',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600 mt-2">Acompanhe e gerencie seus pedidos</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2">
        {['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status === 'all' ? 'Todos' : getStatusLabel(status)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Itens
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">
                        #{order.number}
                      </span>
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.type || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {(order.items || []).length} item(ns)
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-gray-900">
                        R$ {order.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

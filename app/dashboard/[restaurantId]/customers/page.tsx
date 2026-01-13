'use client';

import React, { useEffect, useState } from 'react';
import { customersApi } from '@/lib/api';
import { Mail, Phone, Star, Edit2, Eye } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  loyaltyPoints?: number;
  loyaltyLevel?: string;
  totalSpent?: number;
  createdAt: string;
}

export default function CustomersPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const response = await customersApi.list(params.restaurantId, {
          search: search || undefined,
        });
        setCustomers(response.data || []);
      } catch (err) {
        setError('Erro ao carregar clientes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadCustomers();
    }, 300);

    return () => clearTimeout(timer);
  }, [params.restaurantId, search]);

  const getLoyaltyColor = (level?: string) => {
    const colors: Record<string, string> = {
      gold: 'bg-yellow-100 text-yellow-800',
      silver: 'bg-gray-100 text-gray-800',
      bronze: 'bg-orange-100 text-orange-800',
    };
    return colors[level?.toLowerCase() || ''] || 'bg-blue-100 text-blue-800';
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
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <p className="text-gray-600 mt-2">Gerencie seus clientes e programa de fidelidade</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nome, email ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p>Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Nível
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Pontos
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Gasto Total
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">
                          Desde {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {customer.email && (
                          <div className="flex items-center space-x-2 text-sm text-gray-700">
                            <Mail className="w-4 h-4" />
                            <span>{customer.email}</span>
                          </div>
                        )}
                        {customer.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-700">
                            <Phone className="w-4 h-4" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.loyaltyLevel && (
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getLoyaltyColor(
                            customer.loyaltyLevel
                          )}`}
                        >
                          <Star className="w-3 h-3" />
                          <span>{customer.loyaltyLevel}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {customer.loyaltyPoints || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">
                        R$ {(customer.totalSpent || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2 flex justify-center">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-gray-500" />
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

'use client';

import React, { useEffect, useState } from 'react';
import { tablesApi } from '@/lib/api';
import { Plus, Edit2, Eye, QrCode } from 'lucide-react';

interface Table {
  id: string;
  number: number;
  seats: number;
  status: string;
  location?: string;
  qrCodeUrl?: string;
}

export default function TablesPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTables = async () => {
      try {
        setLoading(true);
        const response = await tablesApi.list(params.restaurantId);
        setTables(response.data || []);
      } catch (err) {
        setError('Erro ao carregar mesas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTables();
  }, [params.restaurantId]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      reserved: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      available: 'Disponível',
      occupied: 'Ocupada',
      reserved: 'Reservada',
    };
    return labels[status] || status;
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mesas</h1>
          <p className="text-gray-600 mt-2">Gerencie as mesas do seu restaurante</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          <span>Nova Mesa</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Tables Grid */}
      {tables.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">Nenhuma mesa cadastrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Mesa {table.number}
                  </h3>
                  <p className="text-sm text-gray-600">{table.seats} lugares</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    table.status
                  )}`}
                >
                  {getStatusLabel(table.status)}
                </span>
              </div>

              {table.location && (
                <p className="text-sm text-gray-700 mb-4">
                  <span className="font-medium">Local:</span> {table.location}
                </p>
              )}

              <div className="flex items-center space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">Visualizar</span>
                </button>
                <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <QrCode className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

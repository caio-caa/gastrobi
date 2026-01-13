'use client';

import React, { useEffect, useState } from 'react';
import { campaignsApi } from '@/lib/api';
import { Plus, Edit2, Trash2, Send, Pause } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: string;
  channel?: string;
  scheduledAt?: string;
  createdAt: string;
}

export default function CampaignsPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        const response = await campaignsApi.list(params.restaurantId);
        setCampaigns(response.data || []);
      } catch (err) {
        setError('Erro ao carregar campanhas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [params.restaurantId]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Rascunho',
      scheduled: 'Agendada',
      active: 'Ativa',
      paused: 'Pausada',
      completed: 'Concluída',
    };
    return labels[status] || status;
  };

  const getChannelLabel = (channel?: string) => {
    const labels: Record<string, string> = {
      email: 'E-mail',
      sms: 'SMS',
      whatsapp: 'WhatsApp',
      push: 'Push',
    };
    return labels[channel || ''] || 'Múltiplos';
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
          <h1 className="text-3xl font-bold text-gray-900">Campanhas</h1>
          <p className="text-gray-600 mt-2">Crie e gerencie suas campanhas de marketing</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          <span>Nova Campanha</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {campaigns.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <Send className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="mb-4">Nenhuma campanha criada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Canal
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Data de Criação
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{campaign.name}</p>
                        {campaign.description && (
                          <p className="text-sm text-gray-600 truncate">
                            {campaign.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {getChannelLabel(campaign.channel)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {getStatusLabel(campaign.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2 flex justify-center">
                      {campaign.status === 'active' && (
                        <button className="p-2 hover:bg-yellow-50 rounded-lg transition-colors">
                          <Pause className="w-4 h-4 text-yellow-600" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
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

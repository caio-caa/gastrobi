'use client';

import React, { useEffect, useState } from 'react';
import { loyaltyApi } from '@/lib/api';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';

interface LoyaltyRule {
  id: string;
  name: string;
  description?: string;
  pointsPerReal?: number;
  minimumSpend?: number;
}

interface LoyaltyReward {
  id: string;
  name: string;
  description?: string;
  pointsCost: number;
  value?: number;
}

export default function LoyaltyPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  const [rules, setRules] = useState<LoyaltyRule[]>([]);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('rules');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [rulesRes, rewardsRes] = await Promise.all([
          loyaltyApi.listRules(params.restaurantId),
          loyaltyApi.listRewards(params.restaurantId),
        ]);

        setRules(rulesRes.data || []);
        setRewards(rewardsRes.data || []);
      } catch (err) {
        setError('Erro ao carregar programa de fidelidade');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programa de Fidelidade</h1>
          <p className="text-gray-600 mt-2">Gerencie as regras e prêmios de fidelidade</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          <span>Novo Item</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'rules'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-700 hover:text-gray-900'
            }`}
          >
            Regras ({rules.length})
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'rewards'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-700 hover:text-gray-900'
            }`}
          >
            Prêmios ({rewards.length})
          </button>
        </div>
      </div>

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          {rules.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Star className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600 mb-4">Nenhuma regra configurada</p>
            </div>
          ) : (
            rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{rule.name}</h3>
                    {rule.description && (
                      <p className="text-gray-600 mt-1">{rule.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-700">
                      {rule.pointsPerReal && (
                        <span>
                          <strong>{rule.pointsPerReal}</strong> pontos por real
                        </span>
                      )}
                      {rule.minimumSpend && (
                        <span>
                          Mínimo: <strong>R$ {rule.minimumSpend.toFixed(2)}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Star className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">Nenhum prêmio configurado</p>
            </div>
          ) : (
            rewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h3 className="font-bold text-gray-900 mb-2">{reward.name}</h3>
                {reward.description && (
                  <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-lg font-bold text-blue-600">
                    {reward.pointsCost} pts
                  </span>
                  {reward.value && (
                    <span className="text-sm font-medium text-gray-700">
                      Vale: R$ {reward.value.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

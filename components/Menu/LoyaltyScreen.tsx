'use client';

import React from 'react';
import { ArrowLeft, Gift, User, Trophy, Award, Star, Percent, Heart } from 'lucide-react';

interface CustomerData {
  name: string;
  phone: string;
  points: number;
  level: 'bronze' | 'silver' | 'gold';
  orders: number;
}

interface LoyaltyScreenProps {
  customerData: CustomerData | null;
  rewards: Array<{
    id: string;
    icon: React.ReactNode;
    bgColor: string;
    title: string;
    description: string;
    status: 'available' | 'progress' | 'locked';
    progress?: number;
    target?: number;
    action?: () => void;
  }>;
  onBack: () => void;
}

export default function LoyaltyScreen({ customerData, rewards, onBack }: LoyaltyScreenProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'silver': return 'from-gray-300 to-gray-500';
      default: return 'from-orange-400 to-orange-600';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'gold': return Trophy;
      case 'silver': return Award;
      default: return Star;
    }
  };

  const getPointsToNextLevel = () => {
    if (!customerData) return 0;
    const thresholds: Record<string, number> = { bronze: 0, silver: 100, gold: 300 };
    if (customerData.level === 'gold') return 0;
    const nextLevel = customerData.level === 'bronze' ? 'silver' : 'gold';
    return thresholds[nextLevel] - customerData.points;
  };

  if (!customerData) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
          <div className="flex items-center space-x-3">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">Programa de Fidelidade</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <Gift className="w-12 h-12 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Participe do Programa</h2>
          <p className="text-gray-600 text-center mb-6">
            Acumule pontos, ganhe recompensas e tenha benefícios exclusivos!
          </p>
          <div className="space-y-3 w-full max-w-sm">
            <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold">
              Entrar com WhatsApp
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold">
              Criar conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  const LevelIcon = getLevelIcon(customerData.level);
  const pointsToNext = getPointsToNextLevel();

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Programa de Fidelidade</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Customer Info */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 pb-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold mb-1">{customerData.name}</h2>
            <p className="opacity-90">{customerData.phone}</p>
          </div>
        </div>

        {/* Points Card */}
        <div className="px-4 -mt-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 bg-gradient-to-r ${getLevelColor(customerData.level)} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <LevelIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 capitalize">{customerData.level}</h3>
              <p className="text-gray-600">Nível atual</p>
            </div>

            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-purple-600 mb-2">{customerData.points}</p>
              <p className="text-gray-600">pontos acumulados</p>
            </div>

            {pointsToNext > 0 && (
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-purple-900 font-medium">
                  Faltam apenas <span className="font-bold">{pointsToNext} pontos</span> para o próximo nível!
                </p>
                <div className="w-full bg-purple-200 rounded-full h-2 mt-3">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(customerData.points / (customerData.points + pointsToNext)) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rewards */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Suas Recompensas</h3>
          <div className="space-y-3">
            {rewards.map((reward) => (
              <div key={reward.id} className={`border rounded-xl p-4 ${reward.bgColor}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center`}>
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{reward.title}</h4>
                    <p className="text-sm">{reward.description}</p>
                  </div>
                  {reward.status === 'available' && (
                    <button 
                      onClick={reward.action}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Usar
                    </button>
                  )}
                  {reward.status === 'progress' && reward.progress !== undefined && reward.target !== undefined && (
                    <div className="text-right">
                      <p className="text-sm">{reward.progress}/{reward.target}</p>
                      <div className="w-16 rounded-full h-1 mt-1">
                        <div 
                          className="h-1 rounded-full"
                          style={{ width: `${(reward.progress / reward.target) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {reward.status === 'locked' && (
                    <span className="text-sm font-medium">Em breve</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Como Funciona</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <p className="text-gray-700">Faça pedidos e acumule pontos automaticamente</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <p className="text-gray-700">Troque pontos por recompensas incríveis</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <p className="text-gray-700">Suba de nível e desbloqueie benefícios exclusivos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-4 border-t bg-white">
        <button
          onClick={onBack}
          className="w-full bg-purple-600 text-white py-4 rounded-2xl font-semibold text-lg"
        >
          Voltar ao Cardápio
        </button>
      </div>
    </div>
  );
}

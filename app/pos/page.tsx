'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Truck,
  Users,
  ChefHat,
  Store,
} from 'lucide-react';
import { usePOS } from '@/contexts/POSContext';
import Layout from '@/components/Layout/Layout';
import BalcaoModule from '@/components/POS/BalcaoModule';
import DeliveryModule from '@/components/POS/DeliveryModule';
import MesaModule from '@/components/POS/MesaModule';
import KitchenModule from '@/components/POS/KitchenModule';

export default function POSPage() {
  const [activeModule, setActiveModule] = useState<
    'balcao' | 'delivery' | 'mesa' | 'kitchen'
  >('balcao');
  const { orders, getKitchenOrders } = usePOS();

  const modules = [
    {
      id: 'balcao' as const,
      name: 'Balcão',
      icon: Store,
      description: 'Pedidos rápidos no caixa',
      color: 'bg-blue-500',
    },
    {
      id: 'delivery' as const,
      name: 'Delivery',
      icon: Truck,
      description: 'Pedidos para entrega',
      color: 'bg-green-500',
    },
    {
      id: 'mesa' as const,
      name: 'Mesa',
      icon: Users,
      description: 'Atendimento de mesas',
      color: 'bg-purple-500',
    },
    {
      id: 'kitchen' as const,
      name: 'Cozinha',
      icon: ChefHat,
      description: 'Pedidos em preparo',
      color: 'bg-red-500',
    },
  ];

  const getModuleStats = (moduleId: string) => {
    switch (moduleId) {
      case 'balcao':
        return orders.filter(
          (o) => o.type === 'balcao' && o.status !== 'completed'
        ).length;
      case 'delivery':
        return orders.filter(
          (o) => o.type === 'delivery' && o.status !== 'completed'
        ).length;
      case 'mesa':
        return orders.filter(
          (o) => o.type === 'mesa' && o.status !== 'completed'
        ).length;
      case 'kitchen':
        return getKitchenOrders().filter((item) => item.status === 'preparing')
          .length;
      default:
        return 0;
    }
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'balcao':
        return <BalcaoModule />;
      case 'delivery':
        return <DeliveryModule />;
      case 'mesa':
        return <MesaModule />;
      case 'kitchen':
        return <KitchenModule />;
      default:
        return <BalcaoModule />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header com seleção de módulos */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="px-4 py-3">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Sistema POS - Frente de Caixa
            </h1>

            <div className="flex flex-wrap gap-3">
              {modules.map((module) => {
                const Icon = module.icon;
                const stats = getModuleStats(module.id);

                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-2 transition-all ${
                      activeModule === module.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-100 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 ${module.color} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {module.name}
                        </span>
                        {stats > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {stats}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {module.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Área do módulo ativo */}
        <div className="p-4">{renderModule()}</div>
      </div>
    </Layout>
  );
}

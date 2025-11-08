import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Truck, 
  Users, 
  ClipboardList,
  ChefHat,
  Calculator,
  Smartphone,
  Store
} from 'lucide-react';
import { usePOS } from '../contexts/POSContext';
import BalcaoModule from '../components/POS/BalcaoModule';
import DeliveryModule from '../components/POS/DeliveryModule';
import MesaModule from '../components/POS/MesaModule';
import ComandaModule from '../components/POS/ComandaModule';
import KitchenModule from '../components/POS/KitchenModule';

function POS() {
  const [activeModule, setActiveModule] = useState<'balcao' | 'delivery' | 'mesa' | 'comanda' | 'kitchen'>('balcao');
  const { orders, getKitchenOrders } = usePOS();

  const modules = [
    {
      id: 'balcao' as const,
      name: 'Balcão',
      icon: Store,
      description: 'Pedidos rápidos no caixa',
      color: 'bg-blue-500'
    },
    {
      id: 'delivery' as const,
      name: 'Delivery',
      icon: Truck,
      description: 'Pedidos para entrega',
      color: 'bg-green-500'
    },
    {
      id: 'mesa' as const,
      name: 'Mesa',
      icon: Users,
      description: 'Atendimento de mesas',
      color: 'bg-purple-500'
    },
    {
      id: 'comanda' as const,
      name: 'Comanda',
      icon: ClipboardList,
      description: 'Sistema para garçons',
      color: 'bg-orange-500'
    },
    {
      id: 'kitchen' as const,
      name: 'Cozinha',
      icon: ChefHat,
      description: 'Pedidos em preparo',
      color: 'bg-red-500'
    }
  ];

  const getModuleStats = (moduleId: string) => {
    switch (moduleId) {
      case 'balcao':
        return orders.filter(o => o.type === 'balcao' && o.status !== 'completed').length;
      case 'delivery':
        return orders.filter(o => o.type === 'delivery' && o.status !== 'completed').length;
      case 'mesa':
        return orders.filter(o => o.type === 'mesa' && o.status !== 'completed').length;
      case 'comanda':
        return orders.filter(o => o.type === 'comanda' && o.status !== 'completed').length;
      case 'kitchen':
        return getKitchenOrders().filter(item => item.status === 'preparing').length;
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
      case 'comanda':
        return <ComandaModule />;
      case 'kitchen':
        return <KitchenModule />;
      default:
        return <BalcaoModule />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com seleção de módulos */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sistema POS - Frente de Caixa</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {modules.map((module) => {
              const IconComponent = module.icon;
              const stats = getModuleStats(module.id);
              
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                    activeModule === module.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`p-3 rounded-lg ${module.color} text-white`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900">{module.name}</h3>
                      <p className="text-xs text-gray-500">{module.description}</p>
                    </div>
                    
                    {stats > 0 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{stats}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conteúdo do módulo ativo */}
      <div className="p-4">
        {renderModule()}
      </div>
    </div>
  );
}

export default POS;
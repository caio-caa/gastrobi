import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import { usePOS } from '../../contexts/POSContext';
import Button from '../ui/Button';

function KitchenModule() {
  const { getKitchenOrders, updateItemStatus, subscribeToUpdates } = usePOS();
  const [kitchenOrders, setKitchenOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all');

  useEffect(() => {
    updateKitchenOrders();
    const unsubscribe = subscribeToUpdates(() => {
      updateKitchenOrders();
    });
    return unsubscribe;
  }, []);

  const updateKitchenOrders = () => {
    const orders = getKitchenOrders();
    setKitchenOrders(orders);
  };

  const handleStatusUpdate = (orderId: string, itemId: string, newStatus: any) => {
    updateItemStatus(orderId, itemId, newStatus);
  };

  const filteredOrders = kitchenOrders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      default: return status;
    }
  };

  const getTimeElapsed = (addedAt: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - addedAt.getTime()) / 1000 / 60);
    return diff;
  };

  const groupedOrders = filteredOrders.reduce((acc: any, order) => {
    const key = order.orderType === 'comanda' 
      ? `Mesa ${order.tableNumber} - ${order.comandaNumber}`
      : order.orderType === 'mesa'
      ? `Mesa ${order.tableNumber}`
      : order.orderType === 'delivery'
      ? 'Delivery'
      : 'Balcão';
    
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(order);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <ChefHat className="w-6 h-6 mr-2" />
            Cozinha - Pedidos em Tempo Real
          </h2>
          <p className="text-gray-600">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'item' : 'itens'} 
            {filter !== 'all' && ` (${getStatusText(filter)})`}
          </p>
        </div>

        {/* Filtros */}
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendentes</option>
            <option value="preparing">Preparando</option>
            <option value="ready">Prontos</option>
          </select>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { status: 'pending', label: 'Pendentes', color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { status: 'preparing', label: 'Preparando', color: 'text-blue-600', bg: 'bg-blue-50' },
          { status: 'ready', label: 'Prontos', color: 'text-green-600', bg: 'bg-green-50' },
          { status: 'all', label: 'Total', color: 'text-gray-600', bg: 'bg-gray-50' }
        ].map(({ status, label, color, bg }) => {
          const count = status === 'all' 
            ? kitchenOrders.length 
            : kitchenOrders.filter(o => o.status === status).length;
          
          return (
            <div key={status} className={`p-4 rounded-lg ${bg} border`}>
              <div className="text-center">
                <p className={`text-2xl font-bold ${color}`}>{count}</p>
                <p className="text-sm text-gray-600">{label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pedidos agrupados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(groupedOrders).map(([groupKey, items]: [string, any]) => (
          <div key={groupKey} className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b bg-red-50">
              <h3 className="font-semibold text-gray-900">{groupKey}</h3>
              <p className="text-sm text-gray-600">
                {items.length} {items.length === 1 ? 'item' : 'itens'}
              </p>
            </div>
            
            <div className="p-4 space-y-3">
              {items.map((order: any) => {
                const timeElapsed = getTimeElapsed(order.addedAt);
                const isUrgent = timeElapsed > 15;
                
                return (
                  <div 
                    key={order.id} 
                    className={`p-3 rounded-lg border-2 ${getStatusColor(order.status)} ${
                      isUrgent ? 'ring-2 ring-red-300' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {order.quantity}x {order.productName}
                        </h4>
                        {order.observations && (
                          <p className="text-sm text-orange-600 italic mt-1">
                            Obs: {order.observations}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center text-sm ${
                          isUrgent ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          <Clock className="w-4 h-4 mr-1" />
                          {timeElapsed}min
                        </div>
                        {isUrgent && (
                          <div className="flex items-center text-red-600 text-xs mt-1">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Urgente
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(order.orderId, order.id, 'preparing')}
                          className="flex-1"
                        >
                          Iniciar Preparo
                        </Button>
                      )}
                      
                      {order.status === 'preparing' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(order.orderId, order.id, 'ready')}
                          icon={CheckCircle}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Marcar Pronto
                        </Button>
                      )}
                      
                      {order.status === 'ready' && (
                        <div className="flex-1 text-center py-2 bg-green-100 text-green-800 rounded font-medium text-sm">
                          ✓ Pronto para servir
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'Nenhum pedido na cozinha' : `Nenhum item ${getStatusText(filter).toLowerCase()}`}
          </h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Os pedidos aparecerão aqui em tempo real'
              : 'Altere o filtro para ver outros pedidos'
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default KitchenModule;
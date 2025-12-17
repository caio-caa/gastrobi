'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Plus,
  Minus,
  Send,
  Clock,
  CheckCircle,
  User,
} from 'lucide-react';
import { usePOS } from '@/contexts/POSContext';
import Button from '@/components/ui/Button';

function ComandaModule() {
  const {
    products,
    addOrder,
    createComanda,
    comandas,
    tables,
    subscribeToUpdates,
  } = usePOS();
  const [waiterName, setWaiterName] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [currentComanda, setCurrentComanda] = useState('');
  const [cart, setCart] = useState<
    Array<{
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      observations?: string;
    }>
  >([]);
  const [showObservations, setShowObservations] = useState<string>('');

  useEffect(() => {
    const unsubscribe = subscribeToUpdates(() => {
      // Atualizar interface quando houver mudanças
    });
    return unsubscribe;
  }, [subscribeToUpdates]);

  const startComanda = () => {
    if (!waiterName || !selectedTable) return;

    const comandaNumber = createComanda(selectedTable, waiterName);
    setCurrentComanda(comandaNumber);
  };

  const addToCart = (product: { id: string; name: string; price: number }) => {
    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.productId !== productId));
    } else {
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const updateObservations = (productId: string, observations: string) => {
    setCart(
      cart.map((item) =>
        item.productId === productId ? { ...item, observations } : item
      )
    );
  };

  const sendToKitchen = () => {
    if (cart.length === 0 || !currentComanda) return;

    const orderItems = cart.map((item) => ({
      id: Date.now().toString() + Math.random(),
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      observations: item.observations,
      status: 'pending' as const,
      addedAt: new Date(),
    }));

    addOrder({
      type: 'comanda',
      items: orderItems,
      total: getTotal(),
      status: 'preparing',
      tableNumber: selectedTable,
      comandaNumber: currentComanda,
      waiterName,
    });

    setCart([]);
    alert('Pedido enviado para a cozinha!');
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const availableTables = tables.filter((t) => t.status === 'available');
  const activeComanda = comandas.find((c) => c.number === currentComanda);

  // Interface mobile-first para garçons
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="bg-orange-500 text-white p-4 sticky top-0 z-10">
        <h1 className="text-lg font-bold flex items-center">
          <ClipboardList className="w-5 h-5 mr-2" />
          Comanda Eletrônica
        </h1>
        {activeComanda && (
          <p className="text-sm opacity-90">
            Mesa {selectedTable} • {waiterName} • #{currentComanda}
          </p>
        )}
      </div>

      {!currentComanda ? (
        /* Iniciar Comanda */
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do garçom
            </label>
            <input
              type="text"
              value={waiterName}
              onChange={(e) => setWaiterName(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg text-lg"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar mesa
            </label>
            <div className="grid grid-cols-4 gap-2">
              {availableTables.map((table) => (
                <button
                  key={table.number}
                  onClick={() => setSelectedTable(table.number)}
                  className={`p-3 rounded-lg border-2 text-center ${
                    selectedTable === table.number
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold">{table.number}</div>
                  <div className="text-xs text-green-600">Livre</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={startComanda}
            disabled={!waiterName || !selectedTable}
            className="w-full py-3 text-lg"
          >
            Iniciar Atendimento
          </Button>
        </div>
      ) : (
        /* Interface de Pedidos */
        <div className="flex flex-col h-screen">
          {/* Produtos */}
          <div className="flex-1 overflow-y-auto p-4">
            {[...new Set(products.map((p) => p.category))].map((category) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                  {category}
                </h3>
                <div className="space-y-2">
                  {products
                    .filter(
                      (product) =>
                        product.category === category && product.isActive
                    )
                    .map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className="w-full p-4 border border-gray-100 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {product.name}
                            </h4>
                            <p className="text-orange-600 font-bold">
                              {formatCurrency(product.price)}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {product.preparationTime} min
                            </div>
                          </div>
                          <Plus className="w-5 h-5 text-orange-500" />
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Carrinho fixo na parte inferior */}
          {cart.length > 0 && (
            <div className="border-t bg-white p-4 space-y-3">
              <div className="max-h-40 overflow-y-auto space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {formatCurrency(item.price)}
                      </p>
                      {item.observations && (
                        <p className="text-xs text-orange-600 italic">
                          Obs: {item.observations}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        setShowObservations(
                          showObservations === item.productId
                            ? ''
                            : item.productId
                        )
                      }
                      className="ml-2 text-orange-500 text-xs"
                    >
                      Obs
                    </button>
                  </div>
                ))}
              </div>

              {showObservations && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações:
                  </label>
                  <input
                    type="text"
                    value={
                      cart.find((item) => item.productId === showObservations)
                        ?.observations || ''
                    }
                    onChange={(e) =>
                      updateObservations(showObservations, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Ex: sem cebola, ponto da carne..."
                  />
                  <button
                    onClick={() => setShowObservations('')}
                    className="mt-2 text-sm text-orange-600"
                  >
                    Fechar
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-t">
                <span className="font-bold">
                  Total: {formatCurrency(getTotal())}
                </span>
                <span className="text-sm text-gray-600">
                  {cart.length} {cart.length === 1 ? 'item' : 'itens'}
                </span>
              </div>

              <Button onClick={sendToKitchen} icon={Send} className="w-full py-3">
                Enviar para Cozinha
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ComandaModule;

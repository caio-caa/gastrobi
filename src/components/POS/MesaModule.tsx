import React, { useState } from 'react';
import { Users, Plus, Minus, Calculator, CreditCard, Receipt } from 'lucide-react';
import { usePOS } from '../../contexts/POSContext';
import Button from '../ui/Button';

function MesaModule() {
  const { products, tables, addOrder, updateTable, orders } = usePOS();
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [cart, setCart] = useState<Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [splitBill, setSplitBill] = useState(false);
  const [splitCount, setSplitCount] = useState(1);

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      setCart(cart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      ));
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSplitAmount = () => {
    return getTotal() / splitCount;
  };

  const openTable = (tableNumber: string) => {
    setSelectedTable(tableNumber);
    updateTable(tableNumber, { status: 'occupied' });
    setCart([]);
    setShowPayment(false);
    setSplitBill(false);
    setSplitCount(1);
  };

  const addItemsToTable = () => {
    if (cart.length === 0 || !selectedTable) return;

    const orderItems = cart.map(item => ({
      id: Date.now().toString() + Math.random(),
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      status: 'pending' as const,
      addedAt: new Date()
    }));

    addOrder({
      type: 'mesa',
      items: orderItems,
      total: getTotal(),
      status: 'open',
      tableNumber: selectedTable
    });

    setCart([]);
    alert(`Itens adicionados à mesa ${selectedTable}!`);
  };

  const closeTable = () => {
    if (!selectedTable) return;

    updateTable(selectedTable, { 
      status: 'available',
      currentOrder: undefined,
      waiter: undefined
    });

    alert(`Mesa ${selectedTable} fechada e liberada!`);
    setSelectedTable('');
    setCart([]);
    setShowPayment(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTableOrders = (tableNumber: string) => {
    return orders.filter(o => o.type === 'mesa' && o.tableNumber === tableNumber && o.status !== 'completed');
  };

  const getTableTotal = (tableNumber: string) => {
    return getTableOrders(tableNumber).reduce((total, order) => total + order.total, 0);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Seleção de Mesa */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b bg-purple-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Mesas
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-2">
            {tables.map(table => {
              const tableTotal = getTableTotal(table.number);
              return (
                <button
                  key={table.number}
                  onClick={() => openTable(table.number)}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    selectedTable === table.number
                      ? 'border-purple-500 bg-purple-50'
                      : table.status === 'available'
                      ? 'border-green-300 bg-green-50 hover:border-green-400'
                      : 'border-red-300 bg-red-50'
                  }`}
                >
                  <div className="font-bold text-sm">{table.number}</div>
                  <div className={`text-xs ${
                    table.status === 'available' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {table.status === 'available' ? 'Livre' : 'Ocupada'}
                  </div>
                  {tableTotal > 0 && (
                    <div className="text-xs font-bold text-purple-600 mt-1">
                      {formatCurrency(tableTotal)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Produtos */}
      <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b bg-blue-50">
          <h2 className="text-lg font-semibold text-gray-900">
            Produtos {selectedTable && `- Mesa ${selectedTable}`}
          </h2>
        </div>
        
        {!selectedTable ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Selecione uma mesa para começar</p>
          </div>
        ) : (
          <div className="p-4 overflow-y-auto h-96">
            {[...new Set(products.map(p => p.category))].map(category => (
              <div key={category} className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-3 border-b pb-2">
                  {category}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {products
                    .filter(product => product.category === category && product.isActive)
                    .map(product => (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
                      >
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {product.name}
                        </h4>
                        <p className="text-purple-600 font-bold text-sm">
                          {formatCurrency(product.price)}
                        </p>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Carrinho e Controles */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b bg-green-50">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedTable ? `Mesa ${selectedTable}` : 'Carrinho'}
          </h2>
        </div>

        <div className="p-4 space-y-4">
          {/* Carrinho atual */}
          {cart.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Itens a adicionar:</h3>
              <div className="space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.productId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-gray-600">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">Subtotal:</span>
                <span className="font-bold text-green-600">{formatCurrency(getTotal())}</span>
              </div>
              <Button
                onClick={addItemsToTable}
                className="w-full mb-4"
                disabled={!selectedTable}
              >
                Adicionar à Mesa
              </Button>
            </div>
          )}

          {/* Pedidos da mesa */}
          {selectedTable && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Pedidos da mesa:</h3>
              {getTableOrders(selectedTable).map(order => (
                <div key={order.id} className="p-3 border border-gray-200 rounded-lg mb-2">
                  <div className="space-y-1">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.productName}</span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-1 mt-1 text-sm font-bold">
                    Total: {formatCurrency(order.total)}
                  </div>
                </div>
              ))}
              
              {getTableTotal(selectedTable) > 0 && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Total da Mesa:</span>
                    <span className="text-lg font-bold text-purple-600">
                      {formatCurrency(getTableTotal(selectedTable))}
                    </span>
                  </div>

                  {!showPayment ? (
                    <Button
                      onClick={() => setShowPayment(true)}
                      icon={Calculator}
                      className="w-full"
                    >
                      Fechar Conta
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="splitBill"
                          checked={splitBill}
                          onChange={(e) => setSplitBill(e.target.checked)}
                          className="w-4 h-4 text-purple-600"
                        />
                        <label htmlFor="splitBill" className="text-sm">
                          Dividir conta
                        </label>
                      </div>

                      {splitBill && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dividir em quantas pessoas?
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={splitCount}
                            onChange={(e) => setSplitCount(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <p className="text-sm text-gray-600 mt-1">
                            {formatCurrency(getSplitAmount())} por pessoa
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          onClick={() => setShowPayment(false)}
                          className="flex-1"
                        >
                          Voltar
                        </Button>
                        <Button
                          onClick={closeTable}
                          icon={Receipt}
                          className="flex-1"
                        >
                          Finalizar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MesaModule;
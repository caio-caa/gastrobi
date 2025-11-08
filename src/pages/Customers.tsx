import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Star,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function Customers() {
  const { customers, addCustomer, updateCustomer } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    preferences: [] as string[]
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAddCustomer = () => {
    addCustomer({
      ...newCustomer,
      lastVisit: new Date(),
      totalSpent: 0,
      visitCount: 0,
      points: 0,
      level: 'bronze',
      status: 'active',
      preferences: []
    });
    setNewCustomer({ name: '', email: '', phone: '', preferences: [] });
    setShowAddModal(false);
  };

  const handleAddPoints = (customerId: string, points: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      const newPoints = customer.points + points;
      let newLevel = customer.level;
      
      if (newPoints >= 500) newLevel = 'gold';
      else if (newPoints >= 200) newLevel = 'silver';
      else newLevel = 'bronze';

      updateCustomer(customerId, { points: newPoints, level: newLevel });
    }
    setShowActionModal(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie seus clientes e histórico de compras</p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>
          Novo Cliente
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nível
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Visita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Gasto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pontos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.level === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                      customer.level === 'silver' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      <Star className="w-3 h-3 mr-1" />
                      {customer.level}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {format(customer.lastVisit, 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                      {formatCurrency(customer.totalSpent)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.points} pts</div>
                    <div className="text-sm text-gray-500">{customer.visitCount} visitas</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link 
                        to={`/customers/${customer.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowActionModal(true);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adicionar Cliente */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Novo Cliente"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome completo
            </label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o nome do cliente"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o e-mail"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="(11) 99999-9999"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCustomer}>
              Adicionar Cliente
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Ações do Cliente */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={`Ações - ${selectedCustomer?.name}`}
      >
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Informações Atuais</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Pontos:</span>
                <span className="ml-2 font-medium">{selectedCustomer?.points}</span>
              </div>
              <div>
                <span className="text-gray-500">Nível:</span>
                <span className="ml-2 font-medium capitalize">{selectedCustomer?.level}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              icon={Gift}
              variant="outline"
              className="w-full justify-center"
              onClick={() => handleAddPoints(selectedCustomer?.id, 50)}
            >
              Adicionar 50 Pontos
            </Button>
            <Button
              icon={Gift}
              variant="outline"
              className="w-full justify-center"
              onClick={() => handleAddPoints(selectedCustomer?.id, 100)}
            >
              Adicionar 100 Pontos
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Customers;
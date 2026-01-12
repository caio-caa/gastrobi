'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  DollarSign,
  Activity,
  Globe,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Pause,
  Play,
  X
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Layout from '@/components/Layout/Layout';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cnpj: string | null;
  phone: string | null;
  email: string | null;
  status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CANCELLED';
  createdAt: string;
  subscription?: {
    plan: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
    status: string;
    nextBillingDate: string;
    amount: number;
  };
  _count?: {
    orders: number;
    customers: number;
    products: number;
  };
  owner?: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface PlatformMetrics {
  totalRestaurants: number;
  activeRestaurants: number;
  trialRestaurants: number;
  suspendedRestaurants: number;
  monthlyRevenue: number;
}

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [metrics, setMetrics] = useState<PlatformMetrics>({
    totalRestaurants: 0,
    activeRestaurants: 0,
    trialRestaurants: 0,
    suspendedRestaurants: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    cnpj: '',
    phone: '',
    email: '',
    ownerId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    // Mock data - será substituído pela API real
    const mockRestaurants: Restaurant[] = [
      {
        id: '1',
        name: 'Hamburgueria do Zé',
        slug: 'hamburgueria-do-ze',
        cnpj: '12.345.678/0001-90',
        phone: '+5511999999999',
        email: 'contato@hamburgueriadoze.com',
        status: 'ACTIVE',
        createdAt: '2024-06-15T00:00:00.000Z',
        subscription: {
          plan: 'PREMIUM',
          status: 'ACTIVE',
          nextBillingDate: '2026-02-15T00:00:00.000Z',
          amount: 299
        },
        _count: {
          orders: 1250,
          customers: 890,
          products: 45
        },
        owner: {
          id: 'u1',
          fullName: 'José Silva',
          email: 'jose@hamburgueriadoze.com'
        }
      },
      {
        id: '2',
        name: 'Pizzaria Bella Napoli',
        slug: 'pizzaria-bella-napoli',
        cnpj: '98.765.432/0001-10',
        phone: '+5511988888888',
        email: 'contato@bellanapoli.com',
        status: 'ACTIVE',
        createdAt: '2024-08-20T00:00:00.000Z',
        subscription: {
          plan: 'ENTERPRISE',
          status: 'ACTIVE',
          nextBillingDate: '2026-02-20T00:00:00.000Z',
          amount: 599
        },
        _count: {
          orders: 2340,
          customers: 1560,
          products: 78
        },
        owner: {
          id: 'u2',
          fullName: 'Maria Santos',
          email: 'maria@bellanapoli.com'
        }
      },
      {
        id: '3',
        name: 'Sushi Express',
        slug: 'sushi-express',
        cnpj: null,
        phone: '+5511977777777',
        email: 'contato@sushiexpress.com',
        status: 'TRIAL',
        createdAt: '2026-01-05T00:00:00.000Z',
        subscription: {
          plan: 'BASIC',
          status: 'TRIAL',
          nextBillingDate: '2026-02-05T00:00:00.000Z',
          amount: 0
        },
        _count: {
          orders: 45,
          customers: 32,
          products: 25
        },
        owner: {
          id: 'u3',
          fullName: 'Carlos Tanaka',
          email: 'carlos@sushiexpress.com'
        }
      },
      {
        id: '4',
        name: 'Cantina Italiana',
        slug: 'cantina-italiana',
        cnpj: '11.222.333/0001-44',
        phone: '+5511966666666',
        email: 'contato@cantinaitaliana.com',
        status: 'SUSPENDED',
        createdAt: '2024-03-10T00:00:00.000Z',
        subscription: {
          plan: 'PREMIUM',
          status: 'PAST_DUE',
          nextBillingDate: '2026-01-10T00:00:00.000Z',
          amount: 299
        },
        _count: {
          orders: 890,
          customers: 456,
          products: 52
        },
        owner: {
          id: 'u4',
          fullName: 'Giovanni Rossi',
          email: 'giovanni@cantinaitaliana.com'
        }
      }
    ];

    setRestaurants(mockRestaurants);
    setMetrics({
      totalRestaurants: mockRestaurants.length,
      activeRestaurants: mockRestaurants.filter(r => r.status === 'ACTIVE').length,
      trialRestaurants: mockRestaurants.filter(r => r.status === 'TRIAL').length,
      suspendedRestaurants: mockRestaurants.filter(r => r.status === 'SUSPENDED').length,
      monthlyRevenue: mockRestaurants.reduce((acc, r) => acc + (r.subscription?.amount || 0), 0)
    });
    setLoading(false);
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || restaurant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'TRIAL': return 'bg-blue-100 text-blue-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Ativo';
      case 'TRIAL': return 'Trial';
      case 'SUSPENDED': return 'Suspenso';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'BASIC': return 'bg-gray-100 text-gray-800';
      case 'PREMIUM': return 'bg-purple-100 text-purple-800';
      case 'ENTERPRISE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleSuspend = async (id: string) => {
    // API: POST /admin/restaurants/:id/suspend
    setRestaurants(restaurants.map(r => 
      r.id === id ? { ...r, status: 'SUSPENDED' as const } : r
    ));
    setActionMenu(null);
  };

  const handleActivate = async (id: string) => {
    // API: POST /admin/restaurants/:id/activate
    setRestaurants(restaurants.map(r => 
      r.id === id ? { ...r, status: 'ACTIVE' as const } : r
    ));
    setActionMenu(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este restaurante?')) {
      // API: DELETE /admin/restaurants/:id
      setRestaurants(restaurants.filter(r => r.id !== id));
    }
    setActionMenu(null);
  };

  const handleCreate = async () => {
    // API: POST /admin/restaurants
    const newRestaurant: Restaurant = {
      id: Date.now().toString(),
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      cnpj: formData.cnpj || null,
      phone: formData.phone || null,
      email: formData.email || null,
      status: 'TRIAL',
      createdAt: new Date().toISOString(),
      subscription: {
        plan: 'BASIC',
        status: 'TRIAL',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 0
      },
      _count: { orders: 0, customers: 0, products: 0 }
    };

    setRestaurants([newRestaurant, ...restaurants]);
    setShowCreateModal(false);
    setFormData({ name: '', slug: '', cnpj: '', phone: '', email: '', ownerId: '' });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Restaurantes</h1>
            <p className="text-gray-600">Gerencie todos os restaurantes da plataforma</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Restaurante
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{metrics.totalRestaurants}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-xl font-bold text-green-600">{metrics.activeRestaurants}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Trial</p>
                <p className="text-xl font-bold text-blue-600">{metrics.trialRestaurants}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Suspensos</p>
                <p className="text-xl font-bold text-red-600">{metrics.suspendedRestaurants}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">MRR</p>
                <p className="text-xl font-bold text-purple-600">{formatCurrency(metrics.monthlyRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, slug ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="ACTIVE">Ativos</option>
              <option value="TRIAL">Trial</option>
              <option value="SUSPENDED">Suspensos</option>
              <option value="CANCELLED">Cancelados</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Restaurante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Métricas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proprietário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Carregando...
                    </td>
                  </tr>
                ) : filteredRestaurants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Nenhum restaurante encontrado
                    </td>
                  </tr>
                ) : (
                  filteredRestaurants.map((restaurant) => (
                    <tr key={restaurant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {restaurant.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                            <div className="text-sm text-gray-500">{restaurant.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(restaurant.status)}`}>
                          {getStatusLabel(restaurant.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(restaurant.subscription?.plan || 'BASIC')}`}>
                          {restaurant.subscription?.plan || 'BASIC'}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatCurrency(restaurant.subscription?.amount || 0)}/mês
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="text-blue-600">{restaurant._count?.orders || 0}</span> pedidos
                        </div>
                        <div className="text-xs text-gray-500">
                          {restaurant._count?.customers || 0} clientes • {restaurant._count?.products || 0} produtos
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {restaurant.owner ? (
                          <div>
                            <div className="text-sm text-gray-900">{restaurant.owner.fullName}</div>
                            <div className="text-xs text-gray-500">{restaurant.owner.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(restaurant.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative">
                          <button
                            onClick={() => setActionMenu(actionMenu === restaurant.id ? null : restaurant.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
                          </button>
                          {actionMenu === restaurant.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <button
                                onClick={() => {
                                  setSelectedRestaurant(restaurant);
                                  setShowDetailModal(true);
                                  setActionMenu(null);
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalhes
                              </button>
                              {restaurant.status === 'ACTIVE' ? (
                                <button
                                  onClick={() => handleSuspend(restaurant.id)}
                                  className="w-full flex items-center px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
                                >
                                  <Pause className="w-4 h-4 mr-2" />
                                  Suspender
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleActivate(restaurant.id)}
                                  className="w-full flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Ativar
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(restaurant.id)}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Novo Restaurante"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do restaurante"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="restaurante-slug"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="00.000.000/0001-00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+55 11 99999-9999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="contato@restaurante.com"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={!formData.name}>
                Criar Restaurante
              </Button>
            </div>
          </div>
        </Modal>

        {/* Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Detalhes do Restaurante"
        >
          {selectedRestaurant && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                  {selectedRestaurant.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedRestaurant.name}</h3>
                  <p className="text-gray-500">{selectedRestaurant.slug}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRestaurant.status)}`}>
                    {getStatusLabel(selectedRestaurant.status)}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Plano</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(selectedRestaurant.subscription?.plan || 'BASIC')}`}>
                    {selectedRestaurant.subscription?.plan || 'BASIC'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {selectedRestaurant.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-3" />
                    {selectedRestaurant.email}
                  </div>
                )}
                {selectedRestaurant.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-3" />
                    {selectedRestaurant.phone}
                  </div>
                )}
                {selectedRestaurant.cnpj && (
                  <div className="flex items-center text-gray-600">
                    <Building2 className="w-4 h-4 mr-3" />
                    CNPJ: {selectedRestaurant.cnpj}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedRestaurant._count?.orders || 0}</p>
                  <p className="text-sm text-gray-600">Pedidos</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedRestaurant._count?.customers || 0}</p>
                  <p className="text-sm text-gray-600">Clientes</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedRestaurant._count?.products || 0}</p>
                  <p className="text-sm text-gray-600">Produtos</p>
                </div>
              </div>

              {selectedRestaurant.owner && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Proprietário</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedRestaurant.owner.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedRestaurant.owner.fullName}</p>
                      <p className="text-sm text-gray-500">{selectedRestaurant.owner.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}

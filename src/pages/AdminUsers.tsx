import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Building2,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  Crown,
  UserCheck,
  Settings,
  TrendingUp,
  DollarSign,
  Activity,
  Globe,
  Download,
  Upload,
  RefreshCw,
  UserPlus,
  Key,
  Lock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: 'super_admin' | 'admin' | 'owner' | 'manager' | 'staff';
  is_active: boolean;
  email_verified: boolean;
  two_factor_enabled: boolean;
  last_login: string | null;
  created_at: string;
  restaurants: {
    id: string;
    name: string;
    status: string;
    role: string;
    plan: string;
  }[];
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'suspended' | 'trial' | 'cancelled';
  created_at: string;
  subscription?: {
    plan_name: string;
    status: string;
    current_period_end: string;
    revenue: number;
  };
  metrics: {
    total_customers: number;
    total_orders: number;
    monthly_revenue: number;
    last_activity: string;
  };
}

interface PlatformMetrics {
  totalUsers: number;
  activeUsers: number;
  totalRestaurants: number;
  activeRestaurants: number;
  trialRestaurants: number;
  totalRevenue: number;
  monthlyRevenue: number;
  churnRate: number;
  avgRevenuePerUser: number;
  totalCustomers: number;
  totalOrders: number;
  conversionRate: number;
}

function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    totalRestaurants: 0,
    activeRestaurants: 0,
    trialRestaurants: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    churnRate: 0,
    avgRevenuePerUser: 0,
    totalCustomers: 0,
    totalOrders: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'restaurants' | 'analytics'>('overview');

  const [newUser, setNewUser] = useState({
    email: '',
    full_name: '',
    phone: '',
    role: 'owner' as const,
    restaurant_name: '',
    send_invitation: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadUsers(), loadRestaurants(), loadPlatformMetrics()]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    // Simulação de dados - em produção seria uma consulta real ao Supabase
    const mockUsers: UserProfile[] = [
      {
        id: '1',
        email: 'admin@gastrobi.com',
        full_name: 'Super Administrador',
        phone: '(11) 99999-9999',
        role: 'super_admin',
        is_active: true,
        email_verified: true,
        two_factor_enabled: true,
        last_login: new Date().toISOString(),
        created_at: new Date('2024-01-01').toISOString(),
        restaurants: []
      },
      {
        id: '2',
        email: 'joao@restaurante.com',
        full_name: 'João Silva',
        phone: '(11) 88888-8888',
        role: 'owner',
        is_active: true,
        email_verified: true,
        two_factor_enabled: false,
        last_login: new Date().toISOString(),
        created_at: new Date('2024-02-15').toISOString(),
        restaurants: [
          { id: '1', name: 'Restaurante do João', status: 'active', role: 'owner', plan: 'premium' }
        ]
      },
      {
        id: '3',
        email: 'maria@pizzaria.com',
        full_name: 'Maria Santos',
        phone: '(11) 77777-7777',
        role: 'owner',
        is_active: true,
        email_verified: true,
        two_factor_enabled: false,
        last_login: new Date(Date.now() - 86400000).toISOString(),
        created_at: new Date('2024-03-10').toISOString(),
        restaurants: [
          { id: '2', name: 'Pizzaria Bella Vista', status: 'trial', role: 'owner', plan: 'basic' }
        ]
      }
    ];
    setUsers(mockUsers);
  };

  const loadRestaurants = async () => {
    // Simulação de dados - em produção seria uma consulta real ao Supabase
    const mockRestaurants: Restaurant[] = [
      {
        id: '1',
        name: 'Restaurante do João',
        slug: 'restaurante-do-joao',
        status: 'active',
        created_at: new Date('2024-02-15').toISOString(),
        subscription: {
          plan_name: 'Premium',
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          revenue: 97.00
        },
        metrics: {
          total_customers: 245,
          total_orders: 1250,
          monthly_revenue: 15420.50,
          last_activity: new Date().toISOString()
        }
      },
      {
        id: '2',
        name: 'Pizzaria Bella Vista',
        slug: 'pizzaria-bella-vista',
        status: 'trial',
        created_at: new Date('2024-03-10').toISOString(),
        subscription: {
          plan_name: 'Básico',
          status: 'trialing',
          current_period_end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          revenue: 0
        },
        metrics: {
          total_customers: 89,
          total_orders: 320,
          monthly_revenue: 8750.30,
          last_activity: new Date(Date.now() - 3600000).toISOString()
        }
      }
    ];
    setRestaurants(mockRestaurants);
  };

  const loadPlatformMetrics = async () => {
    // Simulação de métricas da plataforma
    const metrics: PlatformMetrics = {
      totalUsers: 156,
      activeUsers: 142,
      totalRestaurants: 89,
      activeRestaurants: 67,
      trialRestaurants: 22,
      totalRevenue: 45670.80,
      monthlyRevenue: 8940.50,
      churnRate: 3.2,
      avgRevenuePerUser: 97.50,
      totalCustomers: 12450,
      totalOrders: 45670,
      conversionRate: 78.5
    };
    setPlatformMetrics(metrics);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.is_active) ||
                         (filterStatus === 'inactive' && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.slug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'owner': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return Crown;
      case 'admin': return Shield;
      case 'owner': return Building2;
      case 'manager': return UserCheck;
      default: return Users;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Administrador';
      case 'owner': return 'Proprietário';
      case 'manager': return 'Gerente';
      default: return 'Funcionário';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCreateUser = async () => {
    // Simulação - em produção seria integrado com Supabase Auth
    console.log('Criando usuário:', newUser);
    alert('Usuário criado com sucesso! E-mail de convite enviado.');
    setShowCreateUserModal(false);
    setNewUser({
      email: '',
      full_name: '',
      phone: '',
      role: 'owner',
      restaurant_name: '',
      send_invitation: true
    });
    await loadUsers();
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    // Simulação - em produção seria uma chamada ao Supabase
    console.log(`Alterando status do usuário ${userId} para ${!currentStatus}`);
    await loadUsers();
  };

  const handleToggleRestaurantStatus = async (restaurantId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    console.log(`Alterando status do restaurante ${restaurantId} para ${newStatus}`);
    await loadRestaurants();
  };

  const exportData = () => {
    const data = {
      users: filteredUsers,
      restaurants: filteredRestaurants,
      metrics: platformMetrics,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `gastrobi-admin-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const tabs = [
    { id: 'overview', name: 'Visão Geral', icon: Activity },
    { id: 'users', name: 'Usuários', icon: Users },
    { id: 'restaurants', name: 'Restaurantes', icon: Building2 },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administração SaaS</h1>
          <p className="text-gray-600">Painel master para gestão da plataforma</p>
        </div>
        <div className="flex space-x-3">
          <Button icon={RefreshCw} variant="outline" onClick={loadData}>
            Atualizar
          </Button>
          <Button icon={Download} variant="outline" onClick={exportData}>
            Exportar Dados
          </Button>
          <Button icon={UserPlus} onClick={() => setShowCreateUserModal(true)}>
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(platformMetrics.totalRevenue)}
                  </p>
                  <p className="text-sm text-green-600 mt-1">+12.5% vs mês anterior</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Restaurantes Ativos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {platformMetrics.activeRestaurants}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {platformMetrics.trialRestaurants} em trial
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {platformMetrics.activeUsers}
                  </p>
                  <p className="text-sm text-purple-600 mt-1">
                    de {platformMetrics.totalUsers} total
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {platformMetrics.conversionRate}%
                  </p>
                  <p className="text-sm text-orange-600 mt-1">Trial → Pago</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Métricas Secundárias */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita por Plano</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Básico (R$ 47/mês)</span>
                  <span className="font-bold">{formatCurrency(2350)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Premium (R$ 97/mês)</span>
                  <span className="font-bold">{formatCurrency(5820)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Enterprise (R$ 197/mês)</span>
                  <span className="font-bold">{formatCurrency(1970)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade da Plataforma</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total de Clientes</span>
                  <span className="font-bold">{platformMetrics.totalCustomers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pedidos Processados</span>
                  <span className="font-bold">{platformMetrics.totalOrders.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxa de Churn</span>
                  <span className="font-bold text-red-600">{platformMetrics.churnRate}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas do Sistema</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-yellow-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">5 trials expirando em 3 dias</span>
                </div>
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">2 pagamentos em atraso</span>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Sistema operando normalmente</span>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurantes Recentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Restaurantes Recentes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurante</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receita Mensal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Atividade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {restaurants.slice(0, 5).map((restaurant) => (
                    <tr key={restaurant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                            <div className="text-sm text-gray-500">@{restaurant.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {restaurant.subscription?.plan_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(restaurant.status)}`}>
                          {restaurant.status === 'active' ? 'Ativo' : 
                           restaurant.status === 'trial' ? 'Trial' : 
                           restaurant.status === 'suspended' ? 'Suspenso' : 'Cancelado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(restaurant.metrics.monthly_revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(restaurant.metrics.last_activity), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Filtros */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todas as funções</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Administrador</option>
                  <option value="owner">Proprietário</option>
                  <option value="manager">Gerente</option>
                  <option value="staff">Funcionário</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os status</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Estatísticas de Usuários */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{users.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {users.filter(u => u.is_active).length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Proprietários</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {users.filter(u => u.role === 'owner').length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">E-mails Verificados</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {users.filter(u => u.email_verified).length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Usuários */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Função
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restaurantes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.full_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {getRoleLabel(user.role)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.restaurants.length} restaurante{user.restaurants.length !== 1 ? 's' : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_active ? 'Ativo' : 'Inativo'}
                            </span>
                            {user.email_verified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            {user.two_factor_enabled && (
                              <Shield className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.last_login 
                            ? format(new Date(user.last_login), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                            : 'Nunca'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                              className={`${user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                            >
                              {user.is_active ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Restaurants Tab */}
      {activeTab === 'restaurants' && (
        <div className="space-y-6">
          {/* Estatísticas de Restaurantes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Restaurantes</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{restaurants.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {restaurants.filter(r => r.status === 'active').length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Trial</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {restaurants.filter(r => r.status === 'trial').length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Suspensos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {restaurants.filter(r => r.status === 'suspended').length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-50">
                  <Ban className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Restaurantes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restaurante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plano
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receita Mensal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clientes
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
                  {filteredRestaurants.map((restaurant) => (
                    <tr key={restaurant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                            <div className="text-sm text-gray-500">@{restaurant.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {restaurant.subscription?.plan_name || 'Sem plano'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(restaurant.status)}`}>
                          {restaurant.status === 'active' ? 'Ativo' : 
                           restaurant.status === 'trial' ? 'Trial' : 
                           restaurant.status === 'suspended' ? 'Suspenso' : 'Cancelado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(restaurant.metrics.monthly_revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {restaurant.metrics.total_customers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(restaurant.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRestaurant(restaurant);
                              setShowRestaurantModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleRestaurantStatus(restaurant.id, restaurant.status)}
                            className={`${restaurant.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          >
                            {restaurant.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Crescimento */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crescimento da Plataforma</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Gráfico de crescimento seria implementado aqui</p>
                  <p className="text-sm">Usando bibliotecas como Chart.js ou Recharts</p>
                </div>
              </div>
            </div>

            {/* Distribuição por Planos */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Planos</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Básico</span>
                  </div>
                  <span className="font-bold">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Premium</span>
                  </div>
                  <span className="font-bold">40%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span>Enterprise</span>
                  </div>
                  <span className="font-bold">15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas Detalhadas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Métricas Detalhadas</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(platformMetrics.avgRevenuePerUser)}</p>
                  <p className="text-sm text-gray-600">ARPU (Receita Média por Usuário)</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{platformMetrics.conversionRate}%</p>
                  <p className="text-sm text-gray-600">Taxa de Conversão Trial → Pago</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">{platformMetrics.churnRate}%</p>
                  <p className="text-sm text-gray-600">Taxa de Churn Mensal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar Usuário */}
      <Modal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        title="Criar Novo Usuário"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                value={newUser.full_name}
                onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome do usuário"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Função
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="owner">Proprietário</option>
                <option value="manager">Gerente</option>
                <option value="admin">Administrador</option>
                <option value="staff">Funcionário</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do restaurante (opcional)
            </label>
            <input
              type="text"
              value={newUser.restaurant_name}
              onChange={(e) => setNewUser({ ...newUser, restaurant_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Deixe vazio para adicionar a restaurante existente"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendInvitation"
              checked={newUser.send_invitation}
              onChange={(e) => setNewUser({ ...newUser, send_invitation: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="sendInvitation" className="ml-2 text-sm text-gray-700">
              Enviar e-mail de convite
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setShowCreateUserModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateUser}>
              Criar Usuário
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Detalhes do Usuário */}
      <Modal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? 'Detalhes do Usuário' : 'Usuário'}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* Informações Básicas */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {selectedUser.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{selectedUser.full_name}</h3>
                <p className="text-gray-600">{selectedUser.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(selectedUser.role)}`}>
                    {getRoleLabel(selectedUser.role)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                  {selectedUser.email_verified && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      E-mail verificado
                    </span>
                  )}
                  {selectedUser.two_factor_enabled && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      2FA Ativo
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Informações de Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">E-mail</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
              </div>
              {selectedUser.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="font-medium">{selectedUser.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Cadastrado em</p>
                  <p className="font-medium">
                    {format(new Date(selectedUser.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              </div>
              {selectedUser.last_login && (
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Último login</p>
                    <p className="font-medium">
                      {format(new Date(selectedUser.last_login), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Restaurantes */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Restaurantes ({selectedUser.restaurants.length})</h4>
              {selectedUser.restaurants.length > 0 ? (
                <div className="space-y-2">
                  {selectedUser.restaurants.map(restaurant => (
                    <div key={restaurant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{restaurant.name}</p>
                        <p className="text-sm text-gray-600">Função: {getRoleLabel(restaurant.role)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(restaurant.status)}`}>
                          {restaurant.status === 'active' ? 'Ativo' : 
                           restaurant.status === 'trial' ? 'Trial' : 
                           restaurant.status === 'suspended' ? 'Suspenso' : 'Cancelado'}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {restaurant.plan}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhum restaurante associado</p>
              )}
            </div>

            {/* Ações */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant={selectedUser.is_active ? 'danger' : 'outline'}
                icon={selectedUser.is_active ? Ban : CheckCircle}
                onClick={() => handleToggleUserStatus(selectedUser.id, selectedUser.is_active)}
              >
                {selectedUser.is_active ? 'Desativar' : 'Ativar'}
              </Button>
              <Button icon={Key} variant="outline">
                Redefinir Senha
              </Button>
              <Button icon={Edit}>
                Editar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Detalhes do Restaurante */}
      <Modal
        isOpen={showRestaurantModal}
        onClose={() => {
          setShowRestaurantModal(false);
          setSelectedRestaurant(null);
        }}
        title="Detalhes do Restaurante"
        size="xl"
      >
        {selectedRestaurant && (
          <div className="space-y-6">
            {/* Header do Restaurante */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{selectedRestaurant.name}</h3>
                <p className="text-gray-600">@{selectedRestaurant.slug}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedRestaurant.status)}`}>
                    {selectedRestaurant.status === 'active' ? 'Ativo' : 
                     selectedRestaurant.status === 'trial' ? 'Trial' : 
                     selectedRestaurant.status === 'suspended' ? 'Suspenso' : 'Cancelado'}
                  </span>
                  {selectedRestaurant.subscription && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {selectedRestaurant.subscription.plan_name}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Button icon={Globe} variant="outline" size="sm">
                  Acessar como Suporte
                </Button>
              </div>
            </div>

            {/* Métricas do Restaurante */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Receita Mensal</p>
                <p className="text-xl font-bold text-green-900">
                  {formatCurrency(selectedRestaurant.metrics.monthly_revenue)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Clientes</p>
                <p className="text-xl font-bold text-blue-900">
                  {selectedRestaurant.metrics.total_customers}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Pedidos</p>
                <p className="text-xl font-bold text-purple-900">
                  {selectedRestaurant.metrics.total_orders}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600">Última Atividade</p>
                <p className="text-sm font-bold text-orange-900">
                  {format(new Date(selectedRestaurant.metrics.last_activity), 'dd/MM HH:mm', { locale: ptBR })}
                </p>
              </div>
            </div>

            {/* Informações da Assinatura */}
            {selectedRestaurant.subscription && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Informações da Assinatura</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Plano</p>
                    <p className="font-medium">{selectedRestaurant.subscription.plan_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{selectedRestaurant.subscription.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Próxima Cobrança</p>
                    <p className="font-medium">
                      {format(new Date(selectedRestaurant.subscription.current_period_end), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant={selectedRestaurant.status === 'active' ? 'danger' : 'outline'}
                icon={selectedRestaurant.status === 'active' ? Ban : CheckCircle}
                onClick={() => handleToggleRestaurantStatus(selectedRestaurant.id, selectedRestaurant.status)}
              >
                {selectedRestaurant.status === 'active' ? 'Suspender' : 'Ativar'}
              </Button>
              <Button icon={Settings} variant="outline">
                Configurações
              </Button>
              <Button icon={Edit}>
                Editar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AdminUsers;
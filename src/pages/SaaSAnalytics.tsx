import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Globe,
  Crown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell } from 'recharts';
import Button from '../components/ui/Button';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    monthlyRevenue: number;
    totalClients: number;
    activeClients: number;
    totalUsers: number;
    activeUsers: number;
    totalRestaurants: number;
    conversionRate: number;
    churnRate: number;
    avgRevenuePerUser: number;
  };
  revenueByPlan: Array<{
    plan: string;
    revenue: number;
    clients: number;
    color: string;
  }>;
  growthData: Array<{
    month: string;
    revenue: number;
    clients: number;
    users: number;
  }>;
  clientActivity: Array<{
    clientName: string;
    domain: string;
    plan: string;
    status: string;
    revenue: number;
    users: number;
    restaurants: number;
    lastActivity: string;
    growth: number;
  }>;
  platformMetrics: {
    totalOrders: number;
    totalCustomers: number;
    avgOrderValue: number;
    platformUptime: number;
    apiCalls: number;
    storageUsed: number;
  };
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: Date;
    priority: 'low' | 'medium' | 'high';
  }>;
}

function SaaSAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    
    // Simulação de dados - em produção seria uma consulta real
    const mockData: AnalyticsData = {
      overview: {
        totalRevenue: 125670.80,
        monthlyRevenue: 18940.50,
        totalClients: 45,
        activeClients: 38,
        totalUsers: 234,
        activeUsers: 198,
        totalRestaurants: 156,
        conversionRate: 78.5,
        churnRate: 3.2,
        avgRevenuePerUser: 537.50
      },
      revenueByPlan: [
        { plan: 'Básico', revenue: 23500, clients: 25, color: '#3b82f6' },
        { plan: 'Premium', revenue: 58200, clients: 15, color: '#10b981' },
        { plan: 'Enterprise', revenue: 43970, clients: 5, color: '#8b5cf6' }
      ],
      growthData: [
        { month: 'Jan', revenue: 8500, clients: 12, users: 45 },
        { month: 'Fev', revenue: 12300, clients: 18, users: 67 },
        { month: 'Mar', revenue: 15600, clients: 25, users: 89 },
        { month: 'Abr', revenue: 18200, clients: 32, users: 123 },
        { month: 'Mai', revenue: 21800, clients: 38, users: 156 },
        { month: 'Jun', revenue: 25400, clients: 45, users: 198 }
      ],
      clientActivity: [
        {
          clientName: 'RestauranteSystem',
          domain: 'restaurantesystem.com',
          plan: 'Enterprise',
          status: 'active',
          revenue: 15970,
          users: 67,
          restaurants: 23,
          lastActivity: new Date().toISOString(),
          growth: 12.5
        },
        {
          clientName: 'FoodTech Pro',
          domain: 'foodtech.pro',
          plan: 'Premium',
          status: 'active',
          revenue: 8940,
          users: 34,
          restaurants: 12,
          lastActivity: new Date(Date.now() - 3600000).toISOString(),
          growth: 8.3
        },
        {
          clientName: 'GestãoFood',
          domain: 'gestaofood.com.br',
          plan: 'Básico',
          status: 'trial',
          revenue: 0,
          users: 8,
          restaurants: 3,
          lastActivity: new Date(Date.now() - 86400000).toISOString(),
          growth: 0
        }
      ],
      platformMetrics: {
        totalOrders: 45670,
        totalCustomers: 12450,
        avgOrderValue: 67.80,
        platformUptime: 99.9,
        apiCalls: 1250000,
        storageUsed: 2.3
      },
      alerts: [
        {
          id: '1',
          type: 'warning',
          title: 'Trial expirando',
          message: '3 clientes com trial expirando em 2 dias',
          timestamp: new Date(),
          priority: 'high'
        },
        {
          id: '2',
          type: 'error',
          title: 'Pagamento em atraso',
          message: 'Cliente FoodTech Pro com pagamento em atraso há 5 dias',
          timestamp: new Date(Date.now() - 3600000),
          priority: 'high'
        },
        {
          id: '3',
          type: 'info',
          title: 'Novo cliente',
          message: 'RestauranteXYZ se cadastrou no plano Premium',
          timestamp: new Date(Date.now() - 7200000),
          priority: 'medium'
        },
        {
          id: '4',
          type: 'success',
          title: 'Meta atingida',
          message: 'Meta de receita mensal atingida com 5 dias de antecedência',
          timestamp: new Date(Date.now() - 10800000),
          priority: 'low'
        }
      ]
    };

    setTimeout(() => {
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Activity;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const exportAnalytics = () => {
    if (!analyticsData) return;
    
    const exportData = {
      ...analyticsData,
      exportedAt: new Date().toISOString(),
      dateRange,
      selectedMetric
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `saas-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading || !analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics da Plataforma</h1>
          <p className="text-gray-600">Métricas detalhadas e insights do negócio SaaS</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="365">Último ano</option>
          </select>
          <Button icon={RefreshCw} variant="outline" onClick={loadAnalyticsData}>
            Atualizar
          </Button>
          <Button icon={Download} variant="outline" onClick={exportAnalytics}>
            Exportar
          </Button>
        </div>
      </div>

      {/* Alertas Importantes */}
      {analyticsData.alerts.filter(a => a.priority === 'high').length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Alertas Importantes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyticsData.alerts
              .filter(alert => alert.priority === 'high')
              .map(alert => {
                const IconComponent = getAlertIcon(alert.type);
                return (
                  <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                    <div className="flex items-start space-x-3">
                      <IconComponent className="w-5 h-5 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm mt-1">{alert.message}</p>
                        <p className="text-xs mt-2 opacity-75">
                          {format(alert.timestamp, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(analyticsData.overview.totalRevenue)}
              </p>
              <p className="text-sm text-green-600 mt-1">+15.3% vs período anterior</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {analyticsData.overview.activeClients}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                de {analyticsData.overview.totalClients} total
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ARPU</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(analyticsData.overview.avgRevenuePerUser)}
              </p>
              <p className="text-sm text-purple-600 mt-1">Receita média por usuário</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {analyticsData.overview.conversionRate}%
              </p>
              <p className="text-sm text-orange-600 mt-1">Trial → Pago</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crescimento da Receita */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Crescimento da Receita</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="revenue">Receita</option>
              <option value="clients">Clientes</option>
              <option value="users">Usuários</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value, name) => [
                  selectedMetric === 'revenue' ? formatCurrency(Number(value)) : value,
                  selectedMetric === 'revenue' ? 'Receita' : 
                  selectedMetric === 'clients' ? 'Clientes' : 'Usuários'
                ]}
                labelStyle={{ color: '#374151' }}
              />
              <Line 
                type="monotone" 
                dataKey={selectedMetric}
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Receita por Plano */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita por Plano</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.revenueByPlan}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="plan" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value)), 'Receita']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Métricas da Plataforma */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade da Plataforma</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Pedidos</span>
              <span className="font-bold">{analyticsData.platformMetrics.totalOrders.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Clientes Finais</span>
              <span className="font-bold">{analyticsData.platformMetrics.totalCustomers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ticket Médio</span>
              <span className="font-bold">{formatCurrency(analyticsData.platformMetrics.avgOrderValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Uptime</span>
              <span className="font-bold text-green-600">{analyticsData.platformMetrics.platformUptime}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Técnica</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Chamadas API</span>
              <span className="font-bold">{analyticsData.platformMetrics.apiCalls.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Armazenamento</span>
              <span className="font-bold">{analyticsData.platformMetrics.storageUsed} TB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxa de Churn</span>
              <span className="font-bold text-red-600">{analyticsData.overview.churnRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Restaurantes</span>
              <span className="font-bold">{analyticsData.overview.totalRestaurants}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Planos</h3>
          <div className="space-y-3">
            {analyticsData.revenueByPlan.map((plan, index) => {
              const total = analyticsData.revenueByPlan.reduce((sum, p) => sum + p.clients, 0);
              const percentage = total > 0 ? (plan.clients / total) * 100 : 0;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: plan.color }}
                      ></div>
                      <span className="text-sm font-medium">{plan.plan}</span>
                    </div>
                    <span className="text-sm text-gray-600">{plan.clients} clientes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        backgroundColor: plan.color,
                        width: `${percentage}%` 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Atividade dos Clientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Atividade dos Clientes White Label</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receita</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuários</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurantes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crescimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Atividade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analyticsData.clientActivity.map((client, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.clientName}</div>
                      <div className="text-sm text-gray-500">{client.domain}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      client.plan === 'Enterprise' ? 'bg-purple-100 text-purple-800' :
                      client.plan === 'Premium' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {client.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      client.status === 'active' ? 'bg-green-100 text-green-800' :
                      client.status === 'trial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {client.status === 'active' ? 'Ativo' : 
                       client.status === 'trial' ? 'Trial' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(client.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.users}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.restaurants}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm ${
                      client.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {client.growth > 0 ? '+' : ''}{client.growth}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(client.lastActivity), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Todos os Alertas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Todos os Alertas</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analyticsData.alerts.map(alert => {
              const IconComponent = getAlertIcon(alert.type);
              return (
                <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                  <div className="flex items-start space-x-3">
                    <IconComponent className="w-5 h-5 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{alert.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                          alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {alert.priority === 'high' ? 'Alta' :
                           alert.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{alert.message}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {format(alert.timestamp, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaaSAnalytics;
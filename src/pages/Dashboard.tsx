import React from 'react';
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Star,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useData } from '../contexts/DataContext';
import MetricCard from '../components/ui/MetricCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function Dashboard() {
  const { dashboardData, customers, campaigns } = useData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu restaurante</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Faturamento Total"
          value={formatCurrency(dashboardData.totalRevenue)}
          change="+12.5% vs mês anterior"
          changePositive={true}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <MetricCard
          title="Faturamento Hoje"
          value={formatCurrency(dashboardData.dailyRevenue)}
          change="+8.2% vs ontem"
          changePositive={true}
          icon={TrendingUp}
          iconColor="text-blue-600"
        />
        <MetricCard
          title="Ticket Médio"
          value={formatCurrency(dashboardData.avgTicket)}
          change="+5.1% vs mês anterior"
          changePositive={true}
          icon={ShoppingBag}
          iconColor="text-purple-600"
        />
        <MetricCard
          title="Clientes Ativos"
          value={`${dashboardData.activeCustomers}/${dashboardData.totalCustomers}`}
          change="2 novos hoje"
          changePositive={true}
          icon={Users}
          iconColor="text-orange-600"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faturamento Mensal */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Faturamento Mensal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value)), 'Faturamento']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Evolução de Clientes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução de Clientes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value) => [value, 'Clientes']}
                labelStyle={{ color: '#374151' }}
              />
              <Line 
                type="monotone" 
                dataKey="customers" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seções Adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Produtos Mais Vendidos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos Mais Vendidos</h3>
          <div className="space-y-3">
            {dashboardData.topProducts.map((product: any, index: number) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(product.price)}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-500">{product.popularity}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clientes Recentes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clientes Recentes</h3>
          <div className="space-y-3">
            {customers.slice(0, 5).map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">
                      {format(customer.lastVisit, 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  customer.level === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                  customer.level === 'silver' ? 'bg-gray-100 text-gray-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {customer.level}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas Campanhas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimas Campanhas</h3>
          <div className="space-y-3">
            {campaigns.slice(0, 5).map((campaign) => (
              <div key={campaign.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    campaign.status === 'active' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status === 'sent' ? 'Enviada' :
                     campaign.status === 'scheduled' ? 'Agendada' :
                     campaign.status === 'active' ? 'Ativa' : 'Rascunho'}
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{campaign.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(campaign.createdAt, 'dd/MM', { locale: ptBR })}</span>
                  </div>
                </div>
                {campaign.status === 'sent' && (
                  <div className="mt-2 text-xs text-gray-600">
                    {campaign.sentCount} enviadas • {campaign.openRate}% abertura
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
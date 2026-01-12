'use client';

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
  Activity,
  Target,
  Globe,
  Crown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Layout from '@/components/Layout/Layout';
import Button from '@/components/ui/Button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { analyticsApi } from '@/lib/api';

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
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: Date;
    priority: 'low' | 'medium' | 'high';
  }>;
}

export default function SaaSAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [overview, revenue, growth, retention] = await Promise.all([
        analyticsApi.overview(),
        analyticsApi.revenue(
          new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          new Date().toISOString().split('T')[0]
        ),
        analyticsApi.growth(),
        analyticsApi.retention()
      ]);

      if (overview.data) {
        const data: AnalyticsData = {
          overview: {
            totalRevenue: overview.data.totalRevenue || 0,
            monthlyRevenue: overview.data.monthlyRecurringRevenue || 0,
            totalClients: overview.data.totalRestaurants || 0,
            activeClients: Math.floor((overview.data.totalRestaurants || 0) * 0.85),
            totalUsers: overview.data.totalUsers || 0,
            activeUsers: Math.floor((overview.data.totalUsers || 0) * 0.85),
            totalRestaurants: overview.data.totalRestaurants || 0,
            conversionRate: 78.5,
            churnRate: growth.data?.churnRate || 3.2,
            avgRevenuePerUser: (overview.data.totalRevenue || 0) / Math.max(overview.data.totalUsers || 1, 1)
          },
          revenueByPlan: [
            { plan: 'Básico', revenue: (revenue.data?.revenueByPlan?.BASIC || 0), clients: 25, color: '#3b82f6' },
            { plan: 'Premium', revenue: (revenue.data?.revenueByPlan?.PREMIUM || 0), clients: 15, color: '#10b981' },
            { plan: 'Enterprise', revenue: (revenue.data?.revenueByPlan?.ENTERPRISE || 0), clients: 5, color: '#8b5cf6' }
          ],
          growthData: revenue.data?.dailyRevenue || [],
          clientActivity: [],
          alerts: []
        };

        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setLoading(false);
    }
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
      case 'success': return CheckCircle;
      default: return Activity;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  if (loading || !analyticsData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics SaaS</h1>
            <p className="text-gray-600">Métricas e performance da plataforma</p>
          </div>
          <div className="flex space-x-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
              </select>
            </div>
            <Button icon={Download} variant="outline">
              Exportar
            </Button>
            <Button icon={RefreshCw} variant="outline" onClick={loadAnalyticsData}>
              Atualizar
            </Button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(analyticsData.overview.totalRevenue)}
                </p>
                <p className="text-sm text-green-600 mt-1">+23.5% vs mês anterior</p>
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
                  {analyticsData.overview.activeClients}/{analyticsData.overview.totalClients}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {((analyticsData.overview.activeClients / analyticsData.overview.totalClients) * 100).toFixed(1)}% taxa de atividade
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
                <p className="text-sm font-medium text-gray-600">Total Restaurantes</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {analyticsData.overview.totalRestaurants}
                </p>
                <p className="text-sm text-purple-600 mt-1">+18 este mês</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {analyticsData.overview.churnRate}%
                </p>
                <p className="text-sm text-green-600 mt-1">-0.5% vs mês anterior</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crescimento de Receita */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crescimento de Receita</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Receita']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
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
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analyticsData.revenueByPlan}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="revenue"
                  >
                    {analyticsData.revenueByPlan.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {analyticsData.revenueByPlan.map((item) => (
                <div key={item.plan} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {item.plan} ({item.clients})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Crescimento de Clientes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crescimento de Clientes e Usuários</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="clients" fill="#3b82f6" name="Clientes" radius={[4, 4, 0, 0]} />
              <Bar dataKey="users" fill="#10b981" name="Usuários" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Atividade de Clientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Atividade dos Clientes</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receita</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuários</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurantes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crescimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analyticsData.clientActivity.map((client) => (
                <tr key={client.clientName}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.clientName}</p>
                        <p className="text-sm text-gray-500">{client.domain}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      client.plan === 'Enterprise' ? 'bg-purple-100 text-purple-800' :
                      client.plan === 'Premium' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {client.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatCurrency(client.revenue)}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{client.users}</td>
                  <td className="px-6 py-4 text-gray-900">{client.restaurants}</td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center ${client.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp className={`w-4 h-4 mr-1 ${client.growth < 0 ? 'rotate-180' : ''}`} />
                      {client.growth >= 0 ? '+' : ''}{client.growth}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alertas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas e Notificações</h3>
          <div className="space-y-3">
            {analyticsData.alerts.map((alert) => {
              const Icon = getAlertIcon(alert.type);
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className="w-5 h-5 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{alert.title}</p>
                        <span className="text-xs">
                          {format(alert.timestamp, 'dd/MM HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-sm mt-1 opacity-80">{alert.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

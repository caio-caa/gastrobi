'use client';

import React, { useState } from 'react';
import { 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingBag
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useData } from '@/contexts/DataContext';
import { useMenu } from '@/contexts/MenuContext';
import Layout from '@/components/Layout/Layout';
import Button from '@/components/ui/Button';

export default function ReportsPage() {
  const { customers, dashboardData, monthlyData, topProducts, recentOrders } = useData();
  const { products } = useMenu();
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('revenue');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calculate category data from products
  const categoryData = products.reduce((acc: any[], product) => {
    const existing = acc.find(item => item.category === product.category);
    if (existing) {
      existing.count += 1;
      existing.revenue += product.price;
    } else {
      acc.push({
        category: product.category || 'Outros',
        count: 1,
        revenue: product.price
      });
    }
    return acc;
  }, []);

  // Customer level data from API
  const levelData = [
    { level: 'Bronze', count: customers.filter(c => c.level === 'bronze').length, color: '#f97316' },
    { level: 'Silver', count: customers.filter(c => c.level === 'silver').length, color: '#6b7280' },
    { level: 'Gold', count: customers.filter(c => c.level === 'gold').length, color: '#eab308' },
    { level: 'Platinum', count: customers.filter(c => c.level === 'platinum').length, color: '#7c3aed' }
  ].filter(item => item.count > 0);

  // Use monthlyData from API for charts
  const chartData = monthlyData.map(item => ({
    date: item.month,
    revenue: item.revenue,
    orders: item.orders,
    customers: item.customers
  }));

  // Get totals from dashboardData or calculate from monthlyData
  const totalRevenue = dashboardData?.revenue?.total || monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = dashboardData?.orders?.total || monthlyData.reduce((sum, item) => sum + item.orders, 0);
  const totalCustomers = dashboardData?.customers?.total || customers.length;
  const avgTicket = dashboardData?.averageTicket?.value || (totalOrders > 0 ? totalRevenue / totalOrders : 0);

  const revenueChange = dashboardData?.revenue?.previousPeriodChange || 0;
  const ordersChange = dashboardData?.orders?.previousPeriodChange || 0;
  const customersChange = dashboardData?.customers?.previousPeriodChange || 0;
  const ticketChange = dashboardData?.averageTicket?.previousPeriodChange || 0;

  const handleExport = () => {
    alert('Relatório exportado com sucesso!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Análise detalhada do desempenho do seu restaurante</p>
          </div>
          <div className="flex space-x-3">
            <Button icon={Download} variant="outline" onClick={handleExport}>
              Exportar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="revenue">Faturamento</option>
                <option value="products">Produtos</option>
                <option value="customers">Clientes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Métricas Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Faturamento Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className={`text-sm mt-1 ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}% vs período anterior
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {totalOrders}
                </p>
                <p className={`text-sm mt-1 ${ordersChange >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {ordersChange >= 0 ? '+' : ''}{ordersChange.toFixed(1)}% vs período anterior
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Únicos</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {totalCustomers}
                </p>
                <p className={`text-sm mt-1 ${customersChange >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                  {customersChange >= 0 ? '+' : ''}{customersChange.toFixed(1)}% vs período anterior
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
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(avgTicket)}
                </p>
                <p className={`text-sm mt-1 ${ticketChange >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
                  {ticketChange >= 0 ? '+' : ''}{ticketChange.toFixed(1)}% vs período anterior
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Faturamento Mensal
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Faturamento']}
                  labelStyle={{ color: '#374151' }}
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

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita por Categoria</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" stroke="#6b7280" />
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

        {/* Gráficos Secundários */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clientes por Nível</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={levelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {levelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {levelData.map((item) => (
                <div key={item.level} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {item.level} ({item.count})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos Mais Vendidos</h3>
            <div className="space-y-4">
              {topProducts.length > 0 ? topProducts.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
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
                      <p className="font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                      <p className="text-xs text-gray-500">{product.salesCount} vendas</p>
                    </div>
                  </div>
                )) : (
                <p className="text-gray-500 text-center py-4">Nenhum produto vendido ainda</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabela Detalhada */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Relatório Detalhado por Produto</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Custo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lucro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {products.length > 0 ? products.map((product) => {
                  const profit = product.price - product.cost;
                  return (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(product.cost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={profit > 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(profit)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.isActive && product.isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive && product.isAvailable ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Nenhum produto cadastrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

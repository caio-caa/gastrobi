'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Building2,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Ban,
  ArrowUpRight,
  ArrowDownRight,
  X
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Layout from '@/components/Layout/Layout';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { billingApi } from '@/lib/api';

interface Subscription {
  id: string;
  restaurantId: string;
  restaurantName: string;
  plan: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'TRIAL';
  startDate: string;
  nextBillingDate: string;
  amount: number;
}

interface Payment {
  id: string;
  restaurantId: string;
  restaurantName: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  paidAt: string | null;
  createdAt: string;
  method: string;
  invoiceNumber: string;
}

interface BillingMetrics {
  mrr: number;
  mrrGrowth: number;
  arr: number;
  totalRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  averageRevenuePerUser: number;
}

export default function AdminBillingPage() {
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'payments'>('subscriptions');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [metrics, setMetrics] = useState<BillingMetrics>({
    mrr: 0,
    mrrGrowth: 0,
    arr: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    overduePayments: 0,
    averageRevenuePerUser: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subsResponse, paymentsResponse] = await Promise.all([
        billingApi.listSubscriptions({ take: 50 }),
        billingApi.listPayments({ take: 50 })
      ]);

      if (subsResponse.data && Array.isArray(subsResponse.data.data)) {
        setSubscriptions(subsResponse.data.data);
      }

      if (paymentsResponse.data && Array.isArray(paymentsResponse.data.data)) {
        setPayments(paymentsResponse.data.data);
      }

      // Calcular métricas
      if (subsResponse.data && paymentsResponse.data) {
        const activeSubscriptions = (subsResponse.data.data || []).filter((s: Subscription) => s.status === 'ACTIVE');
        const mrr = activeSubscriptions.reduce((acc: number, s: Subscription) => acc + s.amount, 0);
        const paidPayments = (paymentsResponse.data.data || []).filter((p: Payment) => p.status === 'PAID');
        const totalRevenue = paidPayments.reduce((acc: number, p: Payment) => acc + p.amount, 0);

        setMetrics({
          mrr,
          mrrGrowth: 12.5,
          arr: mrr * 12,
          totalRevenue,
          pendingPayments: (paymentsResponse.data.data || []).filter((p: Payment) => p.status === 'PENDING').length,
          overduePayments: (subsResponse.data.data || []).filter((s: Subscription) => s.status === 'PAST_DUE').length,
          averageRevenuePerUser: mrr / Math.max(activeSubscriptions.length, 1)
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados de faturamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = (sub.restaurantName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesPlan = planFilter === 'all' || sub.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = (payment.restaurantName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (payment.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'TRIAL':
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'PAST_DUE':
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACTIVE: 'Ativa',
      TRIAL: 'Trial',
      PAST_DUE: 'Atrasada',
      CANCELLED: 'Cancelada',
      PAID: 'Pago',
      PENDING: 'Pendente',
      FAILED: 'Falhou',
      REFUNDED: 'Reembolsado'
    };
    return labels[status] || status;
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

  const handleChangePlan = async (subscriptionId: string, newPlan: string) => {
    // API: PATCH /admin/billing/subscriptions/:restaurantId/plan
    setSubscriptions(subscriptions.map(s =>
      s.id === subscriptionId ? { ...s, plan: newPlan as any } : s
    ));
    setActionMenu(null);
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (confirm('Tem certeza que deseja cancelar esta assinatura?')) {
      // API: POST /admin/billing/subscriptions/:restaurantId/cancel
      setSubscriptions(subscriptions.map(s =>
        s.id === subscriptionId ? { ...s, status: 'CANCELLED' as const } : s
      ));
    }
    setActionMenu(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Faturamento</h1>
            <p className="text-gray-600">Gerencie assinaturas e pagamentos da plataforma</p>
          </div>
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">MRR</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.mrr)}</p>
              </div>
              <div className={`flex items-center text-sm ${metrics.mrrGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.mrrGrowth >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
                {Math.abs(metrics.mrrGrowth)}%
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ARR</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(metrics.arr)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-xl font-bold text-orange-600">{metrics.pendingPayments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Atrasados</p>
                <p className="text-xl font-bold text-red-600">{metrics.overduePayments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'subscriptions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Assinaturas
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pagamentos
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={activeTab === 'subscriptions' ? 'Buscar por restaurante...' : 'Buscar por restaurante ou fatura...'}
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
                {activeTab === 'subscriptions' ? (
                  <>
                    <option value="ACTIVE">Ativas</option>
                    <option value="TRIAL">Trial</option>
                    <option value="PAST_DUE">Atrasadas</option>
                    <option value="CANCELLED">Canceladas</option>
                  </>
                ) : (
                  <>
                    <option value="PAID">Pagos</option>
                    <option value="PENDING">Pendentes</option>
                    <option value="FAILED">Falhou</option>
                    <option value="REFUNDED">Reembolsados</option>
                  </>
                )}
              </select>
              {activeTab === 'subscriptions' && (
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os Planos</option>
                  <option value="BASIC">Básico</option>
                  <option value="PREMIUM">Premium</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="overflow-x-auto">
            {activeTab === 'subscriptions' ? (
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
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Próxima Cobrança
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Carregando...
                      </td>
                    </tr>
                  ) : filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Nenhuma assinatura encontrada
                      </td>
                    </tr>
                  ) : (
                    filteredSubscriptions.map((subscription) => (
                      <tr key={subscription.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {(subscription.restaurantName ?? '').charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{subscription.restaurantName ?? 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(subscription.plan)}`}>
                            {subscription.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subscription.status)}`}>
                            {getStatusLabel(subscription.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(subscription.amount)}/mês
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {subscription.nextBillingDate ? format(new Date(subscription.nextBillingDate), "dd/MM/yyyy", { locale: ptBR }) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative">
                            <button
                              onClick={() => setActionMenu(actionMenu === subscription.id ? null : subscription.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <MoreHorizontal className="w-5 h-5 text-gray-400" />
                            </button>
                            {actionMenu === subscription.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <button
                                  onClick={() => {
                                    setSelectedSubscription(subscription);
                                    setShowDetailModal(true);
                                    setActionMenu(null);
                                  }}
                                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver Detalhes
                                </button>
                                <button
                                  onClick={() => handleChangePlan(subscription.id, subscription.plan === 'BASIC' ? 'PREMIUM' : 'BASIC')}
                                  className="w-full flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                >
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Alterar Plano
                                </button>
                                {subscription.status !== 'CANCELLED' && (
                                  <button
                                    onClick={() => handleCancelSubscription(subscription.id)}
                                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <Ban className="w-4 h-4 mr-2" />
                                    Cancelar
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fatura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restaurante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Carregando...
                      </td>
                    </tr>
                  ) : filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Nenhum pagamento encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.invoiceNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.restaurantName ?? 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                            {getStatusLabel(payment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.paidAt && !isNaN(new Date(payment.paidAt).getTime())
                            ? format(new Date(payment.paidAt), "dd/MM/yyyy HH:mm", { locale: ptBR })
                            : payment.createdAt && !isNaN(new Date(payment.createdAt).getTime())
                            ? format(new Date(payment.createdAt), "dd/MM/yyyy", { locale: ptBR })
                            : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Detalhes da Assinatura"
        >
          {selectedSubscription && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                  {(selectedSubscription.restaurantName ?? '').charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedSubscription.restaurantName ?? 'N/A'}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(selectedSubscription.plan)}`}>
                    {selectedSubscription.plan}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedSubscription.status)}`}>
                    {getStatusLabel(selectedSubscription.status)}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Valor Mensal</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(selectedSubscription.amount)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Início da Assinatura</span>
                  <span className="font-medium">{selectedSubscription.startDate && !isNaN(new Date(selectedSubscription.startDate).getTime()) ? format(new Date(selectedSubscription.startDate), "dd/MM/yyyy", { locale: ptBR }) : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Próxima Cobrança</span>
                  <span className="font-medium">{selectedSubscription.nextBillingDate && !isNaN(new Date(selectedSubscription.nextBillingDate).getTime()) ? format(new Date(selectedSubscription.nextBillingDate), "dd/MM/yyyy", { locale: ptBR }) : 'N/A'}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                  Fechar
                </Button>
                <Button onClick={() => handleChangePlan(selectedSubscription.id, 'ENTERPRISE')}>
                  Upgrade para Enterprise
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}

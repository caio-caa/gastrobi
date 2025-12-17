'use client';

import React, { useState } from 'react';
import { 
  Palette, 
  Globe, 
  Settings, 
  Save, 
  Eye, 
  Upload,
  Copy,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  Users,
  Building2,
  Mail,
  Phone,
  Plus,
  Edit,
  Crown,
  Star,
  Layers
} from 'lucide-react';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import Layout from '@/components/Layout/Layout';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface WhiteLabelClient {
  id: string;
  name: string;
  domain: string;
  customDomain?: string;
  status: 'active' | 'inactive' | 'pending';
  plan: 'basic' | 'premium' | 'enterprise';
  createdAt: Date;
  lastAccess: Date;
  config: any;
  metrics: {
    users: number;
    restaurants: number;
    revenue: number;
  };
}

export default function WhiteLabelAdminPage() {
  const { config, updateConfig } = useWhiteLabel();
  const [activeTab, setActiveTab] = useState('clients');
  const [showPreview, setShowPreview] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedUrl, setCopiedUrl] = useState('');

  const [formData, setFormData] = useState(config);
  const [clients] = useState<WhiteLabelClient[]>([
    {
      id: '1',
      name: 'RestauranteSystem',
      domain: 'restaurantesystem.com',
      customDomain: 'sistema.restaurantesystem.com',
      status: 'active',
      plan: 'enterprise',
      createdAt: new Date('2024-01-15'),
      lastAccess: new Date(),
      config: {
        brandName: 'RestauranteSystem',
        primaryColor: '#dc2626',
        secondaryColor: '#991b1b'
      },
      metrics: {
        users: 45,
        restaurants: 12,
        revenue: 8940
      }
    },
    {
      id: '2',
      name: 'FoodTech Pro',
      domain: 'foodtech.pro',
      status: 'active',
      plan: 'premium',
      createdAt: new Date('2024-02-20'),
      lastAccess: new Date(Date.now() - 86400000),
      config: {
        brandName: 'FoodTech Pro',
        primaryColor: '#059669',
        secondaryColor: '#047857'
      },
      metrics: {
        users: 23,
        restaurants: 8,
        revenue: 2910
      }
    },
    {
      id: '3',
      name: 'GestãoFood',
      domain: 'gestaofood.com.br',
      status: 'pending',
      plan: 'basic',
      createdAt: new Date('2024-03-10'),
      lastAccess: new Date(Date.now() - 172800000),
      config: {
        brandName: 'GestãoFood',
        primaryColor: '#7c3aed',
        secondaryColor: '#5b21b6'
      },
      metrics: {
        users: 5,
        restaurants: 2,
        revenue: 470
      }
    }
  ]);

  const [newClient, setNewClient] = useState({
    name: '',
    domain: '',
    customDomain: '',
    plan: 'basic' as const,
    brandName: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    supportEmail: '',
    supportPhone: ''
  });

  const tabs = [
    { id: 'clients', name: 'Clientes White Label', icon: Users },
    { id: 'templates', name: 'Templates', icon: Layers },
    { id: 'domains', name: 'Domínios', icon: Globe },
    { id: 'settings', name: 'Configurações', icon: Settings }
  ];

  const plans = [
    { id: 'basic', name: 'Básico', price: 297, color: 'blue' },
    { id: 'premium', name: 'Premium', price: 497, color: 'green' },
    { id: 'enterprise', name: 'Enterprise', price: 997, color: 'purple' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      default: return 'Inativo';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSave = () => {
    updateConfig(formData);
    alert('Configurações salvas com sucesso!');
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administração White Label</h1>
            <p className="text-gray-600">Gerencie clientes e configurações da plataforma SaaS</p>
          </div>
          <div className="flex space-x-3">
            <Button icon={Eye} variant="outline" onClick={() => setShowPreview(true)}>
              Pré-visualizar
            </Button>
            <Button icon={Plus} onClick={() => setShowClientModal(true)}>
              Novo Cliente
            </Button>
          </div>
        </div>

        {/* Métricas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{clients.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {clients.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(clients.reduce((sum, c) => sum + c.metrics.revenue, 0))}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Restaurantes</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {clients.reduce((sum, c) => sum + c.metrics.restaurants, 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-100">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 pb-3 px-1 font-medium ${
                  activeTab === tab.id 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'clients' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Domínio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Métricas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clients.map(client => (
                  <tr key={client.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: client.config.primaryColor }}
                        >
                          <span className="text-white font-bold">
                            {client.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.config.brandName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{client.domain}</p>
                        {client.customDomain && (
                          <p className="text-xs text-gray-500">{client.customDomain}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(client.plan)}`}>
                        {client.plan.charAt(0).toUpperCase() + client.plan.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                        {getStatusText(client.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{client.metrics.users} usuários</p>
                        <p className="text-gray-500">{client.metrics.restaurants} restaurantes</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800"
                          onClick={() => copyUrl(`https://${client.domain}`)}
                        >
                          {copiedUrl === `https://${client.domain}` ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Moderno', 'Clássico', 'Minimalista'].map((template, index) => (
              <div key={template} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Layers className="w-12 h-12 text-white" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{template}</h3>
                  <p className="text-sm text-gray-500 mt-1">Template {template.toLowerCase()} para restaurantes</p>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    Usar Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'domains' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Configuração de Domínios</h3>
            <div className="space-y-4">
              {clients.map(client => (
                <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.domain}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {client.status === 'active' ? 'DNS Configurado' : 'Pendente'}
                    </span>
                    <Button size="sm" variant="outline">Configurar</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Configurações Globais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Plataforma
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor Primária
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de Suporte
                </label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone de Suporte
                </label>
                <input
                  type="tel"
                  value={formData.supportPhone}
                  onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button icon={Save} onClick={handleSave}>
                Salvar Configurações
              </Button>
            </div>
          </div>
        )}

        {/* Modal Preview */}
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Pré-visualização"
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-2 rounded-lg ${previewDevice === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Monitor className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-2 rounded-lg ${previewDevice === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Tablet className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-2 rounded-lg ${previewDevice === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Smartphone className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
              <div 
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                  previewDevice === 'desktop' ? 'w-full' : 
                  previewDevice === 'tablet' ? 'w-3/4' : 'w-1/2'
                }`}
                style={{ borderTop: `4px solid ${formData.primaryColor}` }}
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold" style={{ color: formData.primaryColor }}>
                    {formData.brandName}
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Pré-visualização da plataforma white label
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* Modal Novo Cliente */}
        <Modal
          isOpen={showClientModal}
          onClose={() => setShowClientModal(false)}
          title="Novo Cliente White Label"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Domínio</label>
                <input
                  type="text"
                  value={newClient.domain}
                  onChange={(e) => setNewClient({ ...newClient, domain: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="exemplo.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plano</label>
              <div className="grid grid-cols-3 gap-4">
                {plans.map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => setNewClient({ ...newClient, plan: plan.id as any })}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      newClient.plan === plan.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium">{plan.name}</p>
                    <p className="text-sm text-gray-500">R$ {plan.price}/mês</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <Button variant="ghost" onClick={() => setShowClientModal(false)}>
                Cancelar
              </Button>
              <Button>
                Criar Cliente
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}

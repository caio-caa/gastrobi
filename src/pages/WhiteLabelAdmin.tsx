import React, { useState } from 'react';
import { 
  Palette, 
  Globe, 
  Settings, 
  Save, 
  Eye, 
  Upload,
  Download,
  Copy,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  Code,
  Zap,
  Shield,
  Users,
  Building2,
  Mail,
  Phone,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Package,
  Crown,
  Star,
  Layers
} from 'lucide-react';
import { useWhiteLabel } from '../contexts/WhiteLabelContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

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

function WhiteLabelAdmin() {
  const { config, updateConfig } = useWhiteLabel();
  const [activeTab, setActiveTab] = useState('clients');
  const [showPreview, setShowPreview] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedUrl, setCopiedUrl] = useState('');
  const [selectedClient, setSelectedClient] = useState<WhiteLabelClient | null>(null);

  const [formData, setFormData] = useState(config);
  const [clients, setClients] = useState<WhiteLabelClient[]>([
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
    { id: 'analytics', name: 'Analytics', icon: Zap },
    { id: 'settings', name: 'Configurações', icon: Settings }
  ];

  const plans = [
    { id: 'basic', name: 'Básico', price: 297, color: 'blue' },
    { id: 'premium', name: 'Premium', price: 497, color: 'green' },
    { id: 'enterprise', name: 'Enterprise', price: 997, color: 'purple' }
  ];

  const handleSave = () => {
    updateConfig(formData);
    alert('Configurações salvas com sucesso!');
  };

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${formData.brandName.toLowerCase().replace(/\s+/g, '-')}-config.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string);
          setFormData({ ...formData, ...importedConfig });
        } catch (error) {
          alert('Erro ao importar configuração. Verifique se o arquivo é válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  const generateWhiteLabelUrl = (clientId: string) => {
    return `${window.location.origin}?client=${clientId}`;
  };

  const handleCreateClient = () => {
    const client: WhiteLabelClient = {
      id: Date.now().toString(),
      name: newClient.name,
      domain: newClient.domain,
      customDomain: newClient.customDomain || undefined,
      status: 'pending',
      plan: newClient.plan,
      createdAt: new Date(),
      lastAccess: new Date(),
      config: {
        brandName: newClient.brandName,
        primaryColor: newClient.primaryColor,
        secondaryColor: newClient.secondaryColor,
        supportEmail: newClient.supportEmail,
        supportPhone: newClient.supportPhone
      },
      metrics: {
        users: 0,
        restaurants: 0,
        revenue: 0
      }
    };

    setClients([...clients, client]);
    setShowClientModal(false);
    setNewClient({
      name: '',
      domain: '',
      customDomain: '',
      plan: 'basic',
      brandName: '',
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
      supportEmail: '',
      supportPhone: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-green-100 text-green-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalRevenue = clients.reduce((sum, client) => sum + client.metrics.revenue, 0);
  const totalUsers = clients.reduce((sum, client) => sum + client.metrics.users, 0);
  const totalRestaurants = clients.reduce((sum, client) => sum + client.metrics.restaurants, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administração White Label</h1>
          <p className="text-gray-600">Gerencie clientes, templates e configurações white label</p>
        </div>
        <div className="flex space-x-3">
          <Button icon={RefreshCw} variant="outline" onClick={() => window.location.reload()}>
            Atualizar
          </Button>
          <Button icon={Download} variant="outline" onClick={handleExportConfig}>
            Exportar
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
              <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {clients.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuários Finais</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalUsers}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <UserCheck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Restaurantes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalRestaurants}</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
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

      {/* Clientes Tab */}
      {activeTab === 'clients' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Clientes White Label</h3>
              <Button icon={Plus} onClick={() => setShowClientModal(true)}>
                Novo Cliente
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Domínio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receita</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuários</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último Acesso</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: client.config.primaryColor }}
                          >
                            <span className="text-sm font-bold text-white">
                              {client.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                            <div className="text-sm text-gray-500">{client.config.brandName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{client.domain}</div>
                          {client.customDomain && (
                            <div className="text-sm text-gray-500">{client.customDomain}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(client.plan)}`}>
                          {client.plan.charAt(0).toUpperCase() + client.plan.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                          {client.status === 'active' ? 'Ativo' : 
                           client.status === 'inactive' ? 'Inativo' : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(client.metrics.revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.metrics.users}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(client.lastAccess, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => window.open(generateWhiteLabelUrl(client.domain), '_blank')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedClient(client);
                              setFormData(client.config);
                              setShowConfigModal(true);
                            }}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedClient(client);
                              setShowPreview(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Eye className="w-4 h-4" />
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

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Template Moderno',
                description: 'Design clean e minimalista',
                preview: '#3b82f6',
                features: ['Responsivo', 'Dark Mode', 'Animações']
              },
              {
                name: 'Template Clássico',
                description: 'Visual tradicional e profissional',
                preview: '#059669',
                features: ['Estável', 'Compatível', 'Acessível']
              },
              {
                name: 'Template Premium',
                description: 'Design avançado com recursos extras',
                preview: '#7c3aed',
                features: ['Customizável', 'Interativo', 'Premium']
              }
            ].map((template, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div 
                  className="h-32 flex items-center justify-center"
                  style={{ backgroundColor: template.preview }}
                >
                  <div className="text-white text-center">
                    <Layers className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">{template.name}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.features.map((feature, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1">
                      Usar Template
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Domínios Tab */}
      {activeTab === 'domains' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Configuração de Domínios</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Domínios Ativos</h4>
                  <div className="space-y-2">
                    {clients.map(client => (
                      <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{client.domain}</p>
                          {client.customDomain && (
                            <p className="text-sm text-gray-600">{client.customDomain}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${
                            client.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></span>
                          <button
                            onClick={() => copyToClipboard(generateWhiteLabelUrl(client.domain))}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Configuração DNS</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Para configurar um domínio customizado:</p>
                    <ol className="text-sm text-gray-700 space-y-1">
                      <li>1. Adicione um registro CNAME no seu DNS</li>
                      <li>2. Aponte para: <code className="bg-gray-200 px-1 rounded">gastrobi.netlify.app</code></li>
                      <li>3. Aguarde a propagação (até 24h)</li>
                      <li>4. Configure SSL automático</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Cliente</h3>
              <div className="space-y-4">
                {clients.map(client => (
                  <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: client.config.primaryColor }}
                      >
                        <span className="text-xs font-bold text-white">
                          {client.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-600">{client.metrics.users} usuários</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(client.metrics.revenue)}</p>
                      <p className="text-sm text-gray-600">{client.metrics.restaurants} restaurantes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Planos</h3>
              <div className="space-y-4">
                {plans.map(plan => {
                  const count = clients.filter(c => c.plan === plan.id).length;
                  const percentage = clients.length > 0 ? (count / clients.length) * 100 : 0;
                  
                  return (
                    <div key={plan.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{plan.name}</span>
                        <span className="text-sm text-gray-600">{count} clientes</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-${plan.color}-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Configurações Globais</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Configurações de Segurança</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">SSL Automático</p>
                        <p className="text-sm text-gray-600">Certificados SSL para domínios customizados</p>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Backup Automático</p>
                        <p className="text-sm text-gray-600">Backup diário das configurações</p>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Limites da Plataforma</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Máximo de clientes</span>
                      <span className="font-bold">100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Domínios customizados</span>
                      <span className="font-bold">Ilimitados</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Templates disponíveis</span>
                      <span className="font-bold">15</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Cliente */}
      <Modal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        title="Novo Cliente White Label"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Cliente
              </label>
              <input
                type="text"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: RestauranteSystem"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domínio Principal
              </label>
              <input
                type="text"
                value={newClient.domain}
                onChange={(e) => setNewClient({ ...newClient, domain: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="exemplo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domínio Customizado (Opcional)
            </label>
            <input
              type="text"
              value={newClient.customDomain}
              onChange={(e) => setNewClient({ ...newClient, customDomain: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="sistema.exemplo.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Marca
              </label>
              <input
                type="text"
                value={newClient.brandName}
                onChange={(e) => setNewClient({ ...newClient, brandName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome que aparecerá no sistema"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plano
              </label>
              <select
                value={newClient.plan}
                onChange={(e) => setNewClient({ ...newClient, plan: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="basic">Básico - R$ 297/mês</option>
                <option value="premium">Premium - R$ 497/mês</option>
                <option value="enterprise">Enterprise - R$ 997/mês</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Primária
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={newClient.primaryColor}
                  onChange={(e) => setNewClient({ ...newClient, primaryColor: e.target.value })}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={newClient.primaryColor}
                  onChange={(e) => setNewClient({ ...newClient, primaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Secundária
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={newClient.secondaryColor}
                  onChange={(e) => setNewClient({ ...newClient, secondaryColor: e.target.value })}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={newClient.secondaryColor}
                  onChange={(e) => setNewClient({ ...newClient, secondaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail de Suporte
              </label>
              <input
                type="email"
                value={newClient.supportEmail}
                onChange={(e) => setNewClient({ ...newClient, supportEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="suporte@exemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone de Suporte
              </label>
              <input
                type="tel"
                value={newClient.supportPhone}
                onChange={(e) => setNewClient({ ...newClient, supportPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setShowClientModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateClient}>
              Criar Cliente
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Configuração do Cliente */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title={`Configurar ${selectedClient?.name}`}
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Marca
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL do Logo
              </label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Primária
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Secundária
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setShowConfigModal(false)}>
              Cancelar
            </Button>
            <Button icon={Eye} variant="outline" onClick={() => setShowPreview(true)}>
              Preview
            </Button>
            <Button icon={Save} onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Preview */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Preview White Label"
        size="xl"
      >
        <div className="space-y-4">
          {/* Device Selector */}
          <div className="flex items-center space-x-2 border-b pb-4">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-2 rounded ${previewDevice === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <Monitor className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPreviewDevice('tablet')}
              className={`p-2 rounded ${previewDevice === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <Tablet className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <Smartphone className="w-5 h-5" />
            </button>
          </div>

          {/* Preview Frame */}
          <div className="flex justify-center">
            <div 
              className={`border border-gray-300 rounded-lg overflow-hidden ${
                previewDevice === 'desktop' ? 'w-full h-96' :
                previewDevice === 'tablet' ? 'w-96 h-72' :
                'w-80 h-96'
              }`}
            >
              <div 
                className="h-full bg-white"
                style={{ 
                  '--color-primary': formData.primaryColor,
                  '--color-secondary': formData.secondaryColor,
                  '--color-accent': formData.accentColor,
                } as React.CSSProperties}
              >
                {/* Preview Header */}
                <div 
                  className="p-4 text-white flex items-center justify-between"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  <div className="flex items-center space-x-2">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo" className="w-8 h-8" />
                    ) : (
                      <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                        <span className="text-sm font-bold">{formData.brandName.charAt(0)}</span>
                      </div>
                    )}
                    <span className="font-bold">{formData.brandName}</span>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">Sistema de Gestão para Restaurantes</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Gerencie seu restaurante com eficiência usando nossa plataforma completa.
                  </p>
                  
                  <div className="space-y-2">
                    {formData.features.pos && (
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: formData.accentColor }}></div>
                        <span>Sistema POS</span>
                      </div>
                    )}
                    {formData.features.loyalty && (
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: formData.accentColor }}></div>
                        <span>Programa de Fidelidade</span>
                      </div>
                    )}
                    {formData.features.campaigns && (
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: formData.accentColor }}></div>
                        <span>Campanhas de Marketing</span>
                      </div>
                    )}
                  </div>

                  <button
                    className="mt-4 px-4 py-2 text-white rounded-lg text-sm font-medium"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    Começar Agora
                  </button>
                </div>

                {/* Preview Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gray-900 text-white text-xs text-center">
                  {formData.footerText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default WhiteLabelAdmin;
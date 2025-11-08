import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Smartphone,
  Mail,
  MessageSquare,
  Save,
  Plus,
  Trash2,
  Edit,
  MapPin,
  Clock,
  Globe,
  Camera,
  Key,
  Smartphone as Phone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

function Settings() {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('restaurant');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [restaurantData, setRestaurantData] = useState({
    name: user?.currentRestaurant.name || '',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    phone: '(11) 99999-9999',
    email: 'contato@restaurante.com',
    cnpj: '12.345.678/0001-90',
    website: 'www.restaurante.com.br',
    description: 'Restaurante especializado em culinária italiana com ambiente aconchegante e pratos tradicionais.',
    openingHours: {
      monday: { open: '11:00', close: '23:00', closed: false },
      tuesday: { open: '11:00', close: '23:00', closed: false },
      wednesday: { open: '11:00', close: '23:00', closed: false },
      thursday: { open: '11:00', close: '23:00', closed: false },
      friday: { open: '11:00', close: '23:00', closed: false },
      saturday: { open: '11:00', close: '23:00', closed: false },
      sunday: { open: '11:00', close: '22:00', closed: false }
    },
    socialMedia: {
      instagram: '@restaurante',
      facebook: 'restaurante',
      whatsapp: '11999999999'
    }
  });

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(11) 98888-7777',
    position: 'Proprietário',
    avatar: '',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [integrations, setIntegrations] = useState({
    whatsapp: { 
      enabled: true, 
      token: '***************',
      phoneNumber: '5511999999999',
      businessName: 'Restaurante do João'
    },
    email: { 
      enabled: true, 
      provider: 'SendGrid',
      apiKey: '***************',
      senderEmail: 'noreply@restaurante.com'
    },
    sms: { 
      enabled: false, 
      provider: 'Twilio',
      apiKey: '',
      phoneNumber: ''
    },
    googleMaps: {
      enabled: true,
      apiKey: '***************',
      placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
    },
    delivery: {
      ifood: { enabled: false, storeId: '' },
      ubereats: { enabled: false, storeId: '' },
      rappi: { enabled: false, storeId: '' }
    }
  });

  const [notifications, setNotifications] = useState({
    newCustomer: true,
    campaignResults: true,
    lowStock: false,
    dailyReport: true,
    orderReceived: true,
    paymentReceived: true,
    systemUpdates: false
  });

  const tabs = [
    { id: 'restaurant', name: 'Restaurante', icon: Building2 },
    { id: 'profile', name: 'Meu Perfil', icon: User },
    { id: 'integrations', name: 'Integrações', icon: Smartphone },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'billing', name: 'Plano & Cobrança', icon: CreditCard },
    { id: 'security', name: 'Segurança', icon: Shield }
  ];

  const dayNames = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const handleSave = () => {
    // Em produção, aqui seria uma chamada à API
    if (activeTab === 'profile') {
      updateUserProfile({
        name: profileData.name,
        email: profileData.email
      });
    }
    alert('Configurações salvas com sucesso!');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    // Em produção, aqui seria uma chamada à API
    alert('Senha alterada com sucesso!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordModal(false);
  };

  const renderRestaurantSettings = () => (
    <div className="space-y-8">
      {/* Informações Básicas */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do restaurante
            </label>
            <input
              type="text"
              value={restaurantData.name}
              onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CNPJ
            </label>
            <input
              type="text"
              value={restaurantData.cnpj}
              onChange={(e) => setRestaurantData({ ...restaurantData, cnpj: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço completo
            </label>
            <input
              type="text"
              value={restaurantData.address}
              onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              value={restaurantData.phone}
              onChange={(e) => setRestaurantData({ ...restaurantData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={restaurantData.email}
              onChange={(e) => setRestaurantData({ ...restaurantData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={restaurantData.website}
              onChange={(e) => setRestaurantData({ ...restaurantData, website: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="www.seurestaurante.com.br"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição do restaurante
            </label>
            <textarea
              value={restaurantData.description}
              onChange={(e) => setRestaurantData({ ...restaurantData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Descreva seu restaurante, especialidades, ambiente..."
            />
          </div>
        </div>
      </div>

      {/* Horário de Funcionamento */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Horário de Funcionamento</h3>
        <div className="space-y-3">
          {Object.entries(restaurantData.openingHours).map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-24">
                <span className="text-sm font-medium text-gray-700">
                  {dayNames[day as keyof typeof dayNames]}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={!hours.closed}
                  onChange={(e) => setRestaurantData({
                    ...restaurantData,
                    openingHours: {
                      ...restaurantData.openingHours,
                      [day]: { ...hours, closed: !e.target.checked }
                    }
                  })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Aberto</span>
              </div>
              {!hours.closed && (
                <>
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) => setRestaurantData({
                      ...restaurantData,
                      openingHours: {
                        ...restaurantData.openingHours,
                        [day]: { ...hours, open: e.target.value }
                      }
                    })}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                  <span className="text-gray-500">às</span>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) => setRestaurantData({
                      ...restaurantData,
                      openingHours: {
                        ...restaurantData.openingHours,
                        [day]: { ...hours, close: e.target.value }
                      }
                    })}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Redes Sociais */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Redes Sociais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="text"
              value={restaurantData.socialMedia.instagram}
              onChange={(e) => setRestaurantData({
                ...restaurantData,
                socialMedia: { ...restaurantData.socialMedia, instagram: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="@seurestaurante"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook
            </label>
            <input
              type="text"
              value={restaurantData.socialMedia.facebook}
              onChange={(e) => setRestaurantData({
                ...restaurantData,
                socialMedia: { ...restaurantData.socialMedia, facebook: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seurestaurante"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Business
            </label>
            <input
              type="text"
              value={restaurantData.socialMedia.whatsapp}
              onChange={(e) => setRestaurantData({
                ...restaurantData,
                socialMedia: { ...restaurantData.socialMedia, whatsapp: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="11999999999"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-8">
      {/* Informações Pessoais */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {profileData.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <Button icon={Camera} variant="outline" size="sm">
                Alterar Foto
              </Button>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG até 2MB</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome completo
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo
            </label>
            <select
              value={profileData.position}
              onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Proprietário">Proprietário</option>
              <option value="Gerente">Gerente</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Funcionário">Funcionário</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preferências */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preferências</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma
            </label>
            <select
              value={profileData.language}
              onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuso horário
            </label>
            <select
              value={profileData.timezone}
              onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
              <option value="America/Manaus">Manaus (GMT-4)</option>
              <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Segurança */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Segurança</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Senha</h4>
              <p className="text-sm text-gray-600">Última alteração há 30 dias</p>
            </div>
            <Button 
              icon={Key} 
              variant="outline"
              onClick={() => setShowPasswordModal(true)}
            >
              Alterar Senha
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Autenticação de dois fatores</h4>
              <p className="text-sm text-gray-600">
                {user?.twoFactorEnabled ? 'Ativada' : 'Adicione uma camada extra de segurança'}
              </p>
            </div>
            <Button variant="outline">
              {user?.twoFactorEnabled ? 'Configurar' : 'Ativar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-8">
      {/* Comunicação */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Integrações de Comunicação</h3>
        <div className="space-y-4">
          {/* WhatsApp */}
          <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">WhatsApp Business API</h4>
                <p className="text-sm text-gray-500">Envie campanhas e receba pedidos via WhatsApp</p>
                {integrations.whatsapp.enabled && (
                  <p className="text-sm text-green-600 mt-1">
                    Conectado: {integrations.whatsapp.businessName}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                integrations.whatsapp.enabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {integrations.whatsapp.enabled ? 'Conectado' : 'Desconectado'}
              </span>
              <Button size="sm" variant="outline">
                {integrations.whatsapp.enabled ? 'Configurar' : 'Conectar'}
              </Button>
            </div>
          </div>

          {/* E-mail */}
          <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">E-mail Marketing</h4>
                <p className="text-sm text-gray-500">Envie campanhas por e-mail</p>
                {integrations.email.enabled && (
                  <p className="text-sm text-blue-600 mt-1">
                    Provider: {integrations.email.provider}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                integrations.email.enabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {integrations.email.enabled ? 'Conectado' : 'Desconectado'}
              </span>
              <Button size="sm" variant="outline">
                Configurar
              </Button>
            </div>
          </div>

          {/* SMS */}
          <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">SMS</h4>
                <p className="text-sm text-gray-500">Envie campanhas por SMS</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                integrations.sms.enabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {integrations.sms.enabled ? 'Conectado' : 'Desconectado'}
              </span>
              <Button size="sm" variant="outline">
                Configurar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Plataformas de Delivery</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(integrations.delivery).map(([platform, config]) => (
            <div key={platform} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 capitalize">{platform}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  config.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {config.enabled ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Sincronize cardápio e pedidos
              </p>
              <Button size="sm" variant="outline" className="w-full">
                {config.enabled ? 'Configurar' : 'Conectar'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preferências de Notificação</h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">
                  {key === 'newCustomer' && 'Novo cliente cadastrado'}
                  {key === 'campaignResults' && 'Resultados de campanhas'}
                  {key === 'lowStock' && 'Estoque baixo'}
                  {key === 'dailyReport' && 'Relatório diário'}
                  {key === 'orderReceived' && 'Pedido recebido'}
                  {key === 'paymentReceived' && 'Pagamento recebido'}
                  {key === 'systemUpdates' && 'Atualizações do sistema'}
                </h4>
                <p className="text-sm text-gray-500">
                  {key === 'newCustomer' && 'Receba notificações quando um novo cliente se cadastrar'}
                  {key === 'campaignResults' && 'Receba resumos dos resultados das suas campanhas'}
                  {key === 'lowStock' && 'Seja alertado quando produtos estiverem com estoque baixo'}
                  {key === 'dailyReport' && 'Receba um resumo diário das vendas e métricas'}
                  {key === 'orderReceived' && 'Notificação quando receber novos pedidos'}
                  {key === 'paymentReceived' && 'Confirmação de pagamentos recebidos'}
                  {key === 'systemUpdates' && 'Informações sobre novas funcionalidades'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Plano Atual</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-blue-900 capitalize">
                Plano {user?.currentRestaurant.plan}
              </h4>
              <p className="text-blue-700">
                {user?.currentRestaurant.plan === 'premium' && 'Recursos avançados de BI e campanhas ilimitadas'}
                {user?.currentRestaurant.plan === 'basic' && 'Recursos básicos de gestão'}
                {user?.currentRestaurant.plan === 'enterprise' && 'Todos os recursos + suporte dedicado'}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">✓</span> Cardápio digital ilimitado
                </div>
                <div>
                  <span className="text-blue-600">✓</span> Sistema de fidelidade
                </div>
                <div>
                  <span className="text-blue-600">✓</span> Campanhas de marketing
                </div>
                <div>
                  <span className="text-blue-600">✓</span> Relatórios avançados
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-900">
                {user?.currentRestaurant.plan === 'premium' && 'R$ 97'}
                {user?.currentRestaurant.plan === 'basic' && 'R$ 47'}
                {user?.currentRestaurant.plan === 'enterprise' && 'R$ 197'}
                <span className="text-lg font-normal">/mês</span>
              </p>
              <p className="text-sm text-blue-700 mt-1">Próxima cobrança: 15/02/2024</p>
              <div className="mt-4 space-y-2">
                <Button size="sm" variant="outline">
                  Alterar Plano
                </Button>
                <Button size="sm" variant="ghost">
                  Cancelar Assinatura
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Método de Pagamento</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 4532</p>
                <p className="text-sm text-gray-500">Expira em 12/2025</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Alterar
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Pagamentos</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nota Fiscal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">15/01/2024</td>
                <td className="px-6 py-4 text-sm text-gray-900">Plano Premium - Janeiro</td>
                <td className="px-6 py-4 text-sm text-gray-900">R$ 97,00</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Pago
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Button size="sm" variant="ghost">
                    Download
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">15/12/2023</td>
                <td className="px-6 py-4 text-sm text-gray-900">Plano Premium - Dezembro</td>
                <td className="px-6 py-4 text-sm text-gray-900">R$ 97,00</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Pago
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Button size="sm" variant="ghost">
                    Download
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Segurança</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Sessões ativas</h4>
              <p className="text-sm text-gray-500">Gerencie dispositivos conectados à sua conta</p>
            </div>
            <Button variant="outline">
              Ver Sessões
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Log de atividades</h4>
              <p className="text-sm text-gray-500">Histórico de ações realizadas na conta</p>
            </div>
            <Button variant="outline">
              Ver Histórico
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Backup de dados</h4>
              <p className="text-sm text-gray-500">Último backup: 14/01/2024 às 03:00</p>
            </div>
            <Button variant="outline">
              Fazer Backup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do seu restaurante e perfil</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {activeTab === 'restaurant' && renderRestaurantSettings()}
            {activeTab === 'profile' && renderProfileSettings()}
            {activeTab === 'integrations' && renderIntegrations()}
            {activeTab === 'notifications' && renderNotifications()}
            {activeTab === 'billing' && renderBilling()}
            {activeTab === 'security' && renderSecurity()}

            {/* Save Button */}
            {(activeTab === 'restaurant' || activeTab === 'profile' || activeTab === 'notifications') && (
              <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
                <Button icon={Save} onClick={handleSave}>
                  Salvar Alterações
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Alterar Senha */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Alterar Senha"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha atual
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nova senha
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar nova senha
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Requisitos da senha:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Mínimo de 8 caracteres</li>
              <li>• Pelo menos uma letra maiúscula</li>
              <li>• Pelo menos um número</li>
              <li>• Pelo menos um caractere especial</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setShowPasswordModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePasswordChange}>
              Alterar Senha
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Settings;
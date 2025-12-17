'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Send, 
  Calendar, 
  MessageSquare, 
  Mail, 
  Smartphone,
  Eye,
  MousePointer,
  Gift,
  Users,
  Filter,
  Search
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import Layout from '@/components/Layout/Layout';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CampaignsPage() {
  const { campaigns, customers, addCampaign, updateCampaign } = useData();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'whatsapp' as const,
    targetAudience: 'all',
    message: '',
    status: 'draft' as const,
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    redeemRate: 0
  });

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Enviada';
      case 'scheduled': return 'Agendada';
      case 'active': return 'Ativa';
      default: return 'Rascunho';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whatsapp': return MessageSquare;
      case 'email': return Mail;
      case 'sms': return Smartphone;
      default: return MessageSquare;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'whatsapp': return 'text-green-600';
      case 'email': return 'text-blue-600';
      case 'sms': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getAudienceCount = (audience: string) => {
    switch (audience) {
      case 'all': return customers.length;
      case 'active': return customers.filter(c => c.status === 'active').length;
      case 'inactive': return customers.filter(c => c.status === 'inactive').length;
      case 'gold': return customers.filter(c => c.level === 'gold').length;
      case 'silver': return customers.filter(c => c.level === 'silver').length;
      case 'bronze': return customers.filter(c => c.level === 'bronze').length;
      default: return 0;
    }
  };

  const handleCreateCampaign = () => {
    addCampaign({
      ...newCampaign,
      sentCount: newCampaign.status === 'sent' ? getAudienceCount(newCampaign.targetAudience) : 0
    });
    setNewCampaign({
      name: '',
      type: 'whatsapp',
      targetAudience: 'all',
      message: '',
      status: 'draft',
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      redeemRate: 0
    });
    setShowCreateModal(false);
  };

  const handleSendCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      updateCampaign(campaignId, {
        status: 'sent',
        sentCount: getAudienceCount(campaign.targetAudience),
        openRate: Math.floor(Math.random() * 30) + 60,
        clickRate: Math.floor(Math.random() * 15) + 15,
        redeemRate: Math.floor(Math.random() * 10) + 5
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campanhas</h1>
            <p className="text-gray-600">Crie e gerencie campanhas de marketing</p>
          </div>
          <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
            Nova Campanha
          </Button>
        </div>

        {/* Métricas de Campanhas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Enviadas</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {campaigns.filter(c => c.status === 'sent').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <Send className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Abertura</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {campaigns.length > 0 
                    ? Math.round(campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length)
                    : 0}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Cliques</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {campaigns.length > 0 
                    ? Math.round(campaigns.reduce((sum, c) => sum + c.clickRate, 0) / campaigns.length)
                    : 0}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <MousePointer className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Resgate</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {campaigns.length > 0 
                    ? Math.round(campaigns.reduce((sum, c) => sum + c.redeemRate, 0) / campaigns.length)
                    : 0}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50">
                <Gift className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar campanhas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="draft">Rascunho</option>
                <option value="scheduled">Agendadas</option>
                <option value="sent">Enviadas</option>
                <option value="active">Ativas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Campanhas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid gap-6 p-6">
            {filteredCampaigns.map((campaign) => {
              const TypeIcon = getTypeIcon(campaign.type);
              return (
                <div key={campaign.id} className="border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg bg-gray-50 ${getTypeColor(campaign.type)}`}>
                        <TypeIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{campaign.targetAudience}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{format(campaign.createdAt, 'dd/MM/yyyy', { locale: ptBR })}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{getAudienceCount(campaign.targetAudience)} clientes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                        {getStatusText(campaign.status)}
                      </span>
                      {campaign.status === 'draft' && (
                        <Button
                          size="sm"
                          icon={Send}
                          onClick={() => handleSendCampaign(campaign.id)}
                        >
                          Enviar
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-700">{campaign.message}</p>
                  </div>

                  {campaign.status === 'sent' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{campaign.sentCount}</p>
                        <p className="text-sm text-gray-500">Enviados</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{campaign.openRate}%</p>
                        <p className="text-sm text-gray-500">Abertura</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{campaign.clickRate}%</p>
                        <p className="text-sm text-gray-500">Cliques</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{campaign.redeemRate}%</p>
                        <p className="text-sm text-gray-500">Resgates</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Nova Campanha */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nova Campanha"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da campanha
                </label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Promoção de Fim de Semana"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canal de envio
                </label>
                <select
                  value={newCampaign.type}
                  onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">E-mail</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Público-alvo
              </label>
              <select
                value={newCampaign.targetAudience}
                onChange={(e) => setNewCampaign({ ...newCampaign, targetAudience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os clientes ({getAudienceCount('all')})</option>
                <option value="active">Clientes ativos ({getAudienceCount('active')})</option>
                <option value="inactive">Clientes inativos ({getAudienceCount('inactive')})</option>
                <option value="gold">Clientes Gold ({getAudienceCount('gold')})</option>
                <option value="silver">Clientes Silver ({getAudienceCount('silver')})</option>
                <option value="bronze">Clientes Bronze ({getAudienceCount('bronze')})</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem
              </label>
              <textarea
                value={newCampaign.message}
                onChange={(e) => setNewCampaign({ ...newCampaign, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite sua mensagem aqui..."
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCampaign}>
                Criar Campanha
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}

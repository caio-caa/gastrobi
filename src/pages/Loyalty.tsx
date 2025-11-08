import React, { useState } from 'react';
import { 
  Gift, 
  Star, 
  Trophy, 
  Users, 
  TrendingUp,
  Plus,
  Settings,
  Edit,
  Trash2,
  Save
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

function Loyalty() {
  const { customers, loyaltyRules, addLoyaltyRule, updateLoyaltyRule } = useData();
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  
  const [newRule, setNewRule] = useState({
    name: '',
    points: 0,
    description: '',
    type: 'purchase' as const,
    isActive: true
  });

  const [loyaltySettings, setLoyaltySettings] = useState({
    enabled: true,
    pointsPerReal: 1,
    bronzeThreshold: 0,
    silverThreshold: 200,
    goldThreshold: 500,
    pointsExpiration: 365, // dias
    welcomeBonus: 50,
    birthdayBonus: 100,
    referralBonus: 150
  });

  const customersByLevel = {
    bronze: customers.filter(c => c.level === 'bronze').length,
    silver: customers.filter(c => c.level === 'silver').length,
    gold: customers.filter(c => c.level === 'gold').length
  };

  const totalPoints = customers.reduce((sum, customer) => sum + customer.points, 0);
  const averagePoints = customers.length > 0 ? Math.round(totalPoints / customers.length) : 0;

  const getLevelRequirements = (level: string) => {
    switch (level) {
      case 'silver': return `${loyaltySettings.silverThreshold} pontos`;
      case 'gold': return `${loyaltySettings.goldThreshold} pontos`;
      default: return `${loyaltySettings.bronzeThreshold} pontos`;
    }
  };

  const getRuleIcon = (type: string) => {
    switch (type) {
      case 'purchase': return Gift;
      case 'checkin': return Star;
      case 'birthday': return Trophy;
      case 'referral': return Users;
      case 'social_share': return Star;
      case 'review': return Trophy;
      default: return Gift;
    }
  };

  const getRuleTypeLabel = (type: string) => {
    switch (type) {
      case 'purchase': return 'Compra';
      case 'checkin': return 'Check-in';
      case 'birthday': return 'Aniversário';
      case 'referral': return 'Indicação';
      case 'social_share': return 'Compartilhamento';
      case 'review': return 'Avaliação';
      default: return type;
    }
  };

  const handleAddRule = () => {
    if (editingRule) {
      updateLoyaltyRule(editingRule.id, newRule);
      setEditingRule(null);
    } else {
      addLoyaltyRule(newRule);
    }
    
    setNewRule({
      name: '',
      points: 0,
      description: '',
      type: 'purchase',
      isActive: true
    });
    setShowRuleModal(false);
  };

  const openEditRule = (rule: any) => {
    setEditingRule(rule);
    setNewRule({
      name: rule.name,
      points: rule.points,
      description: rule.description,
      type: rule.type,
      isActive: rule.isActive
    });
    setShowRuleModal(true);
  };

  const handleSaveSettings = () => {
    // Em produção, aqui seria uma chamada à API
    console.log('Configurações salvas:', loyaltySettings);
    setShowSettingsModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Fidelidade</h1>
          <p className="text-gray-600">Configure regras e acompanhe o engajamento dos clientes</p>
        </div>
        <div className="flex space-x-3">
          <Button icon={Settings} variant="outline" onClick={() => setShowSettingsModal(true)}>
            Configurações
          </Button>
          <Button icon={Plus} onClick={() => setShowRuleModal(true)}>
            Nova Regra
          </Button>
        </div>
      </div>

      {/* Status do Sistema */}
      <div className={`p-4 rounded-lg border ${
        loyaltySettings.enabled 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              loyaltySettings.enabled ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Gift className={`w-5 h-5 ${
                loyaltySettings.enabled ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
            <div>
              <h3 className={`font-medium ${
                loyaltySettings.enabled ? 'text-green-900' : 'text-red-900'
              }`}>
                Sistema de Fidelidade {loyaltySettings.enabled ? 'Ativo' : 'Inativo'}
              </h3>
              <p className={`text-sm ${
                loyaltySettings.enabled ? 'text-green-700' : 'text-red-700'
              }`}>
                {loyaltySettings.enabled 
                  ? `${loyaltySettings.pointsPerReal} ponto(s) a cada R$ 1,00 gasto`
                  : 'Configure e ative o sistema para começar a fidelizar clientes'
                }
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            icon={Settings}
            onClick={() => setShowSettingsModal(true)}
          >
            Configurar
          </Button>
        </div>
      </div>

      {/* Métricas de Fidelidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Pontos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalPoints.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Gift className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Média por Cliente</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{averagePoints}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {customers.filter(c => c.status === 'active').length}
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
              <p className="text-sm font-medium text-gray-600">Clientes Gold</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{customersByLevel.gold}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Níveis de Fidelidade */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Níveis de Fidelidade</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Bronze</h4>
                  <p className="text-sm text-gray-600">{getLevelRequirements('bronze')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{customersByLevel.bronze}</p>
                <p className="text-sm text-gray-500">clientes</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Silver</h4>
                  <p className="text-sm text-gray-600">{getLevelRequirements('silver')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{customersByLevel.silver}</p>
                <p className="text-sm text-gray-500">clientes</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Gold</h4>
                  <p className="text-sm text-gray-600">{getLevelRequirements('gold')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{customersByLevel.gold}</p>
                <p className="text-sm text-gray-500">clientes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Regras de Pontuação */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Regras de Pontuação</h3>
            <Button size="sm" icon={Plus} onClick={() => setShowRuleModal(true)}>
              Adicionar
            </Button>
          </div>
          <div className="space-y-3">
            {loyaltyRules.map((rule) => {
              const IconComponent = getRuleIcon(rule.type);
              return (
                <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 text-sm">{rule.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          rule.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {rule.isActive ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{rule.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">+{rule.points}</p>
                      <p className="text-xs text-gray-500">pontos</p>
                    </div>
                    <button
                      onClick={() => openEditRule(rule)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clientes por Nível */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Principais Clientes Fidelizados</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nível
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pontos
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visitas
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Gasto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers
                .sort((a, b) => b.points - a.points)
                .slice(0, 10)
                .map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.level === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                        customer.level === 'silver' ? 'bg-gray-100 text-gray-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {customer.level}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.points} pts
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.visitCount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {customer.totalSpent.toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Regra */}
      <Modal
        isOpen={showRuleModal}
        onClose={() => {
          setShowRuleModal(false);
          setEditingRule(null);
          setNewRule({
            name: '',
            points: 0,
            description: '',
            type: 'purchase',
            isActive: true
          });
        }}
        title={editingRule ? 'Editar Regra de Pontuação' : 'Nova Regra de Pontuação'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da regra
            </label>
            <input
              type="text"
              value={newRule.name}
              onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Compartilhamento nas redes sociais"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo da regra
            </label>
            <select
              value={newRule.type}
              onChange={(e) => setNewRule({ ...newRule, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="purchase">Compra</option>
              <option value="checkin">Check-in</option>
              <option value="birthday">Aniversário</option>
              <option value="referral">Indicação</option>
              <option value="social_share">Compartilhamento Social</option>
              <option value="review">Avaliação</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pontos concedidos
            </label>
            <input
              type="number"
              value={newRule.points}
              onChange={(e) => setNewRule({ ...newRule, points: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={newRule.description}
              onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descreva como a regra funciona"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="ruleActive"
              checked={newRule.isActive}
              onChange={(e) => setNewRule({ ...newRule, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="ruleActive" className="ml-2 text-sm text-gray-700">
              Regra ativa
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowRuleModal(false);
                setEditingRule(null);
                setNewRule({
                  name: '',
                  points: 0,
                  description: '',
                  type: 'purchase',
                  isActive: true
                });
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddRule}>
              {editingRule ? 'Atualizar' : 'Criar'} Regra
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Configurações */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Configurações do Sistema de Fidelidade"
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Sistema de Fidelidade</h4>
              <p className="text-sm text-gray-600">Ativar ou desativar o programa de pontos</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={loyaltySettings.enabled}
                onChange={(e) => setLoyaltySettings({ ...loyaltySettings, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pontos por Real gasto
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={loyaltySettings.pointsPerReal}
                onChange={(e) => setLoyaltySettings({ ...loyaltySettings, pointsPerReal: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bônus de boas-vindas
              </label>
              <input
                type="number"
                min="0"
                value={loyaltySettings.welcomeBonus}
                onChange={(e) => setLoyaltySettings({ ...loyaltySettings, welcomeBonus: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pontos para Silver
              </label>
              <input
                type="number"
                min="0"
                value={loyaltySettings.silverThreshold}
                onChange={(e) => setLoyaltySettings({ ...loyaltySettings, silverThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pontos para Gold
              </label>
              <input
                type="number"
                min="0"
                value={loyaltySettings.goldThreshold}
                onChange={(e) => setLoyaltySettings({ ...loyaltySettings, goldThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bônus de aniversário
              </label>
              <input
                type="number"
                min="0"
                value={loyaltySettings.birthdayBonus}
                onChange={(e) => setLoyaltySettings({ ...loyaltySettings, birthdayBonus: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bônus por indicação
              </label>
              <input
                type="number"
                min="0"
                value={loyaltySettings.referralBonus}
                onChange={(e) => setLoyaltySettings({ ...loyaltySettings, referralBonus: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiração dos pontos (dias)
            </label>
            <input
              type="number"
              min="0"
              value={loyaltySettings.pointsExpiration}
              onChange={(e) => setLoyaltySettings({ ...loyaltySettings, pointsExpiration: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              0 = pontos nunca expiram
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setShowSettingsModal(false)}>
              Cancelar
            </Button>
            <Button icon={Save} onClick={handleSaveSettings}>
              Salvar Configurações
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Loyalty;
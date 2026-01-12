'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Globe,
  Monitor,
  Shield,
  Eye,
  Plus,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  RefreshCw,
  Database
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Layout from '@/components/Layout/Layout';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW' | 'EXPORT';
  entity: string;
  entityId: string | null;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

interface AuditStats {
  totalLogs: number;
  logsByAction: Record<string, number>;
  logsByEntity: Record<string, number>;
  logsLast24h: number;
  logsLast7d: number;
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats>({
    totalLogs: 0,
    logsByAction: {},
    logsByEntity: {},
    logsLast24h: 0,
    logsLast7d: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    // Mock data - será substituído pela API real
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        userId: 'u1',
        userEmail: 'admin@gastrobi.com',
        userName: 'Admin Principal',
        action: 'LOGIN',
        entity: 'User',
        entityId: 'u1',
        details: { method: 'password', success: true },
        ipAddress: '189.45.123.78',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        userId: 'u1',
        userEmail: 'admin@gastrobi.com',
        userName: 'Admin Principal',
        action: 'CREATE',
        entity: 'Restaurant',
        entityId: 'r10',
        details: { name: 'Sushi Express', plan: 'BASIC' },
        ipAddress: '189.45.123.78',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        userId: 'u2',
        userEmail: 'suporte@gastrobi.com',
        userName: 'Suporte Técnico',
        action: 'UPDATE',
        entity: 'User',
        entityId: 'u5',
        details: { field: 'isActive', oldValue: true, newValue: false },
        ipAddress: '200.18.45.67',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        userId: 'u1',
        userEmail: 'admin@gastrobi.com',
        userName: 'Admin Principal',
        action: 'UPDATE',
        entity: 'Subscription',
        entityId: 's3',
        details: { plan: { from: 'BASIC', to: 'PREMIUM' }, restaurantName: 'Pizzaria Bella' },
        ipAddress: '189.45.123.78',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        userId: 'u3',
        userEmail: 'financeiro@gastrobi.com',
        userName: 'Financeiro',
        action: 'EXPORT',
        entity: 'Payment',
        entityId: null,
        details: { format: 'CSV', period: '2026-01', records: 45 },
        ipAddress: '177.89.234.12',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        userId: 'u2',
        userEmail: 'suporte@gastrobi.com',
        userName: 'Suporte Técnico',
        action: 'DELETE',
        entity: 'WhiteLabel',
        entityId: 'wl2',
        details: { clientName: 'Cliente Inativo', reason: 'Solicitação do cliente' },
        ipAddress: '200.18.45.67',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '7',
        userId: 'u1',
        userEmail: 'admin@gastrobi.com',
        userName: 'Admin Principal',
        action: 'VIEW',
        entity: 'Analytics',
        entityId: null,
        details: { page: 'revenue', dateRange: '30d' },
        ipAddress: '189.45.123.78',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '8',
        userId: 'u4',
        userEmail: 'novo.admin@gastrobi.com',
        userName: 'Novo Admin',
        action: 'LOGIN',
        entity: 'User',
        entityId: 'u4',
        details: { method: 'password', success: true, firstLogin: true },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2) Mobile/15E148',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '9',
        userId: 'u1',
        userEmail: 'admin@gastrobi.com',
        userName: 'Admin Principal',
        action: 'CREATE',
        entity: 'User',
        entityId: 'u4',
        details: { email: 'novo.admin@gastrobi.com', role: 'ADMIN' },
        ipAddress: '189.45.123.78',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '10',
        userId: 'u1',
        userEmail: 'admin@gastrobi.com',
        userName: 'Admin Principal',
        action: 'LOGOUT',
        entity: 'User',
        entityId: 'u1',
        details: { sessionDuration: '2h 45m' },
        ipAddress: '189.45.123.78',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    setLogs(mockLogs);
    setStats({
      totalLogs: 1250,
      logsByAction: {
        CREATE: 320,
        UPDATE: 580,
        DELETE: 45,
        LOGIN: 245,
        LOGOUT: 40,
        VIEW: 15,
        EXPORT: 5
      },
      logsByEntity: {
        User: 420,
        Restaurant: 380,
        Subscription: 180,
        Payment: 150,
        WhiteLabel: 85,
        Analytics: 35
      },
      logsLast24h: 42,
      logsLast7d: 285
    });
    setLoading(false);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.entity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'all' || log.entity === entityFilter;
    
    if (dateFilter === 'all') return matchesSearch && matchesAction && matchesEntity;
    
    const logDate = new Date(log.createdAt);
    const now = new Date();
    if (dateFilter === '24h') {
      return matchesSearch && matchesAction && matchesEntity && (now.getTime() - logDate.getTime()) < 24 * 60 * 60 * 1000;
    }
    if (dateFilter === '7d') {
      return matchesSearch && matchesAction && matchesEntity && (now.getTime() - logDate.getTime()) < 7 * 24 * 60 * 60 * 1000;
    }
    if (dateFilter === '30d') {
      return matchesSearch && matchesAction && matchesEntity && (now.getTime() - logDate.getTime()) < 30 * 24 * 60 * 60 * 1000;
    }
    return matchesSearch && matchesAction && matchesEntity;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return Plus;
      case 'UPDATE': return Edit;
      case 'DELETE': return Trash2;
      case 'LOGIN': return LogIn;
      case 'LOGOUT': return LogOut;
      case 'VIEW': return Eye;
      case 'EXPORT': return Download;
      default: return Activity;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'LOGIN': return 'bg-purple-100 text-purple-800';
      case 'LOGOUT': return 'bg-gray-100 text-gray-800';
      case 'VIEW': return 'bg-yellow-100 text-yellow-800';
      case 'EXPORT': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE: 'Criação',
      UPDATE: 'Atualização',
      DELETE: 'Exclusão',
      LOGIN: 'Login',
      LOGOUT: 'Logout',
      VIEW: 'Visualização',
      EXPORT: 'Exportação'
    };
    return labels[action] || action;
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'User': return User;
      case 'Restaurant': return Database;
      case 'Subscription': return Shield;
      case 'Payment': return Activity;
      case 'WhiteLabel': return Globe;
      case 'Analytics': return Activity;
      default: return FileText;
    }
  };

  const formatLogDescription = (log: AuditLog) => {
    switch (log.action) {
      case 'LOGIN':
        return `fez login no sistema`;
      case 'LOGOUT':
        return `saiu do sistema`;
      case 'CREATE':
        return `criou ${log.entity} "${log.details.name || log.details.email || log.entityId}"`;
      case 'UPDATE':
        if (log.details.field) {
          return `atualizou ${log.details.field} em ${log.entity}`;
        }
        if (log.details.plan) {
          return `alterou plano de ${log.details.plan.from} para ${log.details.plan.to}`;
        }
        return `atualizou ${log.entity}`;
      case 'DELETE':
        return `excluiu ${log.entity} "${log.details.clientName || log.entityId}"`;
      case 'VIEW':
        return `visualizou ${log.details.page || log.entity}`;
      case 'EXPORT':
        return `exportou ${log.details.records} registros de ${log.entity}`;
      default:
        return `realizou ação em ${log.entity}`;
    }
  };

  const uniqueEntities = [...new Set(logs.map(log => log.entity))];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Logs de Auditoria</h1>
            <p className="text-gray-600">Histórico completo de ações na plataforma</p>
          </div>
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Exportar Logs
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Logs</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalLogs.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Últimas 24h</p>
                <p className="text-xl font-bold text-green-600">{stats.logsLast24h}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Últimos 7 dias</p>
                <p className="text-xl font-bold text-purple-600">{stats.logsLast7d}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ação mais comum</p>
                <p className="text-xl font-bold text-orange-600">UPDATE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por usuário ou entidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as Ações</option>
              <option value="CREATE">Criação</option>
              <option value="UPDATE">Atualização</option>
              <option value="DELETE">Exclusão</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
              <option value="VIEW">Visualização</option>
              <option value="EXPORT">Exportação</option>
            </select>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as Entidades</option>
              {uniqueEntities.map(entity => (
                <option key={entity} value={entity}>{entity}</option>
              ))}
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todo o período</option>
              <option value="24h">Últimas 24h</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
            </select>
          </div>
        </div>

        {/* Logs List */}
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Carregando...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Nenhum log encontrado
            </div>
          ) : (
            filteredLogs.map((log) => {
              const ActionIcon = getActionIcon(log.action);
              const EntityIcon = getEntityIcon(log.entity);

              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                      <ActionIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{log.userName}</span>
                        <span className="text-gray-500">{formatLogDescription(log)}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <EntityIcon className="w-4 h-4 mr-1" />
                          {log.entity}
                        </span>
                        <span className="flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          {log.ipAddress}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: ptBR })}
                        </span>
                      </div>

                      {/* Expanded Details */}
                      {selectedLog?.id === log.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Email do Usuário</p>
                              <p className="text-sm text-gray-900">{log.userEmail}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Data/Hora</p>
                              <p className="text-sm text-gray-900">
                                {format(new Date(log.createdAt), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Endereço IP</p>
                              <p className="text-sm text-gray-900">{log.ipAddress}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">ID da Entidade</p>
                              <p className="text-sm text-gray-900">{log.entityId || '-'}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase">User Agent</p>
                            <p className="text-sm text-gray-900 break-all">{log.userAgent}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase mb-2">Detalhes</p>
                            <pre className="text-xs bg-gray-100 p-3 rounded-lg overflow-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                        {getActionLabel(log.action)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {filteredLogs.length} de {stats.totalLogs} logs
          </p>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="secondary" size="sm">
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

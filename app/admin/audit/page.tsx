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
  Database,
  ChevronRight,
  ChevronDown,
  ChevronLeft
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Layout from '@/components/Layout/Layout';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { auditApi } from '@/lib/api';

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
  const [totalLogs, setTotalLogs] = useState(0);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    loadData();
  }, [currentPage, itemsPerPage, searchTerm, actionFilter, entityFilter, dateFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const [logsResponse, statsResponse] = await Promise.all([
        auditApi.list({ 
          skip,
          take: itemsPerPage,
          action: actionFilter !== 'all' ? actionFilter : undefined,
          entity: entityFilter !== 'all' ? entityFilter : undefined
        }),
        auditApi.stats()
      ]);

      if (logsResponse.data && Array.isArray(logsResponse.data.data)) {
        setLogs(logsResponse.data.data);
        setTotalLogs(logsResponse.data.total || 0);
      }

      if (statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Erro ao carregar logs de auditoria:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs;

  const totalPages = Math.ceil(totalLogs / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectedLog(null);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedLog(null);
    }
  };

  const handlePageJump = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedLog(null);
    }
  };

  const handleItemsPerPageChange = (newValue: number) => {
    setItemsPerPage(newValue);
    setCurrentPage(1);
    setSelectedLog(null);
  };

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
    const details = log.details || {};
    const entityLabel = getEntityLabel(log.entity);
    
    switch (log.action) {
      case 'LOGIN':
        return `Fez login no sistema`;
      case 'LOGOUT':
        return `Saiu do sistema`;
      case 'CREATE':
        return `Criou ${entityLabel} "${details.name || details.email || details.clientName || log.entityId}"`;
      case 'UPDATE':
        if (details.field) {
          return `Atualizou ${details.field} em ${entityLabel}`;
        }
        if (details.plan) {
          return `Alterou plano de ${details.plan.from} para ${details.plan.to}`;
        }
        return `Atualizou ${entityLabel}`;
      case 'DELETE':
        return `Excluiu ${entityLabel} "${details.clientName || log.entityId}"`;
      case 'VIEW':
        return `Visualizou ${details.page || entityLabel}`;
      case 'EXPORT':
        return `Exportou ${details.records} registros de ${entityLabel}`;
      default:
        return `Realizou ação em ${entityLabel}`;
    }
  };

  const getEntityLabel = (entity: string) => {
    const labels: Record<string, string> = {
      User: 'Usuário',
      Restaurant: 'Restaurante',
      Customer: 'Cliente',
      Subscription: 'Assinatura',
      Payment: 'Pagamento',
      WhiteLabel: 'White Label',
      Analytics: 'Análise',
      Admin: 'Admin'
    };
    return labels[entity] || entity;
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
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
              onChange={(e) => {
                setEntityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as Entidades</option>
              <option value="User">Usuário</option>
              <option value="Restaurant">Restaurante</option>
              <option value="Customer">Cliente</option>
              <option value="Subscription">Assinatura</option>
              <option value="Payment">Pagamento</option>
              <option value="WhiteLabel">White Label</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
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
                  className="p-4 hover:bg-gray-50 hover:shadow-sm cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 rounded-lg"
                  role="button"
                  tabIndex={0}
                  aria-expanded={selectedLog?.id === log.id}
                  onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedLog(selectedLog?.id === log.id ? null : log);
                    }
                  }}
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
                    <div className="text-right flex items-center justify-end space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                        {getActionLabel(log.action)}
                      </span>
                      <span className="text-gray-400">
                        {selectedLog?.id === log.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination placeholder */}
        <div className="flex flex-col gap-4 bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                Itens por página:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value={10}>10</option>
                <option value={12}>12</option>
                <option value={13}>13</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-semibold">{filteredLogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> a <span className="font-semibold">{Math.min(currentPage * itemsPerPage, totalLogs)}</span> de <span className="font-semibold">{totalLogs}</span> logs
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <Button 
              variant="secondary" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageJump(pageNum)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button 
              variant="secondary" 
              size="sm"
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              Próximo
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

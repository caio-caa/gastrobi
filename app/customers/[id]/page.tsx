'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  DollarSign, 
  ShoppingBag,
  Phone,
  Mail,
  Gift,
  MessageSquare
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import Button from '@/components/ui/Button';
import Layout from '@/components/Layout/Layout';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { customers } = useData();
  const id = params.id as string;
  
  const customer = customers.find(c => c.id === id);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  if (!customer) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Cliente não encontrado</p>
          <Link href="/customers" className="text-blue-600 hover:text-blue-800">
            Voltar para clientes
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/customers"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
              <p className="text-gray-600">Detalhes do cliente</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button icon={MessageSquare} variant="outline">
              Enviar Mensagem
            </Button>
            <Button icon={Gift}>
              Adicionar Pontos
            </Button>
          </div>
        </div>

        {/* Informações Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Perfil do Cliente */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getLevelColor(customer.level)}`}>
                  <Star className="w-4 h-4 mr-1" />
                  Cliente {customer.level}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">E-mail</p>
                    <p className="text-sm font-medium text-gray-900">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="text-sm font-medium text-gray-900">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Última visita</p>
                    <p className="text-sm font-medium text-gray-900">
                      {format(customer.lastVisit, 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    customer.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Preferências */}
            {customer.preferences.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências</h3>
                <div className="flex flex-wrap gap-2">
                  {customer.preferences.map((preference, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {preference}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Métricas e Histórico */}
          <div className="lg:col-span-2 space-y-6">
            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Gasto</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatCurrency(customer.totalSpent)}
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
                    <p className="text-sm font-medium text-gray-600">Visitas</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{customer.visitCount}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pontos</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{customer.points}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50">
                    <Gift className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Histórico de Pedidos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Histórico de Pedidos</h3>
              </div>
              
              {customer.orders.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {customer.orders.map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium text-gray-900">Pedido #{order.id}</p>
                          <p className="text-sm text-gray-500">
                            {format(order.date, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
                          <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-gray-900">{formatCurrency(item.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p>Nenhum pedido encontrado</p>
                  <p className="text-sm">Os pedidos aparecerão aqui conforme forem realizados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

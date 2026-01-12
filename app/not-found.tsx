'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-200 select-none">404</div>
          <div className="relative -mt-16">
            <Search className="w-20 h-20 mx-auto text-blue-600 opacity-80" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Página não encontrada
        </h1>
        <p className="text-gray-600 mb-8">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin/analytics"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Ir para Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-gray-500">
          Precisa de ajuda?{' '}
          <a href="mailto:suporte@gastrobi.com" className="text-blue-600 hover:underline">
            Entre em contato
          </a>
        </p>
      </div>
    </div>
  );
}

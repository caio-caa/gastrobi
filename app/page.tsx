'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Loader2, ChefHat, ScanLine } from 'lucide-react';

const QRScanner = dynamic(() => import('@/components/Landing/QRScanner'), {
  ssr: false,
  loading: () => (
    <div className="w-full py-12 rounded-2xl text-center animate-pulse bg-green-50 text-green-400">
      Carregando scanner...
    </div>
  ),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export default function LandingPage() {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQRScanned = async (slug: string) => {
    try {
      setIsValidating(true);
      setError(null);

      const response = await fetch(`${API_URL}/restaurants/public/${slug}`);

      if (!response.ok) {
        throw new Error('Restaurante não encontrado');
      }

      router.push(`/menu/${slug}`);
    } catch (err) {
      console.error('Erro:', err);
      setError('Restaurante não encontrado. Tente escanear novamente.');
      setIsValidating(false);
    }
  };

  const handleScanError = (errorMsg: string) => {
    setError(errorMsg);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-600 to-green-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center p-4 pt-6 text-white">
        <div className="flex items-center space-x-2">
          <ChefHat className="w-8 h-8" />
          <span className="text-xl font-bold">GastroBi</span>
        </div>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Illustration */}
        <div className="w-40 h-40 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 shadow-2xl border border-white/20">
          <ScanLine className="w-20 h-20 text-white" />
        </div>

        <div className="text-white mb-8">
          <h1 className="text-3xl font-bold mb-3">
            Escaneie o QR Code
          </h1>
          <p className="text-lg opacity-90 leading-relaxed max-w-sm mx-auto">
            Aponte a câmera para o QR code do restaurante e veja o cardápio na hora.
          </p>
        </div>

        {/* Scanner Card */}
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="text-center mb-4">
            <h2 className="text-gray-900 font-semibold text-lg">
              Escanear QR Code
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Aponte para o código do restaurante
            </p>
          </div>

          {isValidating ? (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-green-600" />
              <p className="text-gray-500 text-sm">
                Abrindo cardápio...
              </p>
            </div>
          ) : (
            <QRScanner
              onScan={handleQRScanned}
              onError={handleScanError}
            />
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="w-full max-w-sm bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-6 text-center">
            <p className="text-sm text-red-600">
              {error}
            </p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs font-medium cursor-pointer text-red-400 hover:text-red-500 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Tip */}
        <p className="text-white/60 text-xs mt-6 max-w-xs leading-relaxed">
          Peça o QR code ao restaurante. Ele pode estar na mesa, no balcão, no cardápio impresso ou no WhatsApp.
        </p>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 px-6">
        <p className="text-xs text-white/40">
          GastroBi — Cardápio digital inteligente
        </p>
      </footer>
    </div>
  );
}

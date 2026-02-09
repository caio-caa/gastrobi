'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    if (isScanning || !containerRef.current) return;

    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          // Extrair slug do QR code
          let slug = decodedText;

          // Se o QR contém uma URL, extrair o slug
          if (decodedText.includes('/menu/')) {
            const parts = decodedText.split('/menu/');
            slug = parts[parts.length - 1].replace(/\/$/, '');
          }

          stopScanner();
          onScan(slug);
        },
        () => {
          // QR code não detectado neste frame, ignorar
        }
      );

      setIsScanning(true);
      setHasPermission(true);
    } catch (err: any) {
      console.error('Erro ao iniciar scanner:', err);
      setHasPermission(false);
      onError?.('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('Erro ao parar scanner:', err);
      }
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="w-full">
      <div
        id="qr-reader"
        ref={containerRef}
        className="w-full overflow-hidden rounded-2xl"
        style={{ display: isScanning ? 'block' : 'none' }}
      />

      {!isScanning && (
        <button
          onClick={startScanner}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 cursor-pointer flex items-center justify-center space-x-3"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <line x1="7" y1="12" x2="17" y2="12" />
          </svg>
          <span>Abrir Câmera</span>
        </button>
      )}

      {isScanning && (
        <button
          onClick={stopScanner}
          className="w-full mt-3 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer bg-gray-100 hover:bg-gray-200"
        >
          Fechar câmera
        </button>
      )}

      {hasPermission === false && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-3">
          <p className="text-sm text-red-600 text-center">
            Permissão de câmera negada. Verifique as configurações do navegador.
          </p>
        </div>
      )}
    </div>
  );
}

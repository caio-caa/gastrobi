'use client';

import React from 'react';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';

function WhiteLabelFooter() {
  const { config } = useWhiteLabel();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              {config.logo ? (
                <img
                  src={config.logo}
                  alt={`${config.brandName} Logo`}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <span className="text-white font-bold">
                    {config.brandName.charAt(0)}
                  </span>
                </div>
              )}
              <span className="text-xl font-bold">{config.brandName}</span>
            </div>
            <p className="text-gray-400 text-sm">
              Sistema completo de gestão para restaurantes. Transforme seu
              negócio com tecnologia.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Produto</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {config.features.pos && (
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Sistema POS
                  </a>
                </li>
              )}
              {config.features.loyalty && (
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Fidelidade
                  </a>
                </li>
              )}
              {config.features.campaigns && (
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Campanhas
                  </a>
                </li>
              )}
              {config.features.reports && (
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    Relatórios
                  </a>
                </li>
              )}
              {config.features.qrCodes && (
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    QR Codes
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href={config.website}
                  className="hover:text-white transition-colors"
                >
                  Sobre nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Carreiras
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${config.supportEmail}`}
                  className="hover:text-white transition-colors"
                >
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentação
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${config.supportEmail}`}
                  className="hover:text-white transition-colors"
                >
                  {config.supportEmail}
                </a>
              </li>
              {config.supportPhone && (
                <li>
                  <a
                    href={`tel:${config.supportPhone}`}
                    className="hover:text-white transition-colors"
                  >
                    {config.supportPhone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">{config.footerText}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {config.privacyPolicyUrl && (
              <a
                href={config.privacyPolicyUrl}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privacidade
              </a>
            )}
            {config.termsOfServiceUrl && (
              <a
                href={config.termsOfServiceUrl}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Termos
              </a>
            )}
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default WhiteLabelFooter;

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WhiteLabelConfig {
  // Branding
  brandName: string;
  logo: string;
  favicon: string;
  logoUrl?: string;
  faviconUrl?: string;

  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;

  // Typography
  fontFamily?: string;
  headingFont?: string;

  // Domain & URLs
  domain: string;
  customDomain?: string;
  subdomain?: string;

  // Features
  features: {
    pos: boolean;
    loyalty: boolean;
    campaigns: boolean;
    reports: boolean;
    qrCodes: boolean;
    delivery: boolean;
    multiRestaurant: boolean;
    whiteLabel: boolean;
    api: boolean;
    analytics: boolean;
  };

  // Contact & Support
  supportEmail: string;
  supportPhone: string;
  website: string;
  helpUrl?: string;
  documentationUrl?: string;

  // Social Media
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };

  // Custom CSS
  customCSS?: string;
  customJS?: string;

  // Footer
  footerText: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  // Integrations
  integrations?: {
    googleAnalytics?: string;
    facebookPixel?: string;
    hotjar?: string;
    intercom?: string;
  };

  // Customization Level
  customizationLevel: 'basic' | 'advanced' | 'enterprise';

  // Client Info
  clientId?: string;
  clientName?: string;
  clientPlan?: string;
}

interface WhiteLabelContextType {
  config: WhiteLabelConfig;
  updateConfig: (newConfig: Partial<WhiteLabelConfig>) => void;
  isWhiteLabel: boolean;
  clientId?: string;
  loadClientConfig: (clientId: string) => Promise<void>;
  resetToDefault: () => void;
  exportConfig: () => string;
  importConfig: (configJson: string) => boolean;
}

const defaultConfig: WhiteLabelConfig = {
  brandName: 'GastroBI+',
  logo: '/logo.svg',
  favicon: '/favicon.ico',
  primaryColor: '#3b82f6',
  secondaryColor: '#1e40af',
  accentColor: '#10b981',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  domain: 'gastrobi.com',
  features: {
    pos: true,
    loyalty: true,
    campaigns: true,
    reports: true,
    qrCodes: true,
    delivery: true,
    multiRestaurant: true,
    whiteLabel: true,
    api: true,
    analytics: true,
  },
  supportEmail: 'suporte@gastrobi.com',
  supportPhone: '(11) 99999-9999',
  website: 'https://gastrobi.com',
  socialMedia: {},
  footerText: '© 2024 GastroBI+. Todos os direitos reservados.',
  customizationLevel: 'enterprise',
};

const WhiteLabelContext = createContext<WhiteLabelContextType | undefined>(
  undefined
);

export function WhiteLabelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, setConfig] = useState<WhiteLabelConfig>(defaultConfig);
  const [isWhiteLabel, setIsWhiteLabel] = useState(false);
  const [clientId, setClientId] = useState<string>();

  useEffect(() => {
    loadWhiteLabelConfig();
  }, []);

  const loadWhiteLabelConfig = async () => {
    try {
      // Detectar se é white label baseado no domínio ou parâmetro
      const hostname =
        typeof window !== 'undefined' ? window.location.hostname : '';
      const urlParams =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search)
          : new URLSearchParams();
      const clientParam = urlParams.get('client');

      // Verificar se é um domínio customizado ou tem parâmetro client
      if (clientParam || !hostname.includes('gastrobi.com')) {
        setIsWhiteLabel(true);
        setClientId(clientParam || hostname);

        // Carregar configuração do cliente
        const clientConfig = await fetchClientConfig(clientParam || hostname);
        if (clientConfig) {
          setConfig({ ...defaultConfig, ...clientConfig });
          applyCustomStyles(clientConfig);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configuração white label:', error);
    }
  };

  const fetchClientConfig = async (
    clientId: string
  ): Promise<Partial<WhiteLabelConfig> | null> => {
    // Simulação - em produção seria uma chamada à API
    const mockConfigs: Record<string, Partial<WhiteLabelConfig>> = {
      'restaurantesystem.com': {
        brandName: 'RestauranteSystem',
        logo: '/logos/restaurantesystem-logo.svg',
        primaryColor: '#dc2626',
        secondaryColor: '#991b1b',
        accentColor: '#f59e0b',
        supportEmail: 'suporte@restaurantesystem.com',
        website: 'https://restaurantesystem.com',
        footerText: '© 2024 RestauranteSystem. Todos os direitos reservados.',
        customizationLevel: 'enterprise',
        clientId: 'restaurantesystem',
        clientName: 'RestauranteSystem',
        clientPlan: 'enterprise',
      },
      foodtech: {
        brandName: 'FoodTech Pro',
        logo: '/logos/foodtech-logo.svg',
        primaryColor: '#059669',
        secondaryColor: '#047857',
        accentColor: '#8b5cf6',
        supportEmail: 'help@foodtech.pro',
        website: 'https://foodtech.pro',
        footerText: '© 2024 FoodTech Pro. Todos os direitos reservados.',
        customizationLevel: 'advanced',
        clientId: 'foodtech',
        clientName: 'FoodTech Pro',
        clientPlan: 'premium',
      },
    };

    return mockConfigs[clientId] || null;
  };

  const applyCustomStyles = (config: Partial<WhiteLabelConfig>) => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    if (config.primaryColor) {
      root.style.setProperty('--color-primary', config.primaryColor);
    }
    if (config.secondaryColor) {
      root.style.setProperty('--color-secondary', config.secondaryColor);
    }
    if (config.accentColor) {
      root.style.setProperty('--color-accent', config.accentColor);
    }
    if (config.backgroundColor) {
      root.style.setProperty('--color-background', config.backgroundColor);
    }
    if (config.textColor) {
      root.style.setProperty('--color-text', config.textColor);
    }

    // Aplicar CSS customizado
    if (config.customCSS) {
      const styleElement = document.createElement('style');
      styleElement.textContent = config.customCSS;
      document.head.appendChild(styleElement);
    }

    // Aplicar JavaScript customizado
    if (config.customJS) {
      const scriptElement = document.createElement('script');
      scriptElement.textContent = config.customJS;
      document.head.appendChild(scriptElement);
    }

    // Atualizar favicon
    if (config.favicon) {
      const favicon = document.querySelector(
        'link[rel="icon"]'
      ) as HTMLLinkElement;
      if (favicon) {
        favicon.href = config.favicon;
      }
    }

    // Atualizar título da página
    if (config.brandName) {
      document.title = `${config.brandName} - Sistema de Gestão para Restaurantes`;
    }

    // Aplicar meta tags SEO
    if (config.metaDescription) {
      let metaDesc = document.querySelector(
        'meta[name="description"]'
      ) as HTMLMetaElement;
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = config.metaDescription;
    }

    // Aplicar Google Analytics
    if (config.integrations?.googleAnalytics) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.integrations.googleAnalytics}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${config.integrations.googleAnalytics}');
      `;
      document.head.appendChild(inlineScript);
    }
  };

  const updateConfig = (newConfig: Partial<WhiteLabelConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    applyCustomStyles(newConfig);
  };

  const loadClientConfig = async (clientId: string) => {
    const clientConfig = await fetchClientConfig(clientId);
    if (clientConfig) {
      setConfig({ ...defaultConfig, ...clientConfig });
      applyCustomStyles(clientConfig);
      setIsWhiteLabel(true);
      setClientId(clientId);
    }
  };

  const resetToDefault = () => {
    setConfig(defaultConfig);
    setIsWhiteLabel(false);
    setClientId(undefined);
    applyCustomStyles(defaultConfig);
  };

  const exportConfig = (): string => {
    return JSON.stringify(config, null, 2);
  };

  const importConfig = (configJson: string): boolean => {
    try {
      const importedConfig = JSON.parse(configJson);
      setConfig({ ...defaultConfig, ...importedConfig });
      applyCustomStyles(importedConfig);
      return true;
    } catch (error) {
      console.error('Erro ao importar configuração:', error);
      return false;
    }
  };

  return (
    <WhiteLabelContext.Provider
      value={{
        config,
        updateConfig,
        isWhiteLabel,
        clientId,
        loadClientConfig,
        resetToDefault,
        exportConfig,
        importConfig,
      }}
    >
      {children}
    </WhiteLabelContext.Provider>
  );
}

export function useWhiteLabel() {
  const context = useContext(WhiteLabelContext);
  if (context === undefined) {
    throw new Error('useWhiteLabel must be used within a WhiteLabelProvider');
  }
  return context;
}

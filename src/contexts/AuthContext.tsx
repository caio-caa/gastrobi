import React, { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'staff';
  restaurants: Restaurant[];
  currentRestaurant: Restaurant;
  permissions: string[];
  lastLogin: Date;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'suspended' | 'trial';
  trialEndsAt?: Date;
  settings: RestaurantSettings;
  integrations: RestaurantIntegrations;
}

interface RestaurantSettings {
  timezone: string;
  currency: string;
  loyaltyProgram: {
    enabled: boolean;
    pointsPerReal: number;
    bronzeThreshold: number;
    silverThreshold: number;
    goldThreshold: number;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
}

interface RestaurantIntegrations {
  whatsapp: {
    enabled: boolean;
    apiKey?: string;
    phoneNumber?: string;
  };
  email: {
    enabled: boolean;
    provider?: string;
    apiKey?: string;
  };
  sms: {
    enabled: boolean;
    provider?: string;
    apiKey?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  switchRestaurant: (restaurantId: string) => void;
  updateUserProfile: (data: Partial<User>) => void;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  enableTwoFactor: () => Promise<string>;
  verifyTwoFactor: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SECRET_KEY = 'gastrobi-secret-key-2024';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const savedUser = localStorage.getItem('gastrobi_user');
      const sessionToken = localStorage.getItem('gastrobi_session');
      
      if (savedUser && sessionToken) {
        // Verificar se a sessão ainda é válida
        const decryptedUser = CryptoJS.AES.decrypt(savedUser, SECRET_KEY).toString(CryptoJS.enc.Utf8);
        const userData = JSON.parse(decryptedUser);
        
        // Simular verificação de sessão
        if (isValidSession(sessionToken)) {
          setUser({
            ...userData,
            lastLogin: new Date(userData.lastLogin)
          });
        } else {
          // Sessão expirada
          localStorage.removeItem('gastrobi_user');
          localStorage.removeItem('gastrobi_session');
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
      localStorage.removeItem('gastrobi_user');
      localStorage.removeItem('gastrobi_session');
    } finally {
      setLoading(false);
    }
  };

  const isValidSession = (token: string): boolean => {
    try {
      const sessionData = JSON.parse(atob(token));
      const expirationTime = new Date(sessionData.expiresAt);
      return expirationTime > new Date();
    } catch {
      return false;
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    setLoading(true);
    
    try {
      // Simular autenticação segura
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validar credenciais (em produção seria uma chamada à API)
      if (email === 'admin@gastrobi.com' && password === '123456') {
        const userData: User = {
          id: '1',
          name: 'João Silva',
          email,
          role: 'owner',
          lastLogin: new Date(),
          isEmailVerified: true,
          twoFactorEnabled: false,
          permissions: ['all'],
          restaurants: [
            {
              id: '1',
              name: 'Restaurante do João',
              plan: 'premium',
              status: 'active',
              settings: {
                timezone: 'America/Sao_Paulo',
                currency: 'BRL',
                loyaltyProgram: {
                  enabled: true,
                  pointsPerReal: 1,
                  bronzeThreshold: 0,
                  silverThreshold: 200,
                  goldThreshold: 500
                },
                notifications: {
                  email: true,
                  sms: true,
                  whatsapp: true
                }
              },
              integrations: {
                whatsapp: {
                  enabled: true,
                  apiKey: 'wa_key_123',
                  phoneNumber: '+5511999999999'
                },
                email: {
                  enabled: true,
                  provider: 'SendGrid',
                  apiKey: 'sg_key_123'
                },
                sms: {
                  enabled: false
                }
              }
            },
            {
              id: '2',
              name: 'Pizzaria Express',
              plan: 'basic',
              status: 'active',
              settings: {
                timezone: 'America/Sao_Paulo',
                currency: 'BRL',
                loyaltyProgram: {
                  enabled: true,
                  pointsPerReal: 1,
                  bronzeThreshold: 0,
                  silverThreshold: 100,
                  goldThreshold: 300
                },
                notifications: {
                  email: true,
                  sms: false,
                  whatsapp: false
                }
              },
              integrations: {
                whatsapp: { enabled: false },
                email: { enabled: true, provider: 'SMTP' },
                sms: { enabled: false }
              }
            }
          ],
          currentRestaurant: {
            id: '1',
            name: 'Restaurante do João',
            plan: 'premium',
            status: 'active',
            settings: {
              timezone: 'America/Sao_Paulo',
              currency: 'BRL',
              loyaltyProgram: {
                enabled: true,
                pointsPerReal: 1,
                bronzeThreshold: 0,
                silverThreshold: 200,
                goldThreshold: 500
              },
              notifications: {
                email: true,
                sms: true,
                whatsapp: true
              }
            },
            integrations: {
              whatsapp: {
                enabled: true,
                apiKey: 'wa_key_123',
                phoneNumber: '+5511999999999'
              },
              email: {
                enabled: true,
                provider: 'SendGrid',
                apiKey: 'sg_key_123'
              },
              sms: {
                enabled: false
              }
            }
          }
        };
        
        // Criptografar dados do usuário
        const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(userData), SECRET_KEY).toString();
        
        // Criar token de sessão
        const sessionExpiration = rememberMe 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
          : new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
          
        const sessionToken = btoa(JSON.stringify({
          userId: userData.id,
          expiresAt: sessionExpiration.toISOString()
        }));
        
        localStorage.setItem('gastrobi_user', encryptedUser);
        localStorage.setItem('gastrobi_session', sessionToken);
        
        setUser(userData);
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gastrobi_user');
    localStorage.removeItem('gastrobi_session');
  };

  const switchRestaurant = (restaurantId: string) => {
    if (user) {
      const restaurant = user.restaurants.find(r => r.id === restaurantId);
      if (restaurant) {
        const updatedUser = { ...user, currentRestaurant: restaurant };
        setUser(updatedUser);
        
        // Atualizar dados criptografados
        const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(updatedUser), SECRET_KEY).toString();
        localStorage.setItem('gastrobi_user', encryptedUser);
      }
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(updatedUser), SECRET_KEY).toString();
      localStorage.setItem('gastrobi_user', encryptedUser);
    }
  };

  const resetPassword = async (email: string) => {
    // Simular envio de email de reset
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Email de reset enviado para: ${email}`);
  };

  const verifyEmail = async (token: string) => {
    // Simular verificação de email
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (user) {
      updateUserProfile({ isEmailVerified: true });
    }
  };

  const enableTwoFactor = async (): Promise<string> => {
    // Simular geração de QR code para 2FA
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'otpauth://totp/GastroBI+:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=GastroBI+';
  };

  const verifyTwoFactor = async (code: string) => {
    // Simular verificação de código 2FA
    await new Promise(resolve => setTimeout(resolve, 500));
    if (code === '123456') {
      if (user) {
        updateUserProfile({ twoFactorEnabled: true });
      }
    } else {
      throw new Error('Código inválido');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      switchRestaurant,
      updateUserProfile,
      resetPassword,
      verifyEmail,
      enableTwoFactor,
      verifyTwoFactor
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
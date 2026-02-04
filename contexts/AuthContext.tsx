'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'owner' | 'manager' | 'staff';
  type: 'ADMIN' | 'RESTAURANT';
  permissions: string[];
  lastLogin: Date;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Flag para usar API real ou mock
const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      // Verificar se há usuário salvo localmente
      const savedUser = localStorage.getItem('gastrobi_user_data');
      
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        // Se usando API real, validar sessão com o servidor
        if (USE_REAL_API) {
          try {
            const response = await authApi.me();
            if (response.data) {
              const validatedUser: User = {
                id: response.data.id,
                name: response.data.fullName,
                email: response.data.email,
                role: response.data.role.toLowerCase() as User['role'],
                type: response.data.type,
                permissions: ['all'],
                lastLogin: new Date(),
                isEmailVerified: true,
                twoFactorEnabled: false,
              };
              setUser(validatedUser);
              localStorage.setItem('gastrobi_user_data', JSON.stringify(validatedUser));
            }
          } catch {
            // Sessão inválida, manter usuário local por agora
            console.log('Sessão não validada, usando dados locais');
          }
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
      localStorage.removeItem('gastrobi_user_data');
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
    rememberMe = false
  ) => {
    setLoading(true);

    try {
      if (USE_REAL_API) {
        // Login via API real - sem fallback para mock
        const response = await authApi.loginAdmin(email, password);
        
        if (response.error) {
          throw new Error(response.error);
        }

        if (!response.data || !response.data.user) {
          throw new Error('Resposta inválida do servidor');
        }

        // Validação obrigatória de dados
        if (!response.data.user.id || !response.data.user.email) {
          throw new Error('Dados do usuário incompletos');
        }

        const userData: User = {
          id: response.data.user.id,
          name: response.data.user.fullName || 'Usuário',
          email: response.data.user.email,
          role: (response.data.user.role?.toLowerCase() || 'admin') as User['role'],
          type: response.data.user.type || 'ADMIN',
          permissions: response.data.user.permissions || ['all'],
          lastLogin: new Date(),
          isEmailVerified: response.data.user.isEmailVerified ?? true,
          twoFactorEnabled: response.data.user.twoFactorEnabled ?? false,
        };

        // Validar que user foi criado corretamente
        if (!userData.id || !userData.email) {
          throw new Error('Falha ao processar dados do usuário');
        }

        localStorage.setItem('gastrobi_user_data', JSON.stringify(userData));
        
        // Salvar token JWT
        if (response.data.token) {
          localStorage.setItem('gastrobi_token', response.data.token);
        }
        
        setUser(userData);
        console.log('✅ [AUTH] Login bem-sucedido:', userData.email);
      } else {
        // Login mock para desenvolvimento
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!email || !password) {
          throw new Error('Email e senha são obrigatórios');
        }

        const userData: User = {
          id: '1',
          name: 'Admin GastroBI',
          email,
          role: 'super_admin',
          type: 'ADMIN',
          lastLogin: new Date(),
          isEmailVerified: true,
          twoFactorEnabled: false,
          permissions: ['all'],
        };

        localStorage.setItem('gastrobi_user_data', JSON.stringify(userData));
        setUser(userData);
        console.log('✅ [AUTH] Login mock bem-sucedido:', email);
      }
    } catch (error) {
      console.error('❌ [AUTH] Erro no login:', error);
      setUser(null);
      localStorage.removeItem('gastrobi_user_data');
      localStorage.removeItem('gastrobi_token');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (USE_REAL_API) {
      await authApi.logout();
    }
    
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gastrobi_user_data');
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('gastrobi_user_data', JSON.stringify(updatedUser));
    }
  };

  const resetPassword = async (email: string) => {
    // TODO: Implementar via API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Email de reset enviado para: ${email}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUserProfile,
        resetPassword,
      }}
    >
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

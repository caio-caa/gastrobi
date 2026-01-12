'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  type: 'RESTAURANT';
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  currentRestaurant: Restaurant;
  restaurants: Restaurant[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user data exists in localStorage
        const storedUser = localStorage.getItem('restaurantUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Validate with API (opcional, pode remover se quiser apenas localStorage)
          const response = await authApi.me(parsedUser.currentRestaurant.id);
          if (response.data) {
            setUser(response.data.user || parsedUser);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('restaurantUser');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.loginRestaurant(email, password);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data?.user) {
        const userData = response.data.user;
        setUser(userData);
        
        // Save user to localStorage for persistence
        localStorage.setItem('restaurantUser', JSON.stringify(userData));
        
        router.push(`/dashboard/${userData.currentRestaurant.id}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (user?.currentRestaurant?.id) {
        await authApi.logout(user.currentRestaurant.id);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('restaurantUser');
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

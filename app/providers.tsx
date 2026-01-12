'use client';

import { WhiteLabelProvider } from '@/contexts/WhiteLabelContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WhiteLabelProvider>
      <AuthProvider>
        <DataProvider>
          {children}
        </DataProvider>
      </AuthProvider>
    </WhiteLabelProvider>
  );
}

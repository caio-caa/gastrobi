'use client';

import { WhiteLabelProvider } from '@/contexts/WhiteLabelContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { MenuProvider } from '@/contexts/MenuContext';
import { POSProvider } from '@/contexts/POSContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WhiteLabelProvider>
      <AuthProvider>
        <DataProvider>
          <MenuProvider>
            <POSProvider>{children}</POSProvider>
          </MenuProvider>
        </DataProvider>
      </AuthProvider>
    </WhiteLabelProvider>
  );
}

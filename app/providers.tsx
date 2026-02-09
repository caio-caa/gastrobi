'use client';

import { WhiteLabelProvider } from '@/contexts/WhiteLabelContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { MenuProvider } from '@/contexts/MenuContext';
import { POSProvider } from '@/contexts/POSContext';
import RouteGuard from '@/components/Auth/RouteGuard';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WhiteLabelProvider>
      <AuthProvider>
        <RouteGuard>
          <DataProvider>
            <MenuProvider>
              <POSProvider>{children}</POSProvider>
            </MenuProvider>
          </DataProvider>
        </RouteGuard>
      </AuthProvider>
    </WhiteLabelProvider>
  );
}

'use client';

import { WhiteLabelProvider } from '@/contexts/WhiteLabelContext';
import { MenuProvider } from '@/contexts/MenuContext';
import { CartProvider } from '@/contexts/CartContext';

// Front Customer Providers - Apenas o necessário para o cliente
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WhiteLabelProvider>
      <MenuProvider>
        <CartProvider>{children}</CartProvider>
      </MenuProvider>
    </WhiteLabelProvider>
  );
}

'use client';

import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'wagmi/chains';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseSepolia}
      config={{
        appearance: {
          name: 'True Cosmic Ancestry',
          logo: '/logo.png',
          mode: 'dark',
          // theme: { ... } // Removed custom theme object for compatibility
        },
        wallet: {
          display: 'modal',
          termsUrl: 'https://example.com/terms',
          privacyUrl: 'https://example.com/privacy',
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  );
} 
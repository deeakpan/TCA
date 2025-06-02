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
          theme: {
            colors: {
              primary: '#9333ea', // purple-600
              secondary: '#db2777', // pink-600
              background: '#000000',
              foreground: '#ffffff',
              muted: '#6b7280', // gray-500
              mutedForeground: '#9ca3af', // gray-400
              accent: '#9333ea', // purple-600
              accentForeground: '#ffffff',
              destructive: '#ef4444', // red-500
              destructiveForeground: '#ffffff',
              border: '#4c1d95', // purple-900
              input: '#1f2937', // gray-800
              ring: '#9333ea', // purple-600
            },
            borderRadius: '0.5rem',
            fontFamily: 'var(--font-geist-sans)',
          },
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
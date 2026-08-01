import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from '../store/index.js';
import { queryClient } from '../lib/queryClient.js';
import { ThemeProvider } from './ThemeProvider.js';
import { AppInitializer } from './AppInitializer.js';
import { SocketProvider } from './SocketProvider.js';
import { Toaster } from 'sonner';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppInitializer>
            <SocketProvider>
              {children}
              <Toaster position="top-right" richColors closeButton />
            </SocketProvider>
          </AppInitializer>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

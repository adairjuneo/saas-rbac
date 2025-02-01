'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Fragment, type ReactNode } from 'react';

import { Toaster } from '@/components/ui/toaster';
import { queryClient } from '@/lib/react-query';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </QueryClientProvider>
    </Fragment>
  );
}

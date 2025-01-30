import './globals.css';

import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';

import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'SaaS RBAC App',
  description: 'Saas created for study about RBAC.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

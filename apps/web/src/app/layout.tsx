import './globals.css';

import type { Metadata } from 'next';

import { Providers } from './providers';

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import './globals.css';

import type { Metadata } from 'next';

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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
